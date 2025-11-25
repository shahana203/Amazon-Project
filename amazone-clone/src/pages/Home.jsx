import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const categories = [
  { label: 'All', value: 'all' },
  { label:"Women's", value: 'girls-dresses' },
  { label: "Men's", value: "men's" },
  { label: 'Home Appliances', value: 'home-appliances' },
  { label: 'Sports', value: 'sports' },
  { label: 'Kitchenware', value: 'kitchen' },
  { label: 'Apparel', value: 'apparel' },
  { label: 'Bathroom', value: 'bathroom' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'Home Decor', value: 'home-decor' },
];

function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get('https://amazon-project-backend-fz5r.onrender.com/api/products');
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="bg-linear-to-r from-blue-100 to-yellow-100 min-h-screen pb-8">
      <Navbar />

      <div className="flex gap-4 my-4 justify-center flex-wrap">
  {categories.map(cat => (
    <button
      key={cat.value}
      onClick={() => setSelectedCategory(cat.value)}
      className={`px-4 py-2 rounded-lg font-medium border shadow transition 
        ${selectedCategory === cat.value ? 'bg-[#ffd814] text-black' : 'bg-white text-gray-700'}`}
    >
      {cat.label}
    </button>
  ))}
</div>

<div className="w-full min-h-52 bg-linear-to-r from-blue-200 via-yellow-50 to-yellow-100 flex items-center justify-center mb-4 mt-2 rounded-lg shadow-lg">
  <div className="flex flex-col sm:flex-row items-center justify-center w-full px-2 sm:px-6 gap-y-4">
    {/* Banner Image - mobile only */}
    <img
      src="images/promo-banner2.jpg"
      alt="Promo"
      className="block sm:hidden w-full h-32 object-cover rounded shadow-lg mb-2"
    />
    {/* Banner Image - left desktop */}
    <img
      src="images/promo-banner2.jpg"
      alt="Promo"
      className="hidden sm:block h-44 w-auto rounded shadow-lg ml-8"
    />
    <div className="flex-1 text-center px-2">
      <div className="text-2xl sm:text-4xl font-extrabold text-gray-700 mb-2">Super Value Days</div>
      <div className="text-base sm:text-xl text-gray-800 font-semibold">Best Deals, Fast Delivery – Shop Now</div>
      <div className="mt-2 text-sm font-normal text-gray-600">Extra offers on fashion & home appliances</div>
    </div>
    {/* Banner Image - right desktop */}
    <img
      src="images/promo-banner.jpg"
      alt="Promo"
      className="hidden sm:block h-44 w-auto rounded shadow-lg ml-8"
    />
  </div>
</div>

      <div className="max-w-[1200px] mx-auto p-4">
        {loading ? (
          <div>Loading products...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <Link to={`/product/${product._id}`} key={product._id} className="hover:scale-105 transition">
                <div className="bg-white rounded-xl shadow-lg px-6 py-8 flex flex-col items-center">
                  {/* Use backend-served image URL */}
                  <img src={`https://amazon-project-backend-fz5r.onrender.com/${product.image}`} alt={product.name} className="w-28 h-28 mb-3 object-contain" />
                  <div className="font-semibold mb-2 text-center">{product.name}</div>
                  <div className="flex mb-2 text-yellow-500 text-lg font-bold">
                    {'★'.repeat(Math.floor(product.rating?.stars || 0))}
                    {product.rating?.count && (
                      <span className="ml-2 text-xs text-gray-400 font-medium">({product.rating.count})</span>
                    )}
                  </div>
                  <div className="text-xl text-yellow-800 font-bold mb-2">₹{Math.round(product.priceCents)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Home;
