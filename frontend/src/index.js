import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CartProvider } from './context/CartContext'; // ✅ Added

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CartProvider>  {/* ✅ Added */}
      <App />
    </CartProvider>  {/* ✅ Added */}
  </React.StrictMode>
);

reportWebVitals();