import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { useCart } from '../../context/CartContext';
import '../../style/CustomerMenu.css';
import Chatbot from '../../components/chatbot.jsx'

// ── Login Required Modal ──────────────────────────────────────
function LoginModal({ onLogin, onCancel }) {
  return (
    <div className="login-modal-overlay">
      <div className="login-modal-box">
        <div className="login-modal-icon">🔒</div>
        <h2 className="login-modal-title">Login Required</h2>
        <p className="login-modal-msg">
          You need to log in to add items to your cart and place an order.
        </p>
        <div className="login-modal-btns">
          <button className="login-modal-btn-primary" onClick={onLogin}>🔑 Login</button>
          <button className="login-modal-btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Hero Section ──────────────────────────────────────────────
function MenuHero() {
  return (
    <div className="menu-hero">
      <div className="menu-hero-overlay" />
      <div className="menu-hero-content">
        <h1 className="menu-hero-title">M E N U</h1>
        <p className="menu-hero-subtitle">
          Explore a world of tastier possibilities with our wide range of sizes and
          authentic flavors inspired by cuisines from around the globe...!
        </p>
      </div>
    </div>
  );
}

// ── Category Filter ───────────────────────────────────────────
function CategoryFilter({ active, setActive, counts, onCategoryClick }) {
  const categories = ['All', 'Classic', 'Chicken', 'Supreme', 'Veggie'];
  return (
    <div className="category-filter">
      {categories.map(cat => (
        <button
          key={cat}
          className={`filter-btn ${active === cat ? 'filter-btn--active' : ''}`}
          onClick={() => onCategoryClick(cat)}
        >
          {cat}
          {counts[cat] > 0 && <span className="filter-count">{counts[cat]}</span>}
        </button>
      ))}
    </div>
  );
}

// ── Pizza Card ────────────────────────────────────────────────
function PizzaCard({ pizza, onLoginRequired }) {
  const [selectedSize, setSelectedSize] = useState('medium');
  const [added,        setAdded]        = useState(false);
  const { addToCart }                   = useCart();

  function handleAddToCart() {
    const token    = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    if (!token || userRole === 'admin') { onLoginRequired(); return; }
    addToCart(pizza, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="menu-pizza-card">
      <div className="menu-pizza-img-wrap">
        <img src={`http://localhost:5000${pizza.imageUrl}`} alt={pizza.name} className="menu-pizza-img" />
      </div>
      <div className="menu-pizza-body">
        <h3 className="menu-pizza-name">{pizza.name}</h3>
        <div className="menu-size-wrap">
          <select className="menu-size-select" value={selectedSize} onChange={e => setSelectedSize(e.target.value)}>
            <option value="small">Small  — Rs. {pizza.sizes?.small}</option>
            <option value="medium">Medium — Rs. {pizza.sizes?.medium}</option>
            <option value="large">Large  — Rs. {pizza.sizes?.large}</option>
          </select>
        </div>
        <p className="menu-pizza-price">Rs. {pizza.sizes?.[selectedSize]?.toLocaleString()}</p>
        <button className={`menu-cart-btn ${added ? 'menu-cart-btn--added' : ''}`} onClick={handleAddToCart}>
          {added ? '✓ Added!' : '🛒 Add to Cart'}
        </button>
      </div>
    </div>
  );
}

// ── Category Section ──────────────────────────────────────────
function CategorySection({ category, pizzas, onLoginRequired }) {
  if (pizzas.length === 0) return null;
  return (
    <div className="menu-category-section" id={`cat-${category}`}>
      <h2 className="menu-category-title">{category}</h2>
      <div className="menu-pizza-grid">
        {pizzas.map(pizza => (
          <PizzaCard key={pizza._id} pizza={pizza} onLoginRequired={onLoginRequired} />
        ))}
      </div>
    </div>
  );
}

// ── Scroll helper ─────────────────────────────────────────────
function scrollToCategory(category) {
  const el = document.getElementById(`cat-${category}`);
  if (el) {
    const offset = 110; // navbar height + filter bar
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

// ── Main Export ───────────────────────────────────────────────
export default function CustomerMenu() {
  const [pizzas,         setPizzas]         = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [error,          setError]          = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // ── Read ?category= from URL (coming from Home page cards) ──
  useEffect(() => {
    const params   = new URLSearchParams(location.search);
    const category = params.get('category');
    const valid    = ['Classic', 'Chicken', 'Supreme', 'Veggie'];
    if (category && valid.includes(category)) {
      setActiveCategory(category);
      // Wait for pizzas to render, then scroll
      setTimeout(() => scrollToCategory(category), 800);
    }
  }, [location.search]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/pizzas')
      .then(res => setPizzas(res.data))
      .catch(err => { setError('Failed to load menu.'); console.error(err); })
      .finally(() => setLoading(false));
  }, []);

  // ── Always show ALL pizzas, filter just highlights & scrolls ──
  const allCategories = ['Classic', 'Chicken', 'Supreme', 'Veggie'];

  const grouped = {
    Classic: pizzas.filter(p => p.category === 'Classic'),
    Chicken: pizzas.filter(p => p.category === 'Chicken'),
    Supreme: pizzas.filter(p => p.category === 'Supreme'),
    Veggie:  pizzas.filter(p => p.category === 'Veggie'),
  };

  const counts = {
    All:     pizzas.length,
    Classic: grouped.Classic.length,
    Chicken: grouped.Chicken.length,
    Supreme: grouped.Supreme.length,
    Veggie:  grouped.Veggie.length,
  };

  // ── Category button click ─────────────────────────────────
  function handleCategoryClick(cat) {
    setActiveCategory(cat);
    if (cat === 'All') {
      // Scroll to top of menu content
      const el = document.querySelector('.menu-content');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      scrollToCategory(cat);
    }
  }

  return (
    <>
      <Navbar />

      {showLoginModal && (
        <LoginModal
          onLogin={() => { setShowLoginModal(false); navigate('/login'); }}
          onCancel={() => setShowLoginModal(false)}
        />
      )}

      <div className="menu-page">
        <MenuHero />

        <div className="menu-filter-wrap">
          <CategoryFilter
            active={activeCategory}
            setActive={setActiveCategory}
            counts={counts}
            onCategoryClick={handleCategoryClick}
          />
        </div>

        <div className="menu-content">
          {loading ? (
            <div className="menu-loading">
              <div className="menu-loading-pizza">🍕</div>
              <p>Loading our delicious menu...</p>
            </div>
          ) : error ? (
            <div className="menu-error"><p>{error}</p></div>
          ) : pizzas.length === 0 ? (
            <div className="menu-empty">
              <div className="menu-empty-icon">🍕</div>
              <p>Menu is being prepared. Check back soon!</p>
            </div>
          ) : (
            // ── Always render ALL categories ──
            allCategories.map(category => (
              <CategorySection
                key={category}
                category={category}
                pizzas={grouped[category]}
                onLoginRequired={() => setShowLoginModal(true)}
              />
            ))
          )}
        </div>
      </div>

      <Footer />
      <Chatbot />
    </>
  );
}
