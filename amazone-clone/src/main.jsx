import React from 'react';
import ReactDOM from 'react-dom/client';
 import './index.css'
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Use your actual client ID below!
ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="64657402130-0flu5jrnacorsncjlsm1m1i3efavc21a.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
