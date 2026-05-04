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

