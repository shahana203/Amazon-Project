import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import amazonLogo from '../assets/amazon-logo-white.png';

function Navbar() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem("token"));

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
    <nav className="bg-[#232F3E] text-white flex items-center px-3 sm:px-6 py-2 sm:py-3 sticky top-0 z-50 shadow w-full relative">
      {/* Logo */}
      <img src={amazonLogo} alt="Amazon" className="w-20 sm:w-24 mr-2 sm:mr-6" />

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center space-x-2 sm:space-x-4">
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

      {/* Hamburger Menu (Mobile) */}
      <button
        className="sm:hidden ml-2 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {menuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
          )}
        </svg>
      </button>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-4 ml-6">
        {!isLoggedIn ? (
          <Link to="/login" className="hover:underline whitespace-nowrap">Sign in</Link>
        ) : (
          <button onClick={handleLogout} className="hover:underline whitespace-nowrap">Logout</button>
        )}
        <Link to="/cart" className="flex items-center relative hover:underline font-bold">
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-yellow-400 text-black rounded-full text-xs font-extrabold px-1">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden absolute right-3 top-full mt-2 bg-white text-black rounded shadow-lg py-2 w-40">
          <Link
            to="/cart"
            className="block px-4 py-2 hover:bg-gray-100 font-bold relative"
            onClick={() => setMenuOpen(false)}
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute top-2 right-3 bg-yellow-400 text-black rounded-full text-xs font-extrabold px-1">
                {cartCount}
              </span>
            )}
          </Link>
          {!isLoggedIn ? (
            <Link
              to="/login"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setMenuOpen(false)}
            >
              Sign in
            </Link>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
