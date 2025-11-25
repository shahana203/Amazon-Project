import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token'); // User's JWT token

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const { data } = await axios.get("https://amazon-project-backend-fz5r.onrender.com/api/orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data);
      } catch (err) {
        setOrders([]);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-r from-amber-50 to-blue-50 pb-16">
      <Navbar />
      <div className="max-w-3xl mx-auto mt-12 bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
        {loading ? (
          <div>Loading...</div>
        ) : orders.length === 0 ? (
          <div>No orders placed yet.</div>
        ) : (
          orders.map(order => (
            <div key={order._id} className="border-b pb-4 mb-6">
              <div className="font-bold mb-2">Order #{order._id}</div>
              <div className="mb-1"><b>Address:</b> {order.address}</div>
              <div className="mb-1"><b>Payment:</b> {order.payment === "card" ? "Credit/Debit Card" : "Cash on Delivery"}</div>
              <div className="mb-1"><b>Status:</b> {order.status}</div>
              <div>
                {order.items.map(item => (
                  <div key={item.product._id} className="flex justify-between py-2">
                    <span>
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>₹{item.product.priceCents * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="font-bold text-right mt-2 mb-1">Order Total: ₹{order.subtotal}</div>
              <div className="text-xs text-gray-400">Placed on: {new Date(order.createdAt).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Orders;
