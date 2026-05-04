// OrderConfirmation.jsx
// Place in: frontend/src/pages/client/OrderConfirmation.jsx

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import '../../style/OrderConfirmation.css';

const SIZE_LABELS = { small: 'S', medium: 'M', large: 'L' };

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, payerName, total, items } = location.state || {};

  // If someone navigates here directly without state, redirect to menu
  useEffect(() => {
    if (!orderId) navigate('/menu');
  }, [orderId, navigate]);
