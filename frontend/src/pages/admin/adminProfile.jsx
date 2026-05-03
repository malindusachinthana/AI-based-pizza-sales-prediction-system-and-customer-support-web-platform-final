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
