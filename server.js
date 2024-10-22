const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');

const stripe = Stripe('sk_test_51Q2fPBRqC36KgL0FfaGstIbSU28irut9NS8Ml5vnoadGvoLoY3ugWIJRYtZ8hqPPhMiMGDX7ANkVWfsyafLzBMmK00gwPejI9C');
const app = express();

app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse incoming JSON requests
// Function to calculate the total amount based on cart items
function calculateTotalAmount(cartItems) {
  // Assuming cartItems is an array of objects with a 'price' field
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0); // Adjust the calculation based on your cart structure
}

app.post('/create-payment-intent', async (req, res) => {
  const { paymentMethodId, cartItems } = req.body;

  // Calculate the total price based on cartItems
  const totalAmount = calculateTotalAmount(cartItems);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd', // Adjust the currency if needed
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
    });
    res.send({ paymentIntent });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

