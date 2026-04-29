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

