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

  // ── Save edited answer ────────────────────────────────────
  async function handleSave(key) {
    setSaving(true);
    setSaveMsg('');
    try {
      // Convert newlines back to <br/> and wrap bold markers
      const htmlAnswer = editValue
        .replace(/\n/g, '<br/>')
        .trim();

      await axios.put(`${API}/chatbot-config/${key}`, { answer: htmlAnswer });
      setSaveMsg('✅ Saved successfully!');
      setEditingKey(null);
      fetchAll();
    } catch {
      setSaveMsg('❌ Failed to save. Try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 3000);
    }
  }

  // ── Top question from stats ───────────────────────────────
  const topQuestion = stats.logs[0];

  if (loading) return (
    <div className="cbm-loading">
      <span className="cbm-loading-emoji">🍕</span>
      <p className="cbm-loading-title">Chatbot Management</p>
      <p className="cbm-loading-sub">Loading chatbot data...</p>
    </div>
  );

  return (
    <div className="cbm-wrap">

      {/* ── Page Header ── */}
      <div className="cbm-header">
        <div className="cbm-header-left">
          <span className="cbm-header-icon">🤖</span>
          <div>
            <h2 className="cbm-title">Chatbot Management</h2>
            <p className="cbm-subtitle">Manage chatbot answers & view usage stats</p>
          </div>
        </div>
        <div className="cbm-stat-pill">
          <span>💬</span>
          <span><strong>{stats.total}</strong> total questions asked</span>
        </div>
      </div>

      {/* ── Save message toast ── */}
      {saveMsg && <div className={`cbm-toast ${saveMsg.startsWith('✅') ? 'cbm-toast--ok' : 'cbm-toast--err'}`}>{saveMsg}</div>}

      {/* ── Tabs ── */}
      <div className="cbm-tabs">
        {[
          { id: 'answers', label: '✏️ Edit Answers' },
          { id: 'live',    label: '📡 Live DB Data'  },
          { id: 'stats',   label: '📊 Usage Stats'   },
        ].map(tab => (
          <button
            key={tab.id}
            className={`cbm-tab ${activeTab === tab.id ? 'cbm-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          TAB 1 — Edit Answers
      ══════════════════════════════════════════ */}
      {activeTab === 'answers' && (
        <div className="cbm-section">
          <p className="cbm-section-desc">
            These answers are shown to customers in the chatbot. Edit them any time and they update instantly — no code changes needed.
          </p>

          <div className="cbm-cards">
            {configs.map(cfg => (
              <div key={cfg.key} className={`cbm-card ${editingKey === cfg.key ? 'cbm-card--editing' : ''}`}>

                <div className="cbm-card-header">
                  <span className="cbm-card-label">{cfg.label}</span>
                  <span className="cbm-card-key">{cfg.key}</span>
                </div>

                {editingKey === cfg.key ? (
                  // ── Edit mode ──
                  <div className="cbm-edit-mode">
                    <textarea
                      className="cbm-textarea"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      rows={5}
                      placeholder="Type the answer here…"
                    />
                    <p className="cbm-edit-hint">💡 Use a new line for line breaks. They'll show correctly in the chatbot.</p>
                    <div className="cbm-edit-actions">
                      <button
                        className="cbm-btn cbm-btn--save"
                        onClick={() => handleSave(cfg.key)}
                        disabled={saving}
                      >
                        {saving ? 'Saving…' : '💾 Save'}
                      </button>
                      <button
                        className="cbm-btn cbm-btn--cancel"
                        onClick={() => setEditingKey(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // ── View mode ──
                  <div className="cbm-view-mode">
                    <p
                      className="cbm-answer-preview"
                      dangerouslySetInnerHTML={{ __html: cfg.answer }}
                    />
                    <button
                      className="cbm-btn cbm-btn--edit"
                      onClick={() => handleEdit(cfg)}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          TAB 2 — Live DB Data
      ══════════════════════════════════════════ */}
      {activeTab === 'live' && (
        <div className="cbm-section">
          <p className="cbm-section-desc">
            These answers are generated automatically from your live database. They update whenever you change the menu or new orders come in — no editing needed.
          </p>

          <div className="cbm-live-grid">

            <div className="cbm-live-card cbm-live-card--gold">
              <span className="cbm-live-icon">🏆</span>
              <p className="cbm-live-label">Best Selling Pizza</p>
              <p className="cbm-live-value">{liveData?.bestSeller?.name || '—'}</p>
              <p className="cbm-live-sub">{liveData?.bestSeller?.orders} orders</p>
              <span className="cbm-live-badge">Auto from Orders</span>
            </div>

            <div className="cbm-live-card cbm-live-card--red">
              <span className="cbm-live-icon">💎</span>
              <p className="cbm-live-label">Most Expensive Pizza</p>
              <p className="cbm-live-value">{liveData?.mostExpensive?.name || '—'}</p>
              <p className="cbm-live-sub">Rs. {liveData?.mostExpensive?.price?.toLocaleString()}</p>
              <span className="cbm-live-badge">Auto from Menu</span>
            </div>

            <div className="cbm-live-card cbm-live-card--green">
              <span className="cbm-live-icon">💚</span>
              <p className="cbm-live-label">Most Affordable Pizza</p>
              <p className="cbm-live-value">{liveData?.cheapest?.name || '—'}</p>
              <p className="cbm-live-sub">Rs. {liveData?.cheapest?.price?.toLocaleString()}</p>
              <span className="cbm-live-badge">Auto from Menu</span>
            </div>

            <div className="cbm-live-card cbm-live-card--blue">
              <span className="cbm-live-icon">🍕</span>
              <p className="cbm-live-label">Total Pizzas on Menu</p>
              <p className="cbm-live-value">{liveData?.totalPizzas || '—'}</p>
              <p className="cbm-live-sub">Across all categories</p>
              <span className="cbm-live-badge">Auto from Menu</span>
            </div>

          </div>
        </div>
      )}

