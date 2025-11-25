import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from 'react-router-dom';
import Footer from "../components/Footer";

function Checkout() {
  const { cartItems } = useCart();
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("card");
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Subtotal calculation (if cartItems contains full product info)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product.priceCents * item.quantity),
    0
  );

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!address) return setError("Address required.");
    try {
      await axios.post('https://amazon-project-backend-fz5r.onrender.com/api/orders', {
        address,
        payment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.error || "Order failed.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-amber-50 to-blue-50 pb-16">
      <Navbar />
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-7 mt-8">
        {/* LEFT: Checkout Form Steps */}
        <form onSubmit={handleOrder} className="md:col-span-2 bg-white rounded-xl shadow p-7">
          {/* STEP 1: Shipping Address */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-2">1. Shipping Address</h2>
            <input
              type="text"
              placeholder="Enter your address"
              className="border rounded px-4 py-2 w-full mb-2"
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
            />
            <button type="button" className="text-blue-700 underline text-sm ml-1">Change</button>
          </div>
          {/* STEP 2: Payment Selection */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-2">2. Choose a payment method</h2>
            <label className="flex items-center mb-2">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={payment === "card"}
                onChange={e => setPayment(e.target.value)}
              />
              <span className="ml-3">Credit/Debit Card</span>
            </label>
            <label className="flex items-center mb-2">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={payment === "cod"}
                onChange={e => setPayment(e.target.value)}
              />
              <span className="ml-3">Cash on Delivery</span>
            </label>
            <button type="button" className="text-blue-700 underline text-sm">Use this payment method</button>
          </div>
          {error && <div className="text-red-600">{error}</div>}
        </form>
        {/* RIGHT: Order Summary Panel */}
        <div className="bg-white rounded-xl shadow p-7 md:col-span-1">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          {cartItems.length === 0 ? (
            <div>No items in cart.</div>
          ) : (
            <>
              <div>
                {cartItems.map(item => (
                  <div key={item.product._id} className="flex justify-between mb-3">
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>₹{item.product.priceCents * item.quantity}</span>
                  </div>
                ))}
              </div>
              <hr className="my-4" />
              <div className="flex justify-between font-bold">
                <span>Items:</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between my-1">
                <span>Shipping &amp; handling:</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between text-lg mt-3 text-red-600">
                <span>Order total:</span>
                <span>₹{subtotal}</span>
              </div>
              <button
                type="submit"
                className="mt-6 w-full py-3 bg-green-600 text-white font-bold rounded"
                onClick={handleOrder}
              >
                Place Order
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Checkout;
