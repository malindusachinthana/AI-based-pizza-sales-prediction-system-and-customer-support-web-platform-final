import React from 'react';
import { Link } from 'react-router-dom';
import '../style/footer.css';
import logoCrust from '../assets/OvenzaCrust logo.png';

export default function Footer() {
  return (
    <footer className="footer">

      {/* ── Logo ── */}
      <div className="footer-logo">
        <img src={logoCrust} alt="OvenZa Crust" />
        <span>OvenZa</span>
      </div>

      {/* ── Links ── */}
      <ul className="footer-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/gallery">Gallery</Link></li>
        <li><Link to="/menu">Menu</Link></li>
        <li><Link to="/special-offers">Special Offers</Link></li>
        <li><Link to="/about">About Us</Link></li>
      </ul>

      {/* ── Copyright ── */}
      <p className="footer-copy">
        © 2026 OvenZa Crust. All Rights Reserved<br />
        <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>
          By, Malindu Sachinthana
        </span>
      </p>

    </footer>
  );
}