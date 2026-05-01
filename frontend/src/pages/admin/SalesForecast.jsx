import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import '../../style/SalesForecast.css';

const API = 'http://localhost:5001';

const CATEGORY_COLORS = {
  Chicken: '#2a7a8a',
  Classic: '#c8872a',
  Supreme: '#7a5a8a',
  Veggie : '#5a8a3a',
};

// ── Custom tooltip ────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0d0f0a', border: '1px solid #4a4d3a',
      borderRadius: 8, padding: '12px 16px',
      fontFamily: 'Arial, sans-serif', fontSize: 13,
    }}>
      <p style={{ color: '#8a9070', margin: '0 0 8px', fontSize: 11 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: '3px 0', fontWeight: 600 }}>
          {p.name}: {Math.round(p.value).toLocaleString()} pizzas
        </p>
      ))}
    </div>
  );
};

// ── Metric card ───────────────────────────────────────────────────
const MetricCard = ({ label, value, sub, accent }) => (
  <div className="sf-metric-card">
    <p className="sf-metric-label">{label}</p>
    <p className={`sf-metric-value ${accent ? `accent-${accent}` : ''}`}>{value}</p>
    {sub && <p className="sf-metric-sub">{sub}</p>}
  </div>
);

// ── Main Component ────────────────────────────────────────────────
export default function SalesForecast() {
  const [forecastData,  setForecastData]  = useState([]);
  const [accuracyData,  setAccuracyData]  = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [retraining,    setRetraining]    = useState(false);
  const [retrainReport, setRetrainReport] = useState(null);
  const [error,         setError]         = useState(null);
  const [activeTab,     setActiveTab]     = useState('forecast');
  const [selectedDay,   setSelectedDay]   = useState('all');

  const fileRef = useRef(null);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true); setError(null);
    try {
      const [fcRes, accRes] = await Promise.all([
        axios.get(`${API}/forecast`),
        axios.get(`${API}/accuracy`),
      ]);
      setForecastData(fcRes.data.data);
      setAccuracyData(accRes.data.data);
    } catch (err) {
      setError('Cannot connect to AI model. Make sure api.py is running on port 5001.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRetrain(e) {
    const file = e.target.files[0];
    if (!file) return;
    setRetraining(true); setRetrainReport(null); setError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${API}/retrain`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setRetrainReport(res.data.report);
      await loadAll();
    } catch (err) {
      setError(err.response?.data?.error || 'Retrain failed. Check the CSV format.');
    } finally {
      setRetraining(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  // ── Derived data ──────────────────────────────────────────────
  const displayData    = selectedDay === 'all'
    ? forecastData
    : forecastData.filter(d => d.day_number === Number(selectedDay));

  const singleDay      = selectedDay !== 'all' && displayData.length > 0
    ? displayData[0] : null;

  const totalPredicted = forecastData.reduce((s, d) => s + d.total, 0);
  const avgDaily       = forecastData.length
    ? Math.round(totalPredicted / forecastData.length) : 0;
  const peakDay        = forecastData.length
    ? forecastData.reduce((a, b) => b.total > a.total ? b : a) : null;
  const avgAccuracy    = accuracyData
    ? Math.round(
        Object.values(accuracyData.categories).reduce((s, c) => s + c.accuracy, 0) /
        Math.max(Object.keys(accuracyData.categories).length, 1)
      )
    : 0;

  const chartData = forecastData.map(d => ({
    name    : `${d.day_name?.slice(0, 3)} ${d.date?.slice(5)}`,
    Chicken : d.categories?.Chicken?.predicted || 0,
    Classic : d.categories?.Classic?.predicted || 0,
    Supreme : d.categories?.Supreme?.predicted || 0,
    Veggie  : d.categories?.Veggie?.predicted  || 0,
  }));

  // ── Loading ───────────────────────────────────────────────────
  if (loading) return (
    <div className="sf-loading">
      <div className="sf-loading-icon">🍕</div>
      <p className="sf-loading-text">Loading AI forecast...</p>
    </div>
  );

  return (
    <div className="sf-page">

      {/* ── Header ── */}
      <div className="sf-header">
        <div className="sf-header-logo">🍕</div>
        <div>
          <p className="sf-header-title">OvenZa Crust</p>
          <p className="sf-header-sub">Admin Dashboard</p>
        </div>
        <div className="sf-header-status">
          <span className="sf-status-dot" />
          AI Model Active
        </div>
      </div>

      {/* ── Body ── */}
      <div className="sf-body">
        <h1 className="sf-title">Sales Forecast</h1>
        <p className="sf-subtitle">
          Prophet AI — daily predictions from {accuracyData?.last_training_date}
        </p>

        {/* Error */}
        {error && <div className="sf-error">⚠ {error}</div>}

        {/* ── Tabs ── */}
        <div className="sf-tabs">
          {[
            { key: 'forecast',  label: '📈 14-Day Forecast' },
            { key: 'breakdown', label: '📋 Daily Breakdown'  },
            { key: 'accuracy',  label: '🎯 Model Accuracy'   },
            { key: 'retrain',   label: '🔄 Upload & Retrain' },
          ].map(t => (
            <button
              key={t.key}
              className={`sf-tab ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════
            TAB 1 — 14-DAY FORECAST
        ════════════════════════════════════ */}
        {activeTab === 'forecast' && (
          <>
            {/* Metric cards */}
            <div className="sf-metrics-row">
              {selectedDay === 'all' ? (
                <MetricCard
                  label="Total (14 Days)"
                  value={totalPredicted.toLocaleString()}
                  sub="pizzas predicted" />
              ) : (
                singleDay && (
                  <MetricCard
                    label={`Day ${singleDay.day_number} Total`}
                    value={singleDay.total.toLocaleString()}
                    sub={singleDay.date_pretty}
                    accent="amber" />
                )
              )}
              <MetricCard
                label="Daily Average"
                value={avgDaily.toLocaleString()}
                sub="pizzas / day" />
              <MetricCard
                label="Busiest Day"
                value={peakDay?.total.toLocaleString() || '—'}
                sub={peakDay ? `${peakDay.day_name} ${peakDay.date?.slice(5)}` : ''} />
              <MetricCard
                label="Model Accuracy"
                value={`${avgAccuracy}%`}
                sub="avg category accuracy"
                accent="green" />
            </div>
