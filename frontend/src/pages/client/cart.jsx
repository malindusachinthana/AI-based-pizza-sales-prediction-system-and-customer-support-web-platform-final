import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { useCart } from '../../context/CartContext';
import '../../style/cart.css';

// PayPal Sandbox Client ID
const PAYPAL_CLIENT_ID = 'AaP9unl1F12HpVGdDIR8IeN0NpmbW99-3TqT4mImxH6ymHTq-_G9FDfDQqBWHq9A3AZS4LGJGAWK3Ycp';

const SIZE_LABELS = { small: 'S', medium: 'M', large: 'L' };

// Empty Cart
function EmptyCart() {
  const navigate = useNavigate();
  return (
    <div className="cart-empty">
      <div className="cart-empty-icon">🛒</div>
      <h2 className="cart-empty-title">Your cart is empty</h2>
      <p className="cart-empty-sub">Add some delicious pizzas to get started!</p>
      <button className="cart-back-btn" onClick={() => navigate('/menu')}>
        Browse Menu
      </button>
    </div>
  );
}

// Cart Item Row
function CartItem({ item }) {
  const { increaseQty, decreaseQty, removeFromCart, changeSize } = useCart();
  const sizes = ['small', 'medium', 'large'];

  return (
    <div className="cart-item">
      <div className="cart-item-img-wrap">
        <img
          src={`http://localhost:5000${item.imageUrl}`}
          alt={item.name}
          className="cart-item-img"
        />
      </div>

      <div className="cart-item-info">
        <h3 className="cart-item-name">{item.name}</h3>
        <span className="cart-item-category">{item.category}</span>

        <div className="cart-size-row">
          <span className="cart-size-label">Size:</span>
          <div className="cart-size-btns">
            {sizes.map(s => (
              <button
                key={s}
                className={`cart-size-btn ${item.size === s ? 'active' : ''}`}
                onClick={() => changeSize(item._id, item.size, s)}>
                {SIZE_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        <p className="cart-item-price">
          Rs. {item.price?.toLocaleString()} each
        </p>
      </div>

      <div className="cart-qty-wrap">
        <button className="cart-qty-btn"
          onClick={() => decreaseQty(item._id, item.size)}>−</button>
        <span className="cart-qty-num">{item.quantity}</span>
        <button className="cart-qty-btn"
          onClick={() => increaseQty(item._id, item.size)}>+</button>
      </div>

      <div className="cart-item-total">
        Rs. {(item.price * item.quantity).toLocaleString()}
      </div>

      <button className="cart-remove-btn"
        onClick={() => removeFromCart(item._id, item.size)}>
        ✕
      </button>
    </div>
  );
}

// Main Cart Page
export default function Cart() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate                            = useNavigate();
  const [paying, setPaying]                 = useState(false);

  // Route Guard — must be logged in as customer
  const token    = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const username = localStorage.getItem('username') || 'Customer';

  if (!token || userRole === 'admin') {
    navigate('/login');
    return null;
  }

  // PayPal success handler
  async function onPayPalApprove(data) {
    setPaying(true);
    try {
      console.log('✅ PayPal approved. Order ID:', data.orderID);

      const orderData = {
        paypalOrderId : data.orderID,
        payerName     : username,
        payerEmail    : 'sandbox@buyer.com',
        items         : cartItems.map(item => ({
          pizzaId  : item._id,
          name     : item.name,
          size     : item.size,
          price    : item.price,
          quantity : item.quantity,
        })),
        total  : cartTotal,
        status : 'paid',
      };

      console.log('📦 Sending order to backend:', orderData);
      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      console.log('✅ Order saved:', response.data);

      const savedItems = [...cartItems];
      clearCart();
      navigate('/order-confirmation', {
        state: {
          orderId   : data.orderID,
          payerName : username,
          total     : cartTotal,
          items     : savedItems,
        }
      });

    } catch (err) {
      console.error('❌ Error:', err);
      alert('Order saving failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setPaying(false);
    }
  }

  if (cartItems.length === 0) return (
    <>
      <Navbar />
      <div className="cart-page"><EmptyCart /></div>
      <Footer />
    </>
  );

  return (
    <PayPalScriptProvider options={{
      'client-id'    : PAYPAL_CLIENT_ID,
      currency       : 'USD',
      'buyer-country': 'US',
    }}>
      <Navbar />

      <div className="cart-page">
        <div className="cart-container">

          {/* Header */}
          <div className="cart-header">
            <button className="cart-back-btn" onClick={() => navigate('/menu')}>
              ← Back to Menu
            </button>
            <h1 className="cart-title">Your Cart</h1>
            <span className="cart-item-count">
              {cartItems.reduce((s, i) => s + i.quantity, 0)} item(s)
            </span>
          </div>

          <div className="cart-body">

            {/* Left — Cart items */}
            <div className="cart-items-col">
              {cartItems.map(item => (
                <CartItem key={`${item._id}-${item.size}`} item={item} />
              ))}
            </div>

            {/* Right — Order summary */}
            <div className="cart-summary-col">
              <div className="cart-summary-card">
                <h2 className="cart-summary-title">Order Summary</h2>

                <div className="cart-summary-items">
                  {cartItems.map(item => (
                    <div key={`${item._id}-${item.size}`} className="cart-summary-row">
                      <span className="cart-summary-item-name">
                        {item.name} ({SIZE_LABELS[item.size]}) ×{item.quantity}
                      </span>
                      <span className="cart-summary-item-price">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="cart-summary-divider" />

                <div className="cart-summary-total-row">
                  <span className="cart-summary-total-label">Total</span>
                  <span className="cart-summary-total-value">
                    Rs. {cartTotal.toLocaleString()}
                  </span>
                </div>

                <div className="cart-summary-divider" />

                <p className="cart-paypal-note">
                  💳 Secure payment via PayPal
                </p>

                {paying ? (
                  <div className="cart-paying">Processing payment...</div>
                ) : (
                  <PayPalButtons
                    style={{ layout: 'vertical', color: 'gold', shape: 'rect' }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [{
                          amount: { value: '5.00' },
                          description: 'OvenZa Crust Pizza Order',
                        }]
                      });
                    }}
                    onApprove={onPayPalApprove}
                    onError={(err) => {
                      console.error('PayPal error:', err);
                      alert('Payment failed. Please try again.');
                    }}
                  />
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </PayPalScriptProvider>
  );
}
