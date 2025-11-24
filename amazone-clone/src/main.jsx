// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
//
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,)

import React from 'react';
import ReactDOM from 'react-dom/client';
 import './index.css'
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Use your actual client ID below!
ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="976142216986-p7o7eun2kauogpqump1d2rbgjqdcrcnk.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
