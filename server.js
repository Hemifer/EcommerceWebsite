const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get } = require('firebase/database');

const stripe = Stripe('sk_test_51Q2fPBRqC36KgL0FfaGstIbSU28irut9NS8Ml5vnoadGvoLoY3ugWIJRYtZ8hqPPhMiMGDX7ANkVWfsyafLzBMmK00gwPejI9C');
const app = express();
const firebaseConfig = {
  apiKey: "AIzaSyDAW1Je1m1gMLJaGtk_BAieTVcOvbbvWY8",
  authDomain: "hemimerce.firebaseapp.com",
  projectId: "hemimerce",
  storageBucket: "hemimerce.appspot.com",
  messagingSenderId: "369022506676",
  appId: "1:369022506676:web:bb4f2b334e3d3a51eea9e1",
  measurementId: "G-HDLDYKQMZM"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

app.use(cors());
app.use(bodyParser.json());

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'pistillityler@gmail.com',
    pass: 'fpee jzij xxmq tcpb',
  },
});

// Function to send an email receipt
async function sendEmailReceipt(userEmail, cartItems, totalAmount, orderId) {
  const itemsList = cartItems.map(item => `${item.name} (x${item.quantity}) - $${(item.price / 100).toFixed(2)}`).join(', ');
  const cancelOrderLink = `http://localhost:5000/api/cancel-order/${orderId}`;
  const mailOptions = {
    from: 'no-reply@example.com',
    to: userEmail,
    subject: 'Your Receipt from HemiMerce!',
    html: `
      <p>Thank you for your purchase!</p>
      <p>You ordered: ${itemsList}</p>
      <p>Total amount: $${(totalAmount / 100).toFixed(2)}</p>
      <p>Your order will be shipped within a week.</p>
      <p>If you'd like to cancel your order, click here: <a href="${cancelOrderLink}">Cancel Order</a></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Receipt sent to ${userEmail}`);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
  }
}

// Function to send gift confirmation email
async function sendGiftConfirmation(recipientEmail, recipientName, orderId, cartItems) {
  const itemsList = cartItems.map(item => `${item.name} (x${item.quantity})`).join(', ');
  const acceptGiftLink = `http://localhost:5000/api/accept-gift/${orderId}`;
  const declineGiftLink = `http://localhost:5000/api/decline-gift/${orderId}`;
  const mailOptions = {
    from: 'no-reply@example.com',
    to: recipientEmail,
    subject: 'You Have a Gift!',
    html: `
      <p>Hi ${recipientName},</p>
      <p>You have received a gift from HemiMerce!</p>
      <p>Gift items: ${itemsList}</p>
      <p>Would you like to accept this gift?</p>
      <p><a href="${acceptGiftLink}">Accept Gift</a> | <a href="${declineGiftLink}">Decline Gift</a></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Gift confirmation sent to ${recipientEmail}`);
  } catch (error) {
    console.error(`Error sending gift confirmation email: ${error.message}`);
  }
}

// Function to calculate the total amount based on cart items (including sale price)
function calculateTotalAmount(cartItems) {
  return Math.round(cartItems.reduce((total, item) => total + item.salePrice * item.quantity, 0) * 100);  // Use salePrice instead of regular price
}

// Handle payment creation
app.post('/create-payment-intent', async (req, res) => {
  const { paymentMethodId, cartItems, userEmail, isGift, recipientName, recipientEmail } = req.body;
  const totalAmount = calculateTotalAmount(cartItems);
  const orderId = `order_${new Date().getTime()}`;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'cad',
      payment_method: paymentMethodId,
      automatic_payment_methods: { enabled: true },
    });

    // Save order in Firebase (include sale prices)
    await set(ref(db, `orders/${orderId}`), {
      status: 'pending', // Set status as pending for gifts
      userEmail: userEmail,
      cartItems: cartItems,
      totalAmount: totalAmount,
    });

    // Send email receipt to user
    await sendEmailReceipt(userEmail, cartItems, totalAmount, orderId);

    // If it's a gift, send a confirmation email to the recipient
    if (isGift) {
      await sendGiftConfirmation(recipientEmail, recipientName, orderId, cartItems);
    }

    res.send({ paymentIntent });
  } catch (error) {
    console.error(`Payment error: ${error.message}`);
    res.status(500).send({ error: error.message });
  }
});

// Accept gift API
app.get('/api/accept-gift/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const orderRef = ref(db, `orders/${orderId}`);
    const orderSnapshot = await get(orderRef);

    if (!orderSnapshot.exists()) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = orderSnapshot.val();
    await set(orderRef, { ...orderData, status: 'accepted' });

    // Send confirmation email to the sender
    const senderEmail = orderData.userEmail;
    const acceptMailOptions = {
      from: 'no-reply@example.com',
      to: senderEmail,
      subject: 'Gift Accepted',
      text: `Your gift with ID: ${orderId} has been accepted by the recipient. Items included: ${orderData.cartItems.map(item => `${item.name} (x${item.quantity})`).join(', ')}`,
    };

    await transporter.sendMail(acceptMailOptions);

    res.json({ message: 'Gift accepted successfully' });
  } catch (error) {
    console.error(`Error accepting gift: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Decline gift API
app.get('/api/decline-gift/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const orderRef = ref(db, `orders/${orderId}`);
    const orderSnapshot = await get(orderRef);

    if (!orderSnapshot.exists()) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = orderSnapshot.val();
    await set(orderRef, { ...orderData, status: 'declined' });

    // Send cancellation email to the sender
    const senderEmail = orderData.userEmail;
    const declineMailOptions = {
      from: 'no-reply@example.com',
      to: senderEmail,
      subject: 'Gift Declined',
      text: `Your gift with ID: ${orderId} has been declined by the recipient.`,
    };

    await transporter.sendMail(declineMailOptions);

    res.json({ message: 'Gift declined successfully' });
  } catch (error) {
    console.error(`Error declining gift: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Cancel order API
app.get('/api/cancel-order/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const orderRef = ref(db, `orders/${orderId}`);
    const orderSnapshot = await get(orderRef);

    if (!orderSnapshot.exists()) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = orderSnapshot.val();
    
    if (orderData.status === 'shipped') {
      return res.status(400).json({ error: 'Order already shipped. Cannot be canceled.' });
    }

    await set(orderRef, { ...orderData, status: 'canceled' });

    // Send cancellation email
    const userEmail = orderData.userEmail;
    const cancelMailOptions = {
      from: 'no-reply@example.com',
      to: userEmail,
      subject: 'Order Canceled',
      text: `Your order with ID: ${orderId} has been canceled.`,
    };

    await transporter.sendMail(cancelMailOptions);

    res.json({ message: 'Order canceled successfully' });
  } catch (error) {
    console.error(`Error canceling order: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
