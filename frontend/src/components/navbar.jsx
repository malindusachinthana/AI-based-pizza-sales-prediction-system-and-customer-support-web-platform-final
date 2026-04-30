import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // ✅ Added useLocation
import '../style/navbar.css';
import logo from '../assets/OvenZlogo.png';

// ── Logout Overlay ────────────────────────────────────────────
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

// ── Navbar ────────────────────────────────────────────────────
export default function Navbar() {
  const navRef   = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Added
  const [showLogout, setShowLogout] = useState(false);

  const token    = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const role     = localStorage.getItem('userRole');

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

  const handleLoginRedirect   = () => navigate('/login');
  const handleAdminRedirect   = () => navigate('/admin-dashboard');
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
      <LogoutOverlay show={showLogout} />

      <nav className="navbar" ref={navRef}>

        {/* ── Left Links ── */}
        <ul className="navbar-links-left">
          <li>
            <Link
              to="/"
              className={location.pathname === '/' ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/gallery"
              className={location.pathname === '/gallery' ? 'active' : ''}
            >
              Gallery
            </Link>
          </li>
        </ul>

        {/* ── Center Logo ── */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="OvenZa Logo" />
        </Link>

        {/* ── Right Links ── */}
        <ul className="navbar-links-right">
          <li>
            <Link
              to="/menu"
              className={location.pathname === '/menu' ? 'active' : ''}
            >
              Menu
            </Link>
          </li>
          <li>
            <Link
              to="/special-offers"
              className={location.pathname === '/special-offers' ? 'active' : ''}
            >
              Special Offers
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={location.pathname === '/about' ? 'active' : ''}
            >
              About Us
            </Link>
          </li>
        </ul>

        {/* ── User Section ── */}
        <div className="navbar-user-wrap">
          {token && (
            <span className="navbar-greeting">👋 Hi, {username}</span>
          )}

          <button className="user-icon-btn" onClick={handleProfileRedirect}>
            👤
          </button>

          <div className="user-dropdown">
            {!token ? (
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
                  👤 My Profile
                </button>
                <button className="dropdown-btn logout" onClick={handleLogout}>
                  ⟵ Logout
                </button>
              </>
            )}
          </div>
        </div>

      </nav>
    </>
  );
}