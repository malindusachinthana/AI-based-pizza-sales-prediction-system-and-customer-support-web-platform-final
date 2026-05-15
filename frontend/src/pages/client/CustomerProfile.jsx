import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import '../../style/CustomerProfile.css';
import Chatbot from '../../components/chatbot.jsx';

// Edit Profile Modal
function EditProfileModal({ onClose, username }) {
  const [newEmail,        setNewEmail]        = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent,     setShowCurrent]     = useState(false);
  const [showNew,         setShowNew]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [saveMsg,         setSaveMsg]         = useState('');
  const [saveError,       setSaveError]       = useState('');
  const [saving,          setSaving]          = useState(false);

  // Close on backdrop click
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  async function handleSave() {
    setSaveMsg('');
    setSaveError('');

    if (!currentPassword) {
      setSaveError('Please enter your current password to save changes.');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setSaveError('New passwords do not match.');
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setSaveError('New password must be at least 6 characters.');
      return;
    }
    if (!newEmail && !newPassword) {
      setSaveError('Please enter a new email or new password to update.');
      return;
    }

    setSaving(true);
    try {
      await axios.put('http://localhost:5000/api/auth/update-profile', {
        username,
        newEmail:        newEmail       || undefined,
        currentPassword,
        newPassword:     newPassword    || undefined,
      });
      setSaveMsg('✅ Profile updated successfully!');
      // Auto-close after 1.8s
      setTimeout(() => onClose(), 1800);
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pedit-backdrop" onClick={handleBackdrop}>
      <div className="pedit-modal">

        {/* Header */}
        <div className="pedit-header">
          <h3 className="pedit-title">Edit Profile</h3>
          <button className="pedit-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* New Email */}
        <div className="pedit-field">
          <label className="pedit-label">
            New Email <span className="pedit-optional">(optional)</span>
          </label>
          <input
            type="email"
            className="pedit-input"
            placeholder="Enter new email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
          />
        </div>

        {/* Divider */}
        <div className="pedit-divider">
          <span>Change Password</span>
        </div>

        {/* Current Password */}
        <div className="pedit-field">
          <label className="pedit-label">
            Current Password <span className="pedit-required">*</span>
          </label>
          <div className="pedit-input-wrap">
            <input
              type={showCurrent ? 'text' : 'password'}
              className="pedit-input"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
            />
            <button className="pedit-eye" onClick={() => setShowCurrent(p => !p)}>
              {showCurrent ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="pedit-field">
          <label className="pedit-label">
            New Password <span className="pedit-optional">(optional)</span>
          </label>
          <div className="pedit-input-wrap">
            <input
              type={showNew ? 'text' : 'password'}
              className="pedit-input"
              placeholder="Enter new password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <button className="pedit-eye" onClick={() => setShowNew(p => !p)}>
              {showNew ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Confirm Password (only when typing new password) */}
        {newPassword.length > 0 && (
          <div className="pedit-field">
            <label className="pedit-label">Confirm New Password</label>
            <div className="pedit-input-wrap">
              <input
                type={showConfirm ? 'text' : 'password'}
                className="pedit-input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <button className="pedit-eye" onClick={() => setShowConfirm(p => !p)}>
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
            {confirmPassword && (
              <span className={`pedit-match ${newPassword === confirmPassword ? 'ok' : 'bad'}`}>
                {newPassword === confirmPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
              </span>
            )}
          </div>
        )}

        {/* Messages */}
        {saveError && <div className="pedit-error">{saveError}</div>}
        {saveMsg   && <div className="pedit-success">{saveMsg}</div>}

        {/* Actions */}
        <div className="pedit-actions">
          <button className="pedit-save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
          <button className="pedit-cancel-btn" onClick={onClose}>Cancel</button>
        </div>

      </div>
    </div>
  );
}

// Main Page
export default function CustomerProfile() {
  const navigate = useNavigate();
  const [orders,    setOrders]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);

  const username  = localStorage.getItem('username') || 'Customer';
  const firstName = username.split('_')[0] || username;

  useEffect(() => {
    const token    = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    if (!token || userRole === 'admin') { navigate('/login'); return; }
    fetchOrders();
  }, [navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchOrders() {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/user/${username}`);
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
        <div className="profile-bg-overlay" />

        <div className="profile-content">

          {/* Avatar */}
          <div className="profile-avatar">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
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
                  No orders yet. <Link to="/menu">Order now!</Link>
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

          {/* Edit Profile Button */}
          <button className="profile-edit-btn" onClick={() => setShowModal(true)}>
            ✏️ Edit Profile
          </button>

        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <EditProfileModal
          username={username}
          onClose={() => setShowModal(false)}
        />
      )}

      <Footer />
      <Chatbot />
    </>
  );
}
