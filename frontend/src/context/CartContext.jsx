import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// ── Load cart from localStorage on startup ────────────────────
function loadCart() {
  try {
    const saved = localStorage.getItem('ovenza_cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCart);

  // ── Save cart to localStorage whenever it changes ─────────
  useEffect(() => {
    localStorage.setItem('ovenza_cart', JSON.stringify(cartItems));
  }, [cartItems]);

