import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  // cartItems from context (already fetched from backend and are objects with .product populated!)
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  // Defensive: cartItems may look like [{ product: {...actualProductFields}, quantity: 2 }, ...]
  const cartItemsDetailed = cartItems
    .filter(item => item.product) // filter out any nulls (edge case)
    .map(item => ({
      ...item.product,            // spread the product fields: _id, name, priceCents, etc
      quantity: item.quantity     // keep quantity from the cart
    }));

  const subtotal = cartItemsDetailed.reduce(
    (sum, prod) => sum + (prod.priceCents || 0) * (prod.quantity || 0),
    0
  );

  return (
    <div className="min-h-screen bg-linear-to-r from-amber-50 to-blue-50 pb-16">
      <Navbar />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8 mt-8">
        <h2 className="text-2xl font-bold mb-5">Shopping Cart</h2>
        {cartItemsDetailed.length === 0 ? (
          <div className="text-center text-gray-600">Your cart is empty.</div>
        ) : (
          <div>
            {cartItemsDetailed.map(prod => (
              <div key={prod._id} className="flex items-center mb-6 border-b pb-3">
                <img
                  src={`http://localhost:5005/${prod.image}`}
                  alt={prod.name}
                  className="w-20 h-20 object-contain rounded mr-4"
                />
                <div className="flex-1">
                  <div className="font-semibold">{prod.name}</div>
                  <div className="text-yellow-600">
                    {'★'.repeat(Math.floor(prod.rating?.stars || 0))}
                    <span className="ml-2 text-xs text-gray-400">
                      ({prod.rating?.count || 0})
                    </span>
                  </div>
                  <div className="text-gray-700 mt-1">₹{prod.priceCents}</div>
                  <div className="flex items-center mt-3">
                    <button
                      className="px-2 bg-gray-100 border rounded"
                      onClick={() => updateQuantity(prod._id, prod.quantity - 1)}
                      disabled={prod.quantity === 1}
                    >-</button>
                    <span className="mx-4">{prod.quantity}</span>
                    <button
                      className="px-2 bg-gray-100 border rounded"
                      onClick={() => updateQuantity(prod._id, prod.quantity + 1)}
                    >+</button>
                    <button
                      className="ml-6 px-3 py-1 bg-red-100 border border-red-300 rounded text-red-700"
                      onClick={() => removeFromCart(prod._id)}
                    >Remove</button>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-right font-bold text-lg mt-8">Subtotal: ₹{subtotal}</div>
            <button
              onClick={handleCheckout}
              className="mt-6 px-6 py-3 bg-[#ffd814] hover:bg-[#f7ca00] rounded font-bold text-gray-900 border border-yellow-400 shadow"
            >Proceed to Checkout</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Cart;
