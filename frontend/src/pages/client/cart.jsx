import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { useCart } from '../../context/CartContext';
import '../../style/cart.css';

// ── PayPal Sandbox Client ID ──────────────────────────────────
const PAYPAL_CLIENT_ID = 'AaP9unl1F12HpVGdDIR8IeN0NpmbW99-3TqT4mImxH6ymHTq-_G9FDfDQqBWHq9A3AZS4LGJGAWK3Ycp';
