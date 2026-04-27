import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../style/CustomerHome.css';

// Logos
import logo           from '../../assets/OvenZlogo.png';
import logoCrust      from '../../assets/OvenzaCrust logo.png';

// Hero / Main Background
import heroBg         from '../../assets/MainBackgound.png';

// About section
import aboutPizza     from '../../assets/mainimg.png';

// Gallery Strip
import galleryImg1    from '../../assets/home01.jpg';
import galleryImg2    from '../../assets/home02.jpg';
import galleryImg3    from '../../assets/home03.jpg';
import galleryImg4    from '../../assets/home04.jpg';

// Menu — Category Icons
import pizzaIcon      from '../../assets/pizzaIcon.png';
import chickenIcon    from '../../assets/chickenIcon.png';
import seafoodIcon    from '../../assets/seafoodIcon.png';
import cheeseIcon     from '../../assets/cheeseIcon.png';
import vegIcon        from '../../assets/vegIcon.png';

// Menu — Category Cards
import veggiePizza    from '../../assets/vegimg.jpg';
import chickenPizza   from '../../assets/theChickenAlfimg.jpg';
import classicPizza   from '../../assets/theClassicimg.jpg';
import supremePizza   from '../../assets/supremeimg.jpg';

// Menu — Size Cards
import largePizza     from '../../assets/theBigmeetimg.jpg';
import mediumPizza    from '../../assets/mainGalleryimg.png';
import smallPizza     from '../../assets/pepo2img.jpg';

// Special Offer
import offerPizza     from '../../assets/4cheeseimg.jpg';

// Gallery — OvenZa Foods
import foodImg1       from '../../assets/home05.jpg';
import foodImg2       from '../../assets/rest01.jpg';
import foodImg3       from '../../assets/thepepoimg.jpg';

// Gallery — OvenZa Lobby
import lobbyImg1      from '../../assets/home02.jpg';
import lobbyImg2      from '../../assets/home03.jpg';
import lobbyImg3      from '../../assets/home04.jpg';

// ── Scroll Reveal Hook ───────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, Number(delay));
          }
        });
      },
      { threshold: 0.13 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ── Logout Animation Overlay ─────────────────────────────────
function LogoutOverlay({ show }) {
  if (!show) return null;
  return (
    <div className="logout-overlay">
      <div className="logout-box">
        <div className="logout-pizza">🍕</div>
        <h2 className="logout-title">See You Soon!</h2>
        <p className="logout-sub">You have been logged out.</p>
        <div className="logout-bar-wrap">
          <div className="logout-bar" />
        </div>
      </div>
    </div>
  );
}

// Navbar
function Navbar() {
  const navRef   = useRef(null);
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false); // ✅ Add this

  const token    = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const role     = localStorage.getItem('userRole');

  // ✅ Updated logout with animation
  const handleLogout = () => {
    setShowLogout(true); // Show animation
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
      navigate('/');
      setShowLogout(false);
    }, 2500); // Wait 2.5s then redirect
  };

  const handleLoginRedirect  = () => navigate('/login');
  const handleAdminRedirect  = () => navigate('/admin-dashboard');
  const handleProfileRedirect = () => { if (token) navigate('/customer-profile'); };

  useEffect(() => {
    const onScroll = () => {
      if (navRef.current) {
        navRef.current.style.background =
          window.scrollY > 60
            ? 'rgba(20, 26, 16, 0.98)'
            : 'rgba(20, 26, 16, 0.75)';
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ✅ Logout Overlay */}
      <LogoutOverlay show={showLogout} />

      <nav className="navbar" ref={navRef}>
        {/* ── Left Links ── */}
        <ul className="navbar-links-left">
          <li><Link to="/" className="active">Home</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>
        </ul>

        {/* ── Center Logo ── */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="OvenZa Logo" />
        </Link>

        {/* ── Right Links ── */}
        <ul className="navbar-links-right">
          <li><Link to="/menu">Menu</Link></li>
          <li><Link to="/special-offers">Special Offers</Link></li>
          <li><Link to="/about">About Us</Link></li>
        </ul>

