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

// ── Dashboard Overview ────────────────────────────────────────
function DashboardOverview() {
  const { stats, loading } = useAdminStats(); // ✅ Real data

  return (
    <div className="admin-content">

      {/* Page Title */}
      <div className="content-header">
        <h1 className="content-title">Dashboard Overview</h1>
        <span className="content-date">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric',
            month:   'long', day:  'numeric'
          })}
        </span>
      </div>

      {/* ✅ Stat Cards with Real Data */}
      {loading ? (
        <div className="loading-stats">🍕 Loading stats...</div>
      ) : (
        <div className="stats-grid">
          <StatCard
            icon="🍕"
            value={stats.totalPizzas}
            label="Pizza Items"
            change="▲ 3 this week"
            accent="gold"
          />
          <StatCard
            icon="👥"
            value={stats.totalCustomers}
            label="Customers"
            change={`▲ ${stats.newToday} new today`}
            accent="green"
          />
          <StatCard
            icon="📦"
            value={stats.totalOrders}
            label="Total Orders"
            change="▲ 28 today"
            accent="orange"
          />
          <StatCard
            icon="💰"
            value={`Rs.${(stats.revenue / 1000).toFixed(0)}k`}
            label="Revenue"
            change="▲ 18% this week"
            accent="blue"
          />
        </div>
      )}

      {/* Mid Row */}
      <div className="mid-grid">

        {/* Weekly Sales Chart */}
        <div className="admin-panel">
          <div className="panel-header">
            <span className="panel-title">Weekly Sales</span>
            <span className="panel-action">View Full →</span>
          </div>
          <div className="bar-chart">
            {[
              { day: 'Mon', h: 45, active: false },
              { day: 'Tue', h: 65, active: true  },
              { day: 'Wed', h: 40, active: false  },
              { day: 'Thu', h: 80, active: true  },
              { day: 'Fri', h: 55, active: false  },
              { day: 'Sat', h: 90, active: true  },
              { day: 'Sun', h: 70, active: true  },
            ].map(({ day, h, active }) => (
              <div className="bar-wrap" key={day}>
                <div
                  className={`bar ${active ? 'bar-active' : ''}`}
                  style={{ height: `${h}px` }}
                />
                <span className="bar-label">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling */}
        <div className="admin-panel">
          <div className="panel-header">
            <span className="panel-title">Top Selling Pizzas</span>
            <span className="panel-action">Manage →</span>
          </div>
          <div className="pizza-list">
            {[
              { name: 'BBQ Chicken Pizza', orders: 48, badge: 'Top', color: '#c9a84c' },
              { name: 'Four Cheese Pizza', orders: 36, badge: 'Hot', color: '#c0392b' },
              { name: 'Italian Supreme',   orders: 29, badge: 'New', color: '#3b7a3b' },
            ].map(({ name, orders, badge, color }) => (
              <div className="pizza-item" key={name}>
                <div className="pizza-dot" style={{ background: color }} />
                <span className="pizza-name">{name}</span>
                <span className="pizza-orders">{orders}</span>
                <span className="pizza-badge">{badge}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="mid-grid">

        {/* AI Forecast */}
        <div className="admin-panel ai-panel">
          <div className="panel-header">
            <div className="ai-badge">
              <div className="ai-pulse" />
              AI Sales Forecast
            </div>
          </div>
          <p className="ai-subtitle">Next 5-day prediction</p>
          <div className="ai-forecast">
            {[
              { day: 'Tue', val: 42 },
              { day: 'Wed', val: 38 },
              { day: 'Thu', val: 55 },
              { day: 'Fri', val: 61 },
              { day: 'Sat', val: 78 },
            ].map(({ day, val }) => (
              <div className="ai-day" key={day}>
                <div className="ai-day-name">{day}</div>
                <div className="ai-day-val">{val}</div>
                <div className="ai-day-unit">orders</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-panel">
          <div className="panel-header">
            <span className="panel-title">Quick Actions</span>
          </div>
          <div className="quick-actions">
            {[
              { icon: '+',  label: 'Add Pizza' },
              { icon: '✦', label: 'New Offer'  },
              { icon: '◉', label: 'Chatbot'    },
              { icon: '📊', label: 'Reports'   },
            ].map(({ icon, label }) => (
              <button className="action-btn" key={label}>
                <div className="action-icon">{icon}</div>
                <div className="action-label">{label}</div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

