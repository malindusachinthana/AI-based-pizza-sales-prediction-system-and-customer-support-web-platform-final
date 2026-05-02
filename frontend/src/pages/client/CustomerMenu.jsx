import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { useCart } from '../../context/CartContext';
import '../../style/CustomerMenu.css';

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
          <button className="login-modal-btn-primary" onClick={onLogin}>
            🔑 Login
          </button>
          <button className="login-modal-btn-secondary" onClick={onCancel}>
            Cancel
          </button>
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
function CategoryFilter({ active, setActive, counts }) {
  const categories = ['All', 'Classic', 'Chicken', 'Supreme', 'Veggie'];
  return (
    <div className="category-filter">
      {categories.map(cat => (
        <button
          key={cat}
          className={`filter-btn ${active === cat ? 'filter-btn--active' : ''}`}
          onClick={() => setActive(cat)}
        >
          {cat}
          {counts[cat] > 0 && (
            <span className="filter-count">{counts[cat]}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ── Pizza Card ────────────────────────────────────────────────
  const [selectedSize, setSelectedSize] = useState('medium');

  
  return (
    <div className="menu-pizza-card">

      {/* Image */}
      <div className="menu-pizza-img-wrap">
        <img
          src={`http://localhost:5000${pizza.imageUrl}`}
          alt={pizza.name}
          className="menu-pizza-img"
        />
      </div>

      {/* Info */}
      <div className="menu-pizza-body">
        <h3 className="menu-pizza-name">{pizza.name}</h3>

        {/* Size Dropdown */}
        <div className="menu-size-wrap">
          <select
            className="menu-size-select"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="small">
              Small — Rs. {pizza.sizes?.small}
            </option>
            <option value="medium">
              Medium — Rs. {pizza.sizes?.medium}
            </option>
            <option value="large">
              Large — Rs. {pizza.sizes?.large}
            </option>
          </select>
        </div>

        {/* Purchase Button */}
        <button className="menu-purchase-btn">
          Purchase
        </button>
      </div>
    </div>
  );
}

// ── Category Section ──────────────────────────────────────────
function CategorySection({ category, pizzas }) {
  if (pizzas.length === 0) return null;

  return (
    <div className="menu-category-section">
      <h2 className="menu-category-title">{category}</h2>
      <div className="menu-pizza-grid">
        {pizzas.map(pizza => (
          <PizzaCard key={pizza._id} pizza={pizza} />
        ))}
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────
export default function CustomerMenu() {
  const [pizzas,         setPizzas]         = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [error,          setError]          = useState(null);

  // Fetch pizzas from backend
  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/pizzas');
        setPizzas(res.data);
      } catch (err) {
        setError('Failed to load menu. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, []);

  // Filter pizzas by category
  const filteredPizzas = activeCategory === 'All'
    ? pizzas
    : pizzas.filter(p => p.category === activeCategory);

  // Count per category for filter buttons
  const counts = {
    All:     pizzas.length,
    Classic: pizzas.filter(p => p.category === 'Classic').length,
    Chicken: pizzas.filter(p => p.category === 'Chicken').length,
    Supreme: pizzas.filter(p => p.category === 'Supreme').length,
    Veggie:  pizzas.filter(p => p.category === 'Veggie').length,
  };

  // Group by category
  const grouped = {
    Classic: filteredPizzas.filter(p => p.category === 'Classic'),
    Chicken: filteredPizzas.filter(p => p.category === 'Chicken'),
    Supreme: filteredPizzas.filter(p => p.category === 'Supreme'),
    Veggie:  filteredPizzas.filter(p => p.category === 'Veggie'),
  };

  return (
    <>
      <Navbar />

      <div className="menu-page">

        {/* Hero */}
        <MenuHero />

        {/* Category Filter */}
        <div className="menu-filter-wrap">
          <CategoryFilter
            active={activeCategory}
            setActive={setActiveCategory}
            counts={counts}
          />
        </div>

        {/* Content */}
        <div className="menu-content">
          {loading ? (
            <div className="menu-loading">
              <div className="menu-loading-pizza">🍕</div>
              <p>Loading our delicious menu...</p>
            </div>
          ) : error ? (
            <div className="menu-error">
              <p>{error}</p>
            </div>
          ) : pizzas.length === 0 ? (
            <div className="menu-empty">
              <div className="menu-empty-icon">🍕</div>
              <p>Menu is being prepared. Check back soon!</p>
            </div>
          ) : (
            Object.entries(grouped).map(([category, list]) => (
              <CategorySection
                key={category}
                category={category}
                pizzas={list}
              />
            ))
          )}
        </div>

      </div>

      <Footer />
    </>
  );
}