import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import amazonLogo from '../assets/amazon-logo-white.png';

function Navbar() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [search, setSearch] = useState('');
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  // Calculate cart count
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <nav className="bg-[#232F3E] text-white flex items-center px-6 py-3 sticky top-0 z-50 shadow">
      <img src={amazonLogo} alt="Amazon" className="w-20 mr-6" />
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center space-x-4">
        <input
          className="px-4 py-2 rounded-l  w-64 text-white"
          placeholder="Search Amazon"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="bg-[#febd69] text-white px-4 py-2 font-bold rounded-r" type="submit">
          Search
        </button>
      </form>
      
      {/* Auth Buttons */}
      {!isLoggedIn ? (
        <Link to="/login" className="ml-8 hover:underline">Sign in</Link>
      ) : (
        <button onClick={handleLogout} className="ml-8 hover:underline">Logout</button>
      )}

      {/* Cart Button */}
      <Link to="/cart" className="ml-4 hover:underline font-bold flex items-center relative">
        Cart
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-4 bg-yellow-400 text-black rounded-full text-sm font-extrabold px-2">
            {cartCount}
          </span>
        )}
      </Link>
    </nav>
  );
}

export default Navbar;

