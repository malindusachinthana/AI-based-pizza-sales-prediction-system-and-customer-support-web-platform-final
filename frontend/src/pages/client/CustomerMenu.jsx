import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import '../../style/CustomerMenu.css';

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
function PizzaCard({ pizza }) {
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

