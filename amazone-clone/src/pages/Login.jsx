import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // <-- Add this
import axios from "axios";
import amazonLogo from "../assets/amazon-logo.png";
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  // Store original path (e.g., /cart, /checkout, etc.) for redirect after login
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveAuthData = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post("https://amazon-project-backend.vercel.app/api/auth/login", form);
      saveAuthData(res.data.token, res.data.user);
      setMessage("Login successful! Welcome.");
      navigate(from, { replace: true }); // <-- Redirect on success
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed. Try again.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setMessage('');
    const token = credentialResponse.credential;
    try {
      const res = await axios.post('https://amazon-project-backend.vercel.app/api/auth/google-signin', { token });
      saveAuthData(res.data.token, res.data.user);
      setMessage("Google Login successful! Welcome.");
      navigate(from, { replace: true }); // <-- Redirect on success
    } catch (err) {
      setMessage(err.response?.data?.error || "Google login failed.");
    }
  };

  const handleGoogleError = () => {
    setMessage('Google Sign-In failed');
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col items-center justify-center">
      <img src={amazonLogo} alt="Amazon Logo" className="w-24 mb-6" />
      <div className="w-[350px] bg-white border border-gray-300 shadow rounded-md p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">Sign in</h1>
        <form className="space-y-3" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm mb-1">Email or mobile phone number</label>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-400 rounded-sm focus:ring-2 focus:ring-yellow-500 text-base"
              placeholder="Email or mobile"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-400 rounded-sm focus:ring-2 focus:ring-yellow-500 text-base"
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-800 font-bold rounded-sm border border-yellow-400 transition"
          >
            Continue
          </button>
        </form>
        <div className="my-4 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            width="100%"
          />
        </div>
        {message && (
          <div className={`mt-2 text-sm ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}
        <div className="mt-4 text-xs text-gray-700">
          By continuing, you agree to Amazon's
          <a href="#" className="text-blue-600 hover:underline ml-1">Conditions of Use</a>
          <span> and </span>
          <a href="#" className="text-blue-600 hover:underline">Privacy Notice</a>.
        </div>
        <a href="/signup" className="mt-2 text-blue-600 hover:underline font-semibold text-sm block">
          New to Amazon?  Create your account
        </a>
      </div>
      <footer className="w-full fixed bottom-0 left-0 flex justify-center gap-6 bg-[#f3f3f3] py-4 text-xs text-gray-600">
        <a href="#" className="hover:underline">Conditions of Use</a>
        <a href="#" className="hover:underline">Privacy Notice</a>
        <a href="#" className="hover:underline">Help</a>
      </footer>
    </div>
  );
}

export default Login;
