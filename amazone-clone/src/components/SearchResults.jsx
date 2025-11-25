import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery().get('q') || '';
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('https://amazon-project-backend.vercel.app/api/products')
      .then(res => setAllProducts(res.data))
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  }, []);

  // Filter products in frontend
  const filtered = allProducts.filter(prod =>
    prod.name.toLowerCase().includes(query.toLowerCase()) ||
    (prod.description && prod.description.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-8 bg-white mt-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6">Search results for: "{query}"</h2>
        {loading ? (
          <div>Loading...</div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filtered.map(prod => (
              <Link to={`/product/${prod._id}`} key={prod._id} className="bg-gray-50 rounded shadow p-4 hover:scale-105">
                <img src={`https://amazon-project-backend.vercel.app/${prod.image}`} alt={prod.name} className="w-32 h-32 mx-auto object-contain mb-2" />
                <div className="font-bold">{prod.name}</div>
                <div className="text-gray-900 font-bold text-base">₹{Math.round(prod.priceCents)}</div>
              </Link>
            ))}
          </div>
        ) : (
          <div>No products found for this search.</div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default SearchResults;
