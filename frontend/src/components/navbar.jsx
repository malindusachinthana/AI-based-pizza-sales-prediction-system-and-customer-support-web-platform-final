import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../style/navbar.css';
import logo from '../assets/OvenZlogo.png';
import { useCart } from '../context/CartContext';

// Login Transition Overlay
function LoginTransitionOverlay({ show }) {
  if (!show) return null;
  return (
    <div className="login-overlay">
      <div className="login-box">
        <div className="login-pizza">🍕</div>
        <h2 className="login-title">Let's Login to OvenZa Crust..!</h2>
        <p className="login-sub">Taking you to the login page...</p>
        <div className="login-bar-wrap">
          <div className="login-bar" />
        </div>
      </div>
    </div>
  );
}

// ─── Logout Overlay ───────────────────────────────────────────────────────────
function LogoutOverlay({ show }) {
  if (!show) return null;
  return (
    <div className="logout-overlay">
      <div className="logout-box">
        <div className="logout-pizza">🍕</div>
        <h2 className="logout-title">See You Soon..!</h2>
        <p className="logout-sub">You have been logged out.</p>
        <div className="logout-bar-wrap">
          <div className="logout-bar" />
        </div>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
  const navRef   = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogout,       setShowLogout]       = useState(false);
  const [showLoginOverlay, setShowLoginOverlay] = useState(false); // ← NEW

  const token    = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const role     = localStorage.getItem('userRole');

  const { cartCount } = useCart();

  // ── Logout ──────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    setShowLogout(true);
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
      navigate('/');
      setShowLogout(false);
    }, 2500);
  };

  // ── Login redirect — now plays the overlay first ────────────────────────────
  const handleLoginRedirect = () => {
    setShowLoginOverlay(true);          // show animation
    setTimeout(() => {
      setShowLoginOverlay(false);
      navigate('/login');               // navigate after 2.5 s
    }, 2500);
  };

  const handleAdminRedirect   = () => navigate('/admin-dashboard');
  const handleProfileRedirect = () => { if (token) navigate('/customer-profile'); };

  // ── Scroll shadow ───────────────────────────────────────────────────────────
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
      {/* Overlays */}
      <LogoutOverlay        show={showLogout}       />
      <LoginTransitionOverlay show={showLoginOverlay} /> {/* ← NEW */}

      <nav className="navbar" ref={navRef}>

        {/* Left Links */}
        <ul className="navbar-links-left">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/gallery" className={location.pathname === '/gallery' ? 'active' : ''}>
              Gallery
            </Link>
          </li>
        </ul>

        {/* Center Logo */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="OvenZa Logo" />
        </Link>

        {/* Right Links */}
        <ul className="navbar-links-right">
          <li>
            <Link to="/menu" className={location.pathname === '/menu' ? 'active' : ''}>
              Menu
            </Link>
          </li>
          <li>
            <Link to="/special-offers" className={location.pathname === '/special-offers' ? 'active' : ''}>
              Special Offers
            </Link>
          </li>
          <li>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
              About Us
            </Link>
          </li>
        </ul>

        {/* Right Section: Cart + User */}
        <div className="navbar-right-section">

          {/* Cart Icon (only show when logged in as customer) */}
          {token && role !== 'admin' && (
            <button
              className="navbar-cart-btn"
              onClick={() => navigate('/cart')}
              title="View Cart"
            >
              <svg className="navbar-cart-icon" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0
                  0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && (
                <span className="navbar-cart-badge">{cartCount > 9 ? '9+' : cartCount}</span>
              )}
            </button>
          )}

          {/* User Section */}
          <div className="navbar-user-wrap">
            {token && (
              <span className="navbar-greeting">👋 Hi, {username}</span>
            )}

            <button className="user-icon-btn" onClick={handleProfileRedirect}>
              👨‍🍳
            </button>

            <div className="user-dropdown">
              {!token ? (
                // ← now calls handleLoginRedirect instead of navigate('/login')
                <button className="dropdown-btn" onClick={handleLoginRedirect}>
                  🔑 Login
                </button>
              ) : (
                <>
                  {role === 'admin' && (
                    <button className="dropdown-btn" onClick={handleAdminRedirect}>
                      ▦ Admin Panel
                    </button>
                  )}
                  <button className="dropdown-btn"
                    onClick={() => navigate('/customer-profile')}>
                    👨‍🍳 My Profile
                  </button>
                  <button className="dropdown-btn logout" onClick={handleLogout}>
                    ⟵ Logout
                  </button>
                </>
              )}
            </div>
          </div>

        </div>

      </nav>
    </>
  );
}
