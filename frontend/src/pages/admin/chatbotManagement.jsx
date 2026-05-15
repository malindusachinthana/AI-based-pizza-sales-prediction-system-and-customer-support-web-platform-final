import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../style/chatbotManagement.css';

const API = 'http://localhost:5000/api';

// Protected keys — cannot be deleted
const PROTECTED_KEYS = new Set(['hours', 'how_to_order', 'payment', 'contact']);

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

const EMPTY_NEW = { label: '', answer: '' };

export default function ChatbotManagement() {
  const [configs,    setConfigs]    = useState([]);
  const [liveData,   setLiveData]   = useState(null);
  const [stats,      setStats]      = useState({ logs: [], total: 0 });
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState('answers');
  const [saveMsg,    setSaveMsg]    = useState('');

  // Edit state
  const [editingKey,  setEditingKey]  = useState(null);
  const [editLabel,   setEditLabel]   = useState('');
  const [editAnswer,  setEditAnswer]  = useState('');
  const [saving,      setSaving]      = useState(false);

  // Add new Q&A state
  const [showAdd,     setShowAdd]     = useState(false);
  const [newForm,     setNewForm]     = useState(EMPTY_NEW);
  const [adding,      setAdding]      = useState(false);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    try {
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

  function showToast(msg) {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(''), 3000);
  }

  // Open edit
  function handleEdit(cfg) {
    setEditingKey(cfg.key);
    setEditLabel(cfg.label);
    setEditAnswer(cfg.answer.replace(/<br\/>/g, '\n').replace(/<[^>]+>/g, ''));
    setShowAdd(false);
  }

  // Save edit
  async function handleSave(key) {
    if (!editLabel.trim() || !editAnswer.trim()) {
      showToast('❌ Question and answer cannot be empty.');
      return;
    }
    setSaving(true);
    try {
      await axios.put(`${API}/chatbot-config/${key}`, {
        label:  editLabel.trim(),
        answer: editAnswer.replace(/\n/g, '<br/>').trim(),
      });
      showToast('✅ Saved successfully!');
      setEditingKey(null);
      fetchAll();
    } catch {
      showToast('❌ Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  }

  // Delete
  async function handleDelete(key) {
    if (!window.confirm('Delete this question? Customers won\'t see it anymore.')) return;
    try {
      await axios.delete(`${API}/chatbot-config/${key}`);
      showToast('✅ Question deleted!');
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.message || '❌ Failed to delete.');
    }
  }

  // Add new Q&A
  async function handleAdd() {
    if (!newForm.label.trim() || !newForm.answer.trim()) {
      showToast('❌ Both question and answer are required.');
      return;
    }
    setAdding(true);
    try {
      await axios.post(`${API}/chatbot-config`, {
        label:  newForm.label.trim(),
        answer: newForm.answer.replace(/\n/g, '<br/>').trim(),
      });
      showToast('✅ Question added!');
      setNewForm(EMPTY_NEW);
      setShowAdd(false);
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.message || '❌ Failed to add.');
    } finally {
      setAdding(false);
    }
  }

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

      {/* Header */}
      <div className="cbm-header">
        <div className="cbm-header-left">
          <span className="cbm-header-icon">🤖</span>
          <div>
            <h2 className="cbm-title">Chatbot Management</h2>
            <p className="cbm-subtitle">Manage chatbot questions, answers & view usage stats</p>
          </div>
        </div>
        <div className="cbm-stat-pill">
          <span>💬</span>
          <span><strong>{stats.total}</strong> total questions asked</span>
        </div>
      </div>

      {saveMsg && (
        <div className={`cbm-toast ${saveMsg.startsWith('✅') ? 'cbm-toast--ok' : 'cbm-toast--err'}`}>
          {saveMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="cbm-tabs">
        {[
          { id: 'answers', label: '✏️ Edit Answers' },
          { id: 'live',    label: '📡 Live DB Data'  },
          { id: 'stats',   label: '📊 Usage Stats'   },
        ].map(tab => (
          <button key={tab.id}
            className={`cbm-tab ${activeTab === tab.id ? 'cbm-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1 — Edit Answers */}
      {activeTab === 'answers' && (
        <div className="cbm-section">

          {/* Section header with Add button */}
          <div className="cbm-section-top">
            <p className="cbm-section-desc">
              Edit questions and answers shown to customers. Add new ones or delete custom ones anytime.
            </p>
            <button className="cbm-add-btn"
              onClick={() => { setShowAdd(s => !s); setEditingKey(null); }}>
              {showAdd ? '✕ Cancel' : '+ Add Question'}
            </button>
          </div>

          {/* Add New Form */}
          {showAdd && (
            <div className="cbm-add-form">
              <h4 className="cbm-add-title">➕ New Question & Answer</h4>

              <div className="cbm-field">
                <label className="cbm-field-label">Question (shown as button in chatbot)</label>
                <input className="cbm-input"
                  value={newForm.label}
                  onChange={e => setNewForm(f => ({ ...f, label: e.target.value }))}
                  placeholder="e.g. 🎉 Do you have birthday deals?" />
              </div>

              <div className="cbm-field" style={{ marginTop: '12px' }}>
                <label className="cbm-field-label">Answer</label>
                <textarea className="cbm-textarea" rows={4}
                  value={newForm.answer}
                  onChange={e => setNewForm(f => ({ ...f, answer: e.target.value }))}
                  placeholder="Type the answer here. Use new lines for line breaks." />
              </div>

              <p className="cbm-edit-hint">💡 Use new lines for line breaks in the answer.</p>

              <div className="cbm-edit-actions">
                <button className="cbm-btn cbm-btn--save" onClick={handleAdd} disabled={adding}>
                  {adding ? 'Adding...' : '➕ Add Question'}
                </button>
                <button className="cbm-btn cbm-btn--cancel"
                  onClick={() => { setShowAdd(false); setNewForm(EMPTY_NEW); }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Q&A Cards */}
          <div className="cbm-cards">
            {configs.map(cfg => (
              <div key={cfg.key}
                className={`cbm-card ${editingKey === cfg.key ? 'cbm-card--editing' : ''}`}>

                <div className="cbm-card-header">
                  <span className="cbm-card-label">{cfg.label}</span>
                  <div className="cbm-card-actions">
                    <span className="cbm-card-key">{cfg.key}</span>
                    {!PROTECTED_KEYS.has(cfg.key) && editingKey !== cfg.key && (
                      <button className="cbm-btn cbm-btn--delete"
                        onClick={() => handleDelete(cfg.key)}
                        title="Delete this question">
                        🗑
                      </button>
                    )}
                  </div>
                </div>

                {editingKey === cfg.key ? (
                  <div className="cbm-edit-mode">
                    {/* Edit question label */}
                    <div className="cbm-field">
                      <label className="cbm-field-label">Question text</label>
                      <input className="cbm-input"
                        value={editLabel}
                        onChange={e => setEditLabel(e.target.value)}
                        placeholder="Question shown as button in chatbot" />
                    </div>
                    {/* Edit answer */}
                    <div className="cbm-field" style={{ marginTop: '10px' }}>
                      <label className="cbm-field-label">Answer</label>
                      <textarea className="cbm-textarea"
                        value={editAnswer}
                        onChange={e => setEditAnswer(e.target.value)}
                        rows={5}
                        placeholder="Type the answer here…" />
                    </div>
                    <p className="cbm-edit-hint">💡 Use a new line for line breaks.</p>
                    <div className="cbm-edit-actions">
                      <button className="cbm-btn cbm-btn--save"
                        onClick={() => handleSave(cfg.key)} disabled={saving}>
                        {saving ? 'Saving…' : '💾 Save'}
                      </button>
                      <button className="cbm-btn cbm-btn--cancel"
                        onClick={() => setEditingKey(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="cbm-view-mode">
                    <p className="cbm-answer-preview"
                      dangerouslySetInnerHTML={{ __html: cfg.answer }} />
                    <button className="cbm-btn cbm-btn--edit"
                      onClick={() => handleEdit(cfg)}>
                      ✏️ Edit
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2 — Live DB Data */}
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

      {/* TAB 3 — Usage Stats */}
      {activeTab === 'stats' && (
        <div className="cbm-section">
          <p className="cbm-section-desc">
            See which questions customers ask most often. Data is collected automatically every time the chatbot is used.
          </p>
          {stats.total === 0 ? (
            <div className="cbm-empty">
              <span>📊</span>
              <p>No chatbot usage data yet. Stats will appear once customers start using the chatbot!</p>
            </div>
          ) : (
            <>
              {topQuestion && (
                <div className="cbm-top-question">
                  <p className="cbm-top-label">🔥 Most Asked Question</p>
                  <p className="cbm-top-value">
                    {QUESTION_LABELS[topQuestion._id] || topQuestion._id}
                  </p>
                  <p className="cbm-top-count">{topQuestion.count} times asked</p>
                </div>
              )}
              <div className="cbm-stats-list">
                {stats.logs.map((log, i) => {
                  const pct = Math.round((log.count / stats.total) * 100);
                  return (
                    <div key={log._id} className="cbm-stat-row">
                      <span className="cbm-stat-rank">#{i + 1}</span>
                      <div className="cbm-stat-info">
                        <p className="cbm-stat-name">
                          {QUESTION_LABELS[log._id] || log._id}
                        </p>
                        <div className="cbm-stat-bar-wrap">
                          <div className="cbm-stat-bar" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className="cbm-stat-count">
                        {log.count} <small>({pct}%)</small>
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}
