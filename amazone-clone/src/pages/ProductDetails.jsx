import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

function ProductDetails() {
  const { addToCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Review state: NO 'user' field
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get(`https://amazon-project-backend-fz5r.onrender.com/api/products/${id}`);
        setProduct(data);
        const allProductsRes = await axios.get('https://amazon-project-backend-fz5r.onrender.com/api/products');
        const related = allProductsRes.data.filter(
          p => p.category === data.category && p._id !== id
        ).slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load product");
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }
    if (!product || !product._id) {
      alert("Error: Product not available for cart.");
      return;
    }
    await addToCart(product);
    navigate("/cart");
  };

  // ----- Reviews functionality -----
  const handleReviewChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to submit a review.');
      setSubmitting(false);
      navigate('/login');
      return;
    }
    try {
      await axios.post(
        `https://amazon-project-backend-fz5r.onrender.com/api/products/${product._id}/reviews`,
        reviewForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { data } = await axios.get(`https://amazon-project-backend-fz5r.onrender.com/api/products/${product._id}`);
      setProduct(data);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      alert('Review submission failed');
    }
    setSubmitting(false);
  };

  if (loading) return <div>Loading product...</div>;

  if (error || !product)
    return (
      <div className="min-h-screen bg-linear-to-r from-amber-50 to-blue-50 pb-16">
        <Navbar />
        <div className="max-w-xl mx-auto mt-12 p-8 bg-white rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold mb-3">Product Not Found</h2>
          <Link to="/" className="text-blue-600 underline">Go back home</Link>
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-r from-amber-50 to-blue-50 pb-16">
      <Navbar />
      <div className="max-w-3xl mx-auto mt-8 flex flex-col md:flex-row gap-8 bg-white rounded-xl shadow-md p-8">
        <div className="flex-1 flex justify-center items-start">
          <img src={`https://amazon-project-backend-fz5r.onrender.com/${product.image}`} alt={product.name} className="w-64 h-64 object-contain rounded shadow" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <div className="flex items-center mb-2 text-yellow-700 text-lg font-bold">
            {'★'.repeat(Math.floor(product.rating?.stars || 0))}
            <span className="ml-2 text-base text-gray-600">({product.rating?.count || 0} ratings)</span>
          </div>
          <div className="text-2xl text-gray-900 font-bold mb-2">₹{Math.round(product.priceCents)}</div>
          <div className="mb-2 text-gray-700">Category: <span className="font-medium">{product.category}</span></div>
          <div className="mb-6 text-sm text-gray-600">{product.description}</div>
          <button
            onClick={handleAddToCart}
            className="mt-2 px-7 py-3 bg-[#ffd814] hover:bg-[#f7ca00] rounded font-bold text-gray-800 border border-yellow-400 shadow-md"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* --------- Reviews Section --------- */}
      <div className="max-w-3xl mx-auto bg-white mt-8 p-6 rounded-xl shadow">
        <h3 className="font-bold text-xl mb-3 text-gray-800">Customer Reviews</h3>
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review, idx) => (
            <div key={idx} className="border-t py-2 flex flex-col">
              <span className="font-semibold text-gray-700">{review.user}</span>
              <span className="text-yellow-600">{'★'.repeat(review.rating)}</span>
              <span className="text-gray-600 text-sm">{review.comment}</span>
            </div>
          ))
        ) : (
          <div>No reviews yet.</div>
        )}

        {/* Review Submission Form */}
        <form onSubmit={submitReview} className="mt-6 border-t pt-4">
          <div className="flex flex-row gap-2">
            <select
              name="rating"
              value={reviewForm.rating}
              onChange={handleReviewChange}
              required
              className="border px-2 py-1 rounded"
            >
              {[5, 4, 3, 2, 1].map(num => (
                <option key={num} value={num}>{num} stars</option>
              ))}
            </select>
          </div>
          <textarea
            name="comment"
            value={reviewForm.comment}
            onChange={handleReviewChange}
            placeholder="Your review"
            required
            className="border px-2 py-1 rounded mt-2 w-full"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-1 rounded mt-2"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>

      {/* --------- Related Products --------- */}
      <div className="max-w-3xl mx-auto bg-white mt-8 p-6 rounded-xl shadow">
        <h3 className="font-bold text-xl mb-5 text-gray-800">Related Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.length > 0 ? (
            relatedProducts.map(rel => (
              <Link to={`/product/${rel._id}`} key={rel._id} className="bg-gray-50 rounded-lg p-3 text-center shadow hover:scale-105 transition">
                <img src={`https://amazon-project-backend-fz5r.onrender.com/${rel.image}`} alt={rel.name} className="w-24 h-24 object-contain mx-auto mb-2" />
                <div className="font-medium text-sm mb-1">{rel.name}</div>
                <div className="text-yellow-700 text-sm mb-1">{'★'.repeat(Math.floor(rel.rating?.stars || 0))}</div>
                <div className="text-gray-900 font-bold text-base">₹{Math.round(rel.priceCents)}</div>
              </Link>
            ))
          ) : (
            <div>No related products found.</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetails;
