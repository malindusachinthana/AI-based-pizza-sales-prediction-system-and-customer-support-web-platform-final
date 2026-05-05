import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/adminDashboard.css';
import PizzaMenuManagement from './pizzaMenuManagement.jsx';
import SalesForecast from './SalesForecast.jsx';
import ChatbotManagement from './chatbotManagement.jsx';
import AdminProfile from './adminProfile.jsx';

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
    { id: 'dashboard', icon: '🖥️', label: 'Dashboard'      },
    { id: 'forecast',  icon: '🎯', label: 'AI Forecast'    },
    { id: 'menu',      icon: '📜', label: 'Pizza Menu'     },
    { id: 'offers',    icon: '🪇', label: 'Special Offers' },
    { id: 'Chatbot',   icon: '🤖', label: 'ChatbotManagement' },
    { id: 'profile',   icon: '👨‍🍳', label: 'Profile'        },
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
function DashboardOverview({ setActive }) {
  const { stats, loading } = useAdminStats();

  // ── Weekly Sales State ─────────────────────────────────────
  const [weeklySales,    setWeeklySales]    = useState([]);
  const [weeklyLoading,  setWeeklyLoading]  = useState(true);
  const [hoveredDay,     setHoveredDay]     = useState(null);
  const [topPizzas,      setTopPizzas]      = useState([]);
  const [topLoading,     setTopLoading]     = useState(true);
  const [forecast,       setForecast]       = useState([]);
  const [forecastLoad,   setForecastLoad]   = useState(true);

  useEffect(() => {
    const fetchWeekly = async () => {
      try {
        const token = localStorage.getItem('token');
        const res   = await fetch('http://localhost:5000/api/admin/weekly-sales', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setWeeklySales(data);
      } catch (err) {
        console.error('Weekly sales error:', err);
      } finally {
        setWeeklyLoading(false);
      }
    };

    const fetchTopPizzas = async () => {
      try {
        const token = localStorage.getItem('token');
        const res   = await fetch('http://localhost:5000/api/admin/top-pizzas', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setTopPizzas(data);
      } catch (err) {
        console.error('Top pizzas error:', err);
      } finally {
        setTopLoading(false);
      }
    };

    const fetchForecast = async () => {
      try {
        const res  = await fetch('http://localhost:5001/forecast');
        const data = await res.json();
        // API returns { success: true, data: [ { day_name, date, total, ... } ] }
        const next5 = (data.data || [])
          .slice(0, 5)
          .map(d => ({
            day: d.day_name.slice(0, 3), // 'Wednesday' → 'Wed'
            val: Math.max(0, d.total),
          }));
        setForecast(next5);
      } catch (err) {
        console.error('Forecast fetch error:', err);
        setForecast([]);
      } finally {
        setForecastLoad(false);
      }
    };

    fetchWeekly();
    fetchTopPizzas();
    fetchForecast();
  }, []);

  // Scale bar heights relative to max value (max = 110px, min = 6px)
  const maxTotal  = Math.max(...weeklySales.map(d => d.total), 1);
  const getHeight = (total) => Math.max(6, Math.round((total / maxTotal) * 110));

  return (
    <div className="admin-content">

      {/* Page Title */}
      <div className="content-header">
        <h1 className="content-title">Dashboard Overview</h1>
        <span className="content-date">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric',
            month: 'long', day: 'numeric'
          })}
        </span>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="loading-stats">🍕 Loading stats...</div>
      ) : (
        <div className="stats-grid">
          <StatCard
            icon="🍕"
            value={stats.totalPizzas}
            label="Pizza Items"
            change={`${stats.pizzasThisWeek > 0 ? '▲' : '–'} ${stats.pizzasThisWeek} added this week`}
            accent="gold"
          />
          <StatCard
            icon="👥"
            value={stats.totalCustomers}
            label="Customers"
            change={`${stats.newToday > 0 ? '▲' : '–'} ${stats.newToday} new today`}
            accent="green"
          />
          <StatCard
            icon="📦"
            value={stats.totalOrders}
            label="Total Orders"
            change={`${stats.ordersToday > 0 ? '▲' : '–'} ${stats.ordersToday} today`}
            accent="orange"
          />
          <StatCard
            icon="💰"
            value={`Rs.${(stats.revenue / 1000).toFixed(1)}k`}
            label="Revenue"
            change={`${stats.revenueChange >= 0 ? '▲' : '▼'} ${Math.abs(stats.revenueChange)}% this week`}
            accent="blue"
          />
        </div>
      )}

      {/* Mid Row */}
      <div className="mid-grid">

        {/* ── Weekly Sales Chart (LIVE) ── */}
        <div className="admin-panel">
          <div className="panel-header">
            <span className="panel-title">Weekly Sales</span>
            <span className="panel-action">
              {weeklyLoading ? '...' : `Rs.${(weeklySales.reduce((s, d) => s + d.total, 0) / 1000).toFixed(1)}k this week`}
            </span>
          </div>
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
              { icon: '🤖', label: 'Chatbot'    },
              { icon: '📑', label: 'Reports'   },
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

// ── Coming Soon Panel ─────────────────────────────────────────
function ComingSoon({ title }) {
  return (
    <div className="admin-content">
      <div className="coming-soon">
        <div className="coming-icon">🍕</div>
        <h2 className="coming-title">{title}</h2>
        <p className="coming-sub">This section is coming soon...</p>
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────
export default function AdminDashboard() {
  useAdminProtection();
  const [active, setActive] = useState('dashboard');

  const renderContent = () => {
    switch (active) {
      case 'dashboard': return <DashboardOverview />;
      case 'forecast':  return <SalesForecast />;
      case 'menu': return <PizzaMenuManagement />;
      case 'offers':    return <ComingSoon title="Special Offers" />;
      case 'Chatbot': return <ChatbotManagement />;
      case 'profile':   return <AdminProfile />;
      default:          return <DashboardOverview />;
    }
  };

  return (
    <div className="admin-wrapper">
      <Sidebar active={active} setActive={setActive} />
      <div className="admin-main">
        {renderContent()}
      </div>
    </div>
  );
}