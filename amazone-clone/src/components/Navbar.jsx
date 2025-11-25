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
    <nav className="bg-[#232F3E] text-white flex flex-col sm:flex-row items-center px-3 sm:px-6 py-2 sm:py-3 sticky top-0 z-50 shadow w-full">
      <div className="flex items-center w-full sm:w-auto mb-2 sm:mb-0">
        <img src={amazonLogo} alt="Amazon" className="w-20 sm:w-24 mr-4 sm:mr-6" />
        {/* Cart Button (mobile only, to avoid crowding) */}
        <Link to="/cart" className="block sm:hidden ml-auto hover:underline font-bold flex items-center relative mr-2">
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-yellow-400 text-black rounded-full text-xs font-extrabold px-1">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex w-full sm:flex-1 items-center space-x-2 sm:space-x-4 mb-2 sm:mb-0">
        <input
          className="flex-1 px-3 py-2 rounded-l w-full sm:w-64 text-black placeholder:text-gray-500"
          placeholder="Search Amazon"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="bg-[#febd69] text-white px-3 sm:px-4 py-2 font-bold rounded-r whitespace-nowrap" type="submit">
          Search
        </button>
      </form>
      {/* Auth + Cart on desktop */}
      <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end gap-2 sm:gap-4 mt-2 sm:mt-0">
        {!isLoggedIn ? (
          <Link to="/login" className="hover:underline whitespace-nowrap">Sign in</Link>
        ) : (
          <button onClick={handleLogout} className="hover:underline whitespace-nowrap">Logout</button>
        )}
        <Link to="/cart" className="hidden sm:flex ml-0 hover:underline font-bold items-center relative">
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-yellow-400 text-black rounded-full text-xs font-extrabold px-1">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
