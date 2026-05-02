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

  // ── Add item to cart ──────────────────────────────────────
  function addToCart(pizza, size) {
    const price = pizza.sizes?.[size] || 0;

    setCartItems(prev => {
      const existing = prev.find(
        item => item._id === pizza._id && item.size === size
      );

      if (existing) {
        return prev.map(item =>
          item._id === pizza._id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, {
        _id      : pizza._id,
        name     : pizza.name,
        imageUrl : pizza.imageUrl,
        category : pizza.category,
        sizes    : pizza.sizes,   // ← store all sizes for price lookup
        size,
        price,
        quantity : 1,
      }];
    });
  }

  // ── Remove item from cart ─────────────────────────────────
  function removeFromCart(id, size) {
    setCartItems(prev =>
      prev.filter(item => !(item._id === id && item.size === size))
    );
  }

  // ── Increase quantity ─────────────────────────────────────
  function increaseQty(id, size) {
    setCartItems(prev =>
      prev.map(item =>
        item._id === id && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

