import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Chatbot from '../../components/chatbot.jsx';
import '../../style/aboutUs.css';

import aboutPizza from '../../assets/mainGalleryimg.png';
import heroBg     from '../../assets/MainBackgound.png';

// Scroll Reveal
function useReveal() {
  const observerRef = useRef(null);

  useEffect(() => {
    // Small timeout so DOM is fully painted before observing
    const timer = setTimeout(() => {
      const targets = document.querySelectorAll('.au-reveal, .au-reveal-left, .au-reveal-right');

      observerRef.current = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const delay = Number(entry.target.dataset.delay) || 0;
              setTimeout(() => {
                entry.target.classList.add('au-visible');
              }, delay);
              // ✅ Unobserve immediately after triggering — no continuous watching
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      targets.forEach(el => observerRef.current.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []); // ✅ Empty array — runs once only
}

export default function AboutUs() {
  useReveal();

  return (
    <>
      <Navbar />

      <main className="au-page">

        {/* Hero */}
        <section className="au-hero">
          <div className="au-hero-bg" style={{ backgroundImage: `url(${heroBg})` }} />
          <div className="au-hero-overlay" />
          <div className="au-hero-content">
            <span className="au-hero-label">Our Story</span>
            <h1 className="au-hero-title">About OvenZa Crust</h1>
            <div className="au-hero-divider" />
            <p className="au-hero-sub">
              Where Italian craft meets Sri Lankan warmth — every pizza tells our story.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="au-section">
          <div className="au-container">
            <div className="au-story-grid">

              <div className="au-story-img-wrap au-reveal-left">
                <img src={aboutPizza} alt="OvenZa wood-fired pizza" className="au-story-img" />
                <div className="au-story-badge">
                  <span className="au-story-badge-icon">🔥</span>
                  <span>Wood<br/>Fired</span>
                </div>
              </div>

              <div className="au-story-text au-reveal-right">
                <span className="au-section-label">Who We Are</span>
                <h2 className="au-section-title">
                  Crafted with Passion,<br />Served with Soul.
                </h2>
                <div className="au-gold-divider" />
                <p className="au-section-desc">
                  OvenZa Crust was born from a simple dream — to bring the authentic flavour of
                  traditional Italian wood-fired pizza to the heart of Colombo, Sri Lanka. We
                  believe that great pizza is more than just food; it's an experience.
                </p>
                <p className="au-section-desc">
                  Every pizza we craft is baked fresh in our traditional wood-fired oven, using
                  premium hand-picked ingredients and time-honoured techniques passed down through
                  generations of Italian pizza masters — with a touch of Sri Lankan warmth.
                </p>
                <div className="au-story-tags">
                  <span>🍕 Wood-Fired</span>
                  <span>🌿 Fresh Ingredients</span>
                  <span>❤️ Made with Love</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="au-stats-section">
          <div className="au-container">
            <div className="au-stats-grid au-reveal">
              {[
                { num: '4+',   label: 'Pizza Categories'     },
                { num: '20+',  label: 'Unique Flavours'      },
                { num: '3',    label: 'Size Options'         },
                { num: '100%', label: 'Wood-Fired Authentic' },
              ].map(({ num, label }) => (
                <div key={label} className="au-stat-card">
                  <span className="au-stat-num">{num}</span>
                  <span className="au-stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="au-section au-section--alt">
          <div className="au-container">
            <div className="au-center au-reveal">
              <span className="au-section-label">Why OvenZa</span>
              <h2 className="au-section-title">What Makes Us Special</h2>
              <div className="au-gold-divider au-gold-divider--center" />
            </div>

            <div className="au-features-grid">
              {[
                {
                  icon:  '🔥',
                  title: 'Traditional Wood-Fired Oven',
                  desc:  'Our pizzas are baked at 400°C in an authentic wood-fired oven, giving every crust that irreplaceable smoky char and crispy base.'
                },
                {
                  icon:  '🌿',
                  title: 'Fresh Premium Ingredients',
                  desc:  'From vine-ripened tomatoes to hand-stretched mozzarella, every ingredient is carefully sourced for maximum freshness and flavour.'
                },
                {
                  icon:  '👨‍🍳',
                  title: 'Skilled Artisan Chefs',
                  desc:  'Our chefs bring years of experience and passion to every pizza, combining traditional Italian methods with local Sri Lankan creativity.'
                },
                {
                  icon:  '🏡',
                  title: 'Warm Neighbourhood Vibe',
                  desc:  'Whether you visit us in Maharagama or order online, we treat every customer like a neighbour — with genuine warmth and hospitality.'
                },
                {
                  icon:  '🍕',
                  title: '4 Unique Categories',
                  desc:  'Classic, Chicken, Supreme, and Veggie — our diverse menu ensures there is a perfect pizza for every craving and every occasion.'
                },
                {
                  icon:  '📦',
                  title: 'Easy Online Ordering',
                  desc:  'Order your favourite pizza online in minutes, pay securely via PayPal, and enjoy a seamless experience from click to first bite.'
                },
              ].map((f, i) => (
                <div key={i} className="au-feature-card au-reveal" data-delay={i * 80}>
                  <span className="au-feature-icon">{f.icon}</span>
                  <h3 className="au-feature-title">{f.title}</h3>
                  <p className="au-feature-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Info Cards */}
        <section className="au-section">
          <div className="au-container">
            <div className="au-center au-reveal">
              <span className="au-section-label">Find Us</span>
              <h2 className="au-section-title">Visit & Contact</h2>
              <div className="au-gold-divider au-gold-divider--center" />
            </div>

            <div className="au-info-grid">
              <div className="au-info-card au-reveal" data-delay="0">
                <div className="au-info-icon">📍</div>
                <h3 className="au-info-title">Location</h3>
                <p className="au-info-text">
                  No. 23, OvenZa Crust<br />
                  Maharagama, Colombo<br />
                  Sri Lanka
                </p>
              </div>
              <div className="au-info-card au-reveal" data-delay="100">
                <div className="au-info-icon">🕐</div>
                <h3 className="au-info-title">Opening Hours</h3>
                <div className="au-hours">
                  <div className="au-hours-row">
                    <span>Mon – Fri</span>
                    <span>10:00 AM – 11:00 PM</span>
                  </div>
                  <div className="au-hours-row">
                    <span>Sat – Sun</span>
                    <span>9:00 AM – 12:00 AM</span>
                  </div>
                </div>
              </div>
              <div className="au-info-card au-reveal" data-delay="200">
                <div className="au-info-icon">📞</div>
                <h3 className="au-info-title">Contact Us</h3>
                <p className="au-info-text">
                  📞 +94 11 234 5678<br />
                  📧 info@ovenzacrust.lk
                </p>
              </div>
              <div className="au-info-card au-reveal" data-delay="300">
                <div className="au-info-icon">💳</div>
                <h3 className="au-info-title">Payment Methods</h3>
                <p className="au-info-text">
                  We accept secure online payments via <strong>PayPal</strong>.<br />
                  More options coming soon!
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="au-cta-section au-reveal">
          <div className="au-cta-overlay" />
          <div className="au-cta-content">
            <h2 className="au-cta-title">Ready to Experience OvenZa?</h2>
            <p className="au-cta-sub">Taste the tradition — order your pizza today.</p>
            <div className="au-cta-btns">
              <Link to="/menu"    className="au-btn-primary">Order Now 🍕</Link>
              <Link to="/gallery" className="au-btn-outline">View Gallery</Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <Chatbot />
    </>
  );
}