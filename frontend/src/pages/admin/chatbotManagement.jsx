import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../style/chatbotManagement.css';

const API = 'http://localhost:5000/api';

// ── Question labels for stats display ─────────────────────────
const QUESTION_LABELS = {
  best_seller:    '🏆 Best selling pizza?',
  most_expensive: '💎 Most expensive pizza?',
  cheapest:       '💚 Most affordable pizza?',
  veggie:         '🥦 Vegetarian options?',
  chicken:        '🍗 Chicken pizzas?',
  classic:        '🍕 Classic pizzas?',
  supreme:        '👑 Supreme pizzas?',
  total_pizzas:   '📋 How many pizzas on menu?',
  hours:          '🕐 Opening hours?',
  how_to_order:   '🛒 How to place an order?',
  payment:        '💳 Payment methods?',
  contact:        '📍 Location & contact?',
};

export default function ChatbotManagement() {
  const [configs,      setConfigs]      = useState([]);
  const [liveData,     setLiveData]     = useState(null);
  const [stats,        setStats]        = useState({ logs: [], total: 0 });
  const [editingKey,   setEditingKey]   = useState(null);
  const [editValue,    setEditValue]    = useState('');
  const [saving,       setSaving]       = useState(false);
  const [saveMsg,      setSaveMsg]      = useState('');
  const [loading,      setLoading]      = useState(true);
  const [activeTab,    setActiveTab]    = useState('answers'); // 'answers' | 'stats' | 'live'

