import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../style/adminProfile.css';

const API = 'http://localhost:5000/api/admin';

export default function AdminProfile() {
  const [admin,   setAdmin]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const adminId       = localStorage.getItem('userId');
  const adminUsername = localStorage.getItem('username');
  const authHeaders   = { 'admin-id': adminId || '', 'admin-username': adminUsername || '' };

  async function fetchProfile() {
    try {
      const res = await axios.get(`${API}/profile`, { headers: authHeaders });
      setAdmin(res.data);
    } catch (err) {
      setError('Failed to load profile.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchProfile(); }, []);

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  if (loading) return (
    <div className="ap-loading">
      <span className="ap-loading-emoji">👤</span>
      <p className="ap-loading-title">Admin Profile</p>
      <p className="ap-loading-sub">Loading profile data...</p>
    </div>
  );

  if (error) return (
    <div className="ap-loading">
      <span className="ap-loading-emoji">⚠️</span>
      <p className="ap-loading-title" style={{ color: '#e88080' }}>Error</p>
      <p className="ap-loading-sub">{error}</p>
    </div>
  );

  return (
    <div className="ap-wrap">

      <div className="ap-header">
        <div className="ap-header-left">
          <span className="ap-header-icon">👨‍🍳</span>
          <div>
            <h2 className="ap-title">Admin Profile</h2>
            <p className="ap-subtitle">Your account information</p>
          </div>
        </div>
        <span className="ap-role-badge">🔑 Administrator</span>
      </div>

      <div className="ap-card">

        <div className="ap-avatar-section">
          <div className="ap-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor" className="ap-avatar-svg">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          <p className="ap-avatar-name">{admin?.username}</p>
          <p className="ap-avatar-role">Administrator</p>
        </div>

        <div className="ap-divider" />

        <div className="ap-info-rows">

          <div className="ap-info-row">
            <span className="ap-info-label">👨‍🍳 Username</span>
            <span className="ap-info-value">{admin?.username || '—'}</span>
          </div>

          <div className="ap-info-row">
            <span className="ap-info-label">📧 Email</span>
            <span className="ap-info-value">{admin?.email || '—'}</span>
          </div>

          <div className="ap-info-row">
            <span className="ap-info-label">🛡️ Role</span>
            <span className="ap-info-value">
              <span className="ap-role-chip">Admin</span>
            </span>
          </div>

          <div className="ap-info-row ap-info-row--last">
            <span className="ap-info-label">📅 Admin Since</span>
            <span className="ap-info-value">{formatDate(admin?.createdAt)}</span>
          </div>

        </div>
      </div>

    </div>
  );
}
