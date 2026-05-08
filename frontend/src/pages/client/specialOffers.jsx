// SpecialOffers.jsx
// Place in: frontend/src/pages/client/SpecialOffers.jsx

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Chatbot from '../../components/chatbot.jsx';
import '../../style/specialOffers.css';

const API_BASE = 'http://localhost:5000';

export default function SpecialOffers() {
  const [offers,  setOffers]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/offers/active`)
      .then(res => res.json())
      .then(data => { setOffers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      <main className="so-page">

        {/* ── Hero Banner ── */}
        <section className="so-hero">
          <div className="so-hero-overlay" />
          <div className="so-hero-content">
            <span className="so-hero-label">OvenZa Crust</span>
            <h1 className="so-hero-title">Special Offers</h1>
            <p className="so-hero-sub">
              Handpicked deals crafted with love — enjoy more for less
            </p>
            <div className="so-hero-divider" />
          </div>
        </section>

        {/* ── Offers Section ── */}
        <section className="so-offers-section">
          <div className="so-container">

            {loading && (
              <div className="so-loading">
                <span className="so-loading-emoji">✦</span>
                <p>Loading offers...</p>
              </div>
            )}

            {!loading && offers.length === 0 && (
              <div className="so-empty">
                <span>🍕</span>
                <h3>No active offers right now</h3>
                <p>Check back soon — great deals are coming!</p>
              </div>
            )}

            {!loading && offers.map((offer) => {
              const imgs = offer.images || [];
              return (
                <div key={offer._id} className="so-offer-card">

                  {/* Left — Badge */}
                  <div className="so-badge-wrap">
                    <span className="so-badge-main">
                      {offer.badgeMain.split('\n').map((line, j) => (
                        <React.Fragment key={j}>{line}{j < offer.badgeMain.split('\n').length - 1 && <br />}</React.Fragment>
                      ))}
                    </span>
                    <span className="so-badge-sub">
                      {offer.badgeSub.split('\n').map((line, j) => (
                        <React.Fragment key={j}>{line}{j < offer.badgeSub.split('\n').length - 1 && <br />}</React.Fragment>
                      ))}
                    </span>
                  </div>
