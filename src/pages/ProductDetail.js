import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { kitchenwareProducts } from './KitchenwarePage';
import { toyProducts } from './ToysPage';
import Navbar from '../components/Navbar';
import { translations } from '../context/translations';
import { useLanguage } from '../context/LanguageContext';
import { useOnSale } from '../context/OnSaleContext';
import { ref, set, get, push } from 'firebase/database'; // Import Firebase methods
import { auth, db } from '../firebase'; // Import Firebase setup
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useWishlist();
  const navigate = useNavigate();
  const { language: currentLanguage } = useLanguage();
  const { onSaleProduct } = useOnSale();
  const [isAdding, setIsAdding] = useState(false);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [reviews, setReviews] = useState([]); // State to hold reviews
  const [newReview, setNewReview] = useState(''); // State for new review input
  const [userEmail, setUserEmail] = useState('');

  const productId = parseInt(id, 10);

  // Find the selected product
  const product =
    kitchenwareProducts.find((p) => p.id === productId) ||
    toyProducts.find((p) => p.id === productId);

  const updatedProduct =
    onSaleProduct?.id === productId ? { ...product, ...onSaleProduct } : product;

  // Fetch user's rating on mount
  useEffect(() => {
    const fetchUserRating = async () => {
      const userId = auth.currentUser?.uid;
      if (userId && updatedProduct) {
        const ratingRef = ref(db, `products/${updatedProduct.id}/ratings/${userId}`);
        const snapshot = await get(ratingRef);
        if (snapshot.exists()) {
          const userRatingData = snapshot.val();
          setUserRating(userRatingData.rating); // Set the user rating
          setRating(userRatingData.rating);     // Set the selected rating
        }
      }
    };
  
    fetchUserRating();
  }, [updatedProduct]); // Re-run only when the product changes
  

  // Fetch reviews on mount
  useEffect(() => {
    const reviewsRef = ref(db, `products/${updatedProduct?.id}/reviews`);
    get(reviewsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setReviews(Object.values(data));
      }
    });
  }, [updatedProduct]);

  // Fetch user's email
  useEffect(() => {
    const fetchUserRating = async () => {
      const userId = auth.currentUser?.uid;
      if (userId && updatedProduct) {
        const ratingRef = ref(db, `products/${updatedProduct.id}/ratings/${userId}`);
        const snapshot = await get(ratingRef);
        if (snapshot.exists()) {
          const userRatingData = snapshot.val();
          setUserRating(userRatingData.rating); // Set the user rating in the local state
        }
      }
    };
  
    fetchUserRating();
  }, [updatedProduct]); // Re-run the effect when the product changes
  

  const handleRating = async (selectedRating) => {
    setRating(selectedRating); // Update local state with the new rating
    
    const userId = auth.currentUser?.uid;
    const userEmail = auth.currentUser?.email;
    
    if (userId && updatedProduct) {
      // Reference to the product's ratings for the specific user
      const ratingRef = ref(db, `products/${updatedProduct.id}/ratings/${userId}`);
      
      // Overwrite the old rating with the new one
      await set(ratingRef, { rating: selectedRating, email: userEmail });
    }
  };
  
  

  const handleAddReview = async () => {
    if (newReview.trim() === '') return;
  
    const reviewRef = push(ref(db, `products/${updatedProduct?.id}/reviews`));
    const reviewData = {
      user: auth.currentUser?.email, // Store user's email
      text: newReview, // Review message
    };
  
    await set(reviewRef, reviewData);
  
    setReviews((prevReviews) => [...prevReviews, reviewData]);
    setNewReview('');
  };
  
  

  const handleAddToCart = async (event) => {
    event.preventDefault();
    if (isAdding) return;
    setIsAdding(true);

    if (!updatedProduct.price) {
      console.error('Product price is missing when adding to cart:', updatedProduct);
      setIsAdding(false);
      return;
    }

    await addToCart(updatedProduct);
    setIsAdding(false);
  };

  const handleAddToWishlist = async (event) => {
    event.preventDefault();
    console.log('Adding to wishlist:', updatedProduct);
    await addToWishlist(updatedProduct);
  };

  return (
    <div>
      <Navbar />
      <div className="product-detail-container">
        {/* Left Column for Ratings */}
        <div className="product-detail-left">
          <div className="rating-container">
            <h3>Rate this product:</h3>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${rating >= star ? 'filled' : ''}`}
                onClick={() => handleRating(star)}
              >
                ★
              </span>
            ))}
            {userRating > 0 && <p>Your rating: {userRating}/5</p>}
          </div>
        </div>
  
        {/* Right Column for Product Details */}
        <div className="product-detail-right">
          <h1 className="product-detail-title">{updatedProduct.name}</h1>
          <img src={updatedProduct.image} alt={updatedProduct.name} className="product-detail-image" />
          <p className="product-detail-description">{updatedProduct.description}</p>
          <p className="product-detail-price">
            <strong>{translations[currentLanguage].price}:</strong>{' '}
            {updatedProduct.onSale ? (
              <>
                <span className="original-price">${updatedProduct.price.toFixed(2)}</span>
                <span className="sale-price">On Sale for ${updatedProduct.discountedPrice.toFixed(2)}!</span>
              </>
            ) : (
              `$${updatedProduct.price.toFixed(2)}`
            )}
          </p>
          <button onClick={handleAddToCart} className="product-detail-add-to-cart-button">
            {translations[currentLanguage].addToCart}
          </button>
          <button onClick={handleAddToWishlist} className="product-detail-add-to-wishlist-button">
            {translations[currentLanguage].productPageWishlist}
          </button>
        </div>
  
        {/* Reviews Section */}
        <div className="reviews-section">
          <h3>Reviews:</h3>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <p key={index}>
                <strong>{review.user}</strong>: {review.text}
              </p>
            ))
          ) : (
            <p>No reviews yet. Be the first to review!</p>
          )}
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review..."
          />
          <button onClick={handleAddReview}>Submit Review</button>
        </div>
      </div>
    </div>
  );
  
}

export default ProductDetail;
