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

