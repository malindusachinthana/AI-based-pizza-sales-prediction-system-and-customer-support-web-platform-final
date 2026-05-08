// SpecialOffers.jsx
// Place in: frontend/src/pages/client/SpecialOffers.jsx

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import Chatbot from '../../components/chatbot.jsx';
import '../../style/specialOffers.css';

const API_BASE = 'http://localhost:5000';

export default function SpecialOffers() {
  const [offers,  setOffers]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/offers/active`)
      .then(res => res.json())
      .then(data => { setOffers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
