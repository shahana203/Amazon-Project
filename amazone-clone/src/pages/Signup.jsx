import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- Add this
import axios from "axios";
import amazonLogo from "../assets/amazon-logo.png";
import { GoogleLogin } from '@react-oauth/google';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post("https://amazon-project-backend-fz5r.onrender.com/api/auth/signup", form);
      setMessage("Signup successful! Please login.");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000); 
    } catch (err) {
      setMessage(
        err.response?.data?.error || "Signup failed. Try again."
      );
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setMessage('');
    const token = credentialResponse.credential;
    try {
      const res = await axios.post('https://amazon-project-backend-fz5r.onrender.com/api/auth/google-signin', { token });
      
      setMessage("Google Signup successful! Welcome.");
      navigate("/", { replace: true });
    } catch (err) {
      setMessage(err.response?.data?.error || "Google Signup failed.");
    }
  };

  const handleGoogleError = () => {
    setMessage('Google Sign-In failed');
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col items-center justify-center">
      <img src={amazonLogo} alt="Amazon Logo" className="w-24 mb-6" />
      <div className="w-[350px] bg-white border border-gray-300 shadow rounded-md p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">Create account</h1>
        <form className="space-y-3" onSubmit={handleSignup}>
          <div>
            <label className="block text-sm mb-1">Your name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-400 rounded-sm focus:ring-2 focus:ring-yellow-500 text-base"
              placeholder="First and last name"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Mobile number or email</label>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-400 rounded-sm focus:ring-2 focus:ring-yellow-500 text-base"
              placeholder="Mobile number or email"
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
              placeholder="At least 6 characters"
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
        {/* Show feedback message directly under Google button */}
        {message && (
          <div className={`mt-2 text-sm ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}
        {/* Login link - positioned higher for visibility */}
        <div className="mt-4 text-sm flex justify-center">
          Already have an account?
          <a href="/login" className="text-blue-600 hover:underline ml-2 font-semibold">Sign in</a>
        </div>
        <div className="mt-4 text-xs text-gray-700">
          By creating account, you agree to Amazon's
          <a href="#" className="text-blue-600 hover:underline ml-1">Conditions of Use</a>
          <span> and </span>
          <a href="#" className="text-blue-600 hover:underline">Privacy Notice</a>.
        </div>
      </div>
      <footer className="w-full fixed bottom-0 left-0 flex justify-center gap-6 bg-[#f3f3f3] py-4 text-xs text-gray-600">
        <a href="#" className="hover:underline">Conditions of Use</a>
        <a href="#" className="hover:underline">Privacy Notice</a>
        <a href="#" className="hover:underline">Help</a>
      </footer>
    </div>
  );
}

export default Signup;
