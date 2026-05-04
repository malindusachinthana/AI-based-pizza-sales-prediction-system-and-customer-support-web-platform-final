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

  if (!orderId) return null;

  return (
    <>
      <Navbar />

      <div className="oc-page">
        <div className="oc-container">

          {/* Success icon + message */}
          <div className="oc-success-icon">✅</div>
          <h1 className="oc-title">Order Confirmed!</h1>
          <p className="oc-greeting">
            Thank you, <strong>{payerName}</strong>! Your pizza is on its way 🍕
          </p>

          {/* Order ID */}
          <div className="oc-order-id">
            <span className="oc-order-id-label">Order ID</span>
            <span className="oc-order-id-value">{orderId}</span>
          </div>

          {/* Items summary */}
          <div className="oc-items-card">
            <h2 className="oc-items-title">Your Order</h2>
            {items?.map((item, i) => (
              <div key={i} className="oc-item-row">
                <span className="oc-item-name">
                  {item.name} ({SIZE_LABELS[item.size]}) × {item.quantity}
                </span>
                <span className="oc-item-price">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
            <div className="oc-divider" />
            <div className="oc-total-row">
              <span className="oc-total-label">Total Paid</span>
              <span className="oc-total-value">Rs. {total?.toLocaleString()}</span>
            </div>
          </div>
