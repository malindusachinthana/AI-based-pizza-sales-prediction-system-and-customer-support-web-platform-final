// footer.jsx
// Place in: frontend/src/components/footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import logoCrust from '../assets/OvenzaCrust logo.png';
import '../style/footer.css';

export default function Footer() {
  return (
    <footer className="footer">

      {/* ── Logo ── */}
      <div className="footer-logo-wrap">
        <img src={logoCrust} alt="OvenZa Crust" className="footer-logo-img" />
        <span className="footer-logo-text">OVENZA</span>
      </div>

      {/* ── Social Icons ── */}
      <div className="footer-socials">

        {/* Facebook */}
        <button className="footer-social-btn" aria-label="Facebook" onClick={() => {}}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
        </button>

        {/* Instagram */}
        <button className="footer-social-btn" aria-label="Instagram" onClick={() => {}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
          </svg>
        </button>

        {/* Threads */}
        <button className="footer-social-btn" aria-label="Threads" onClick={() => {}}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068c0-3.516.85-6.37 2.495-8.424C5.845 1.37 8.6.19 12.18.167h.014c3.58.024 6.33 1.205 8.18 3.51C22.017 5.73 22.5 8.585 22.5 12.101c0 3.516-.483 6.37-2.126 8.424-1.85 2.305-4.6 3.485-8.182 3.51l-.006-.035zM12.18 2.1c-3.04.02-5.37 1.01-6.93 2.94-1.4 1.743-2.1 4.25-2.1 7.43 0 3.178.7 5.685 2.1 7.43 1.558 1.929 3.89 2.92 6.932 2.94 3.04-.02 5.37-1.01 6.93-2.94 1.4-1.745 2.1-4.252 2.1-7.43 0-3.18-.7-5.687-2.1-7.43-1.56-1.93-3.89-2.92-6.93-2.94zm.617 15.27a4.32 4.32 0 0 1-2.11-.51 3.62 3.62 0 0 1-1.47-1.43 4.15 4.15 0 0 1-.53-2.09c0-.78.18-1.48.53-2.07a3.63 3.63 0 0 1 1.47-1.42 4.31 4.31 0 0 1 2.11-.5c.77 0 1.46.17 2.07.5.61.34 1.09.82 1.43 1.43.34.62.52 1.34.52 2.17v.38h-5.97c.1.56.34 1 .73 1.3.39.31.87.47 1.44.47.44 0 .82-.08 1.14-.24.32-.16.59-.39.81-.69l1.28.97c-.32.48-.75.85-1.28 1.12-.53.27-1.15.41-1.85.41l.01-.02zm-.24-6.12c-.5 0-.93.15-1.28.44-.35.29-.57.69-.65 1.19h3.81c-.08-.5-.3-.9-.64-1.19-.35-.29-.76-.44-1.24-.44z"/>
          </svg>
        </button>

        {/* TikTok */}
        <button className="footer-social-btn" aria-label="TikTok" onClick={() => {}}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
          </svg>
        </button>

      </div>

      {/* ── Nav Links ── */}
      <nav className="footer-nav">
        <Link to="/">Home</Link>
        <span className="footer-divider">|</span>
        <Link to="/gallery">Gallery</Link>
        <span className="footer-divider">|</span>
        <Link to="/menu">Menu</Link>
        <span className="footer-divider">|</span>
        <Link to="/special-offers">Special Offers</Link>
        <span className="footer-divider">|</span>
        <Link to="/about">About Us</Link>
      </nav>

      {/* ── Copyright ── */}
      <p className="footer-copy">
        © 2026 OvenZa Crust. All Rights Reserved...!<br />
        By, Malindu Sachinthana.
      </p>

    </footer>
  );
}
