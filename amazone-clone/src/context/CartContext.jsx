import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchCart() {
      if (!token) return;
      try {
        const { data } = await axios.get('http://localhost:5005/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(data.items || []);
      } catch (err) {
        setCartItems([]);
      }
    }
    fetchCart();
  }, [token]);

  const addToCart = async (product) => {
    if (!token || !product || !product._id) return;
    await axios.post('http://localhost:5005/api/cart/add', {
      productId: product._id,
      quantity: 1
    }, { headers: { Authorization: `Bearer ${token}` } });

    const { data } = await axios.get('http://localhost:5005/api/cart', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCartItems(data.items || []);
  };

  const updateQuantity = async (productId, quantity) => {
    if (!token) return;
    await axios.post('http://localhost:5005/api/cart/update', {
      productId, quantity
    }, { headers: { Authorization: `Bearer ${token}` } });

    const { data } = await axios.get('http://localhost:5005/api/cart', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCartItems(data.items || []);
  };

  const removeFromCart = async (productId) => {
    if (!token) return;
    await axios.post('http://localhost:5005/api/cart/remove', {
      productId
    }, { headers: { Authorization: `Bearer ${token}` } });

    const { data } = await axios.get('http://localhost:5005/api/cart', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCartItems(data.items || []);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}
