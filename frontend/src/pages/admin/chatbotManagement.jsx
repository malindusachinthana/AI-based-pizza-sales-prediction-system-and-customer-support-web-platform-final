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

  // ── Load everything on mount ───────────────────────────────
  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      // Seed defaults first
      await axios.get(`${API}/chatbot-config/seed`);

      const [cfgRes, liveRes, statsRes] = await Promise.all([
        axios.get(`${API}/chatbot-config`),
        axios.get(`${API}/chatbot-config/live-preview`),
        axios.get(`${API}/chatbot-config/stats`),
      ]);

      setConfigs(cfgRes.data);
      setLiveData(liveRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // ── Start editing ─────────────────────────────────────────
  function handleEdit(cfg) {
    setEditingKey(cfg.key);
    // Strip HTML tags for easier editing
    setEditValue(cfg.answer.replace(/<br\/>/g, '\n').replace(/<[^>]+>/g, ''));
    setSaveMsg('');
  }
