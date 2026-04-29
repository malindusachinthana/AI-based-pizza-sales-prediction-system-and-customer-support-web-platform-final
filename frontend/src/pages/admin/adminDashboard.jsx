import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/adminDashboard.css';

// ── Route Protection ──────────────────────────────────────────
function useAdminProtection() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role  = localStorage.getItem('userRole');
    if (!token || role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);
}

// ── Fetch Real Stats from Backend ─────────────────────────────
function useAdminStats() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    newToday:       0,
    totalPizzas:    0,
    totalOrders:    0,
    revenue:        0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res   = await fetch('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, loading };
}

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({ icon, value, label, change, accent }) {
  return (
    <div className={`stat-card stat-${accent}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-change">{change}</div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────
function Sidebar({ active, setActive }) {
  const navigate = useNavigate();

  const navItems = [
    { id: 'dashboard', icon: '▦', label: 'Dashboard'      },
    { id: 'forecast',  icon: '◎', label: 'AI Forecast'    },
    { id: 'menu',      icon: '◈', label: 'Pizza Menu'     },
    { id: 'offers',    icon: '✦', label: 'Special Offers' },
    { id: 'chatbot',   icon: '◉', label: 'Chatbot'        },
    { id: 'profile',   icon: '◯', label: 'Profile'        },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/');
  };

  const username = localStorage.getItem('username');

  return (
    <aside className="admin-sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <span className="sidebar-brand">OvenZa Crust</span>
        <span className="sidebar-sub">Admin Panel</span>
      </div>

      {/* Admin Info */}
      <div className="sidebar-admin">
        <div className="sidebar-avatar">OA</div>
        <div>
          <div className="sidebar-name">{username}</div>
          <div className="sidebar-role">Super Admin</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main</div>
        {navItems.slice(0, 2).map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${active === item.id ? 'active' : ''}`}
            onClick={() => setActive(item.id)}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div className="sidebar-section-label">Manage</div>
        {navItems.slice(2, 5).map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${active === item.id ? 'active' : ''}`}
            onClick={() => setActive(item.id)}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div className="sidebar-section-label">Account</div>
        {navItems.slice(5).map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${active === item.id ? 'active' : ''}`}
            onClick={() => setActive(item.id)}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          ⟵ Logout
        </button>
      </div>

    </aside>
  );
}

