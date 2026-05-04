import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import '../../style/CustomerProfile.css';
import Chatbot from '../../components/chatbot.jsx'

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Get logged in user from localStorage ──────────────────
  const username  = localStorage.getItem('username') || 'Customer';
  const firstName = username.split('_')[0] || username;

  // ── Redirect if not logged in ─────────────────────────────
useEffect(() => {
   const token    = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  if (!token || userRole === 'admin') {
    navigate('/login');
    return;
  }
  fetchOrders();
}, [navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch orders for this user ────────────────────────────
  async function fetchOrders() {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/user/${username}`
      );
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="profile-page">

        {/* ── Background overlay ── */}
        <div className="profile-bg-overlay" />

        {/* ── Profile content ── */}
        <div className="profile-content">

          {/* Avatar */}
          <div className="profile-avatar">
            <svg viewBox="0 0 100 100" fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="profile-avatar-svg">
              <circle cx="50" cy="38" r="22" fill="#8a9070" />
              <ellipse cx="50" cy="85" rx="32" ry="22" fill="#8a9070" />
            </svg>
          </div>

          {/* Username */}
          <p className="profile-username">{username}</p>

          {/* Greeting */}
          <h1 className="profile-greeting">Hi, {firstName}</h1>

          {/* Recent Orders */}
          <div className="profile-orders-section">
            <h2 className="profile-orders-title">My Recent Orders,</h2>

            <div className="profile-orders-box">
              {loading ? (
                <p className="profile-orders-loading">Loading orders...</p>
              ) : orders.length === 0 ? (
                <p className="profile-orders-empty">
                  No orders yet.{' '}
                  <Link to="/menu">Order now!</Link>
                </p>
              ) : (
                <ol className="profile-orders-list">
                  {orders.slice(0, 6).map((order, i) => (
                    <li key={order._id} className="profile-order-item">
                      <span className="profile-order-num">{i + 1}.</span>
                      <span className="profile-order-names">
                        {order.items.map(item => item.name).join(', ')}
                      </span>
                      <span className="profile-order-total">
                        Rs. {order.total?.toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

        </div>
      </div>

      <Footer />
      <Chatbot />
    </>
  );
}
