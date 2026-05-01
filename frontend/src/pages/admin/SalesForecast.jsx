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

            {/* Day dropdown card */}
            <div className="sf-card">
              <div className="sf-dropdown-row">
                <div className="sf-dropdown-label-group">
                  <p className="sf-card-title" style={{ margin: 0 }}>Select Day to Highlight</p>
                  <p className="sf-card-sub" style={{ margin: 0 }}>
                    Choose a specific day or view all 14 days
                  </p>
                </div>

                <select
                  className="sf-select"
                  value={selectedDay}
                  onChange={e => setSelectedDay(e.target.value)}>
                  <option value="all">📊 All 14 Days</option>
                  {forecastData.map(d => (
                    <option key={d.day_number} value={d.day_number}>
                      Day {d.day_number} — {d.date_pretty} ({d.day_name})
                    </option>
                  ))}
                </select>

                {/* Single day mini stats */}
                {singleDay && (
                  <div className="sf-day-stats">
                    {Object.entries(singleDay.categories || {}).map(([cat, vals]) => (
                      <div
                        key={cat}
                        className="sf-day-stat-card"
                        style={{ borderLeft: `3px solid ${CATEGORY_COLORS[cat]}` }}>
                        <p className="sf-day-stat-label">{cat}</p>
                        <p className="sf-day-stat-value"
                          style={{ color: CATEGORY_COLORS[cat] }}>
                          {vals.predicted}
                        </p>
                        <p className="sf-day-stat-range">{vals.lower}–{vals.upper}</p>
                      </div>
                    ))}
                    <div className="sf-day-stat-card total"
                      style={{ borderLeft: '3px solid #c8872a' }}>
                      <p className="sf-day-stat-label">Total</p>
                      <p className="sf-day-stat-value" style={{ color: '#e8e0d0' }}>
                        {singleDay.total}
                      </p>
                      <p className="sf-day-stat-range">
                        {singleDay.total_lower}–{singleDay.total_upper}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Chart */}
            <div className="sf-card">
              <p className="sf-card-title">
                {singleDay
                  ? `Day ${singleDay.day_number} — ${singleDay.date_pretty} (${singleDay.day_name})`
                  : '14-Day Sales Forecast by Category'}
              </p>
              <p className="sf-card-sub">
                {singleDay
                  ? `Predicted: ${singleDay.total} pizzas  |  Range: ${singleDay.total_lower}–${singleDay.total_upper}`
                  : 'Stacked daily predicted quantity per pizza category'}
              </p>
              <ResponsiveContainer width="100%" height={280}>
                {singleDay ? (
                  <BarChart
                    data={Object.entries(singleDay.categories || {}).map(([cat, vals]) => ({
                      name: cat, value: vals.predicted,
                    }))}
                    margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#2a2e22" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name"
                      tick={{ fill: '#8a9070', fontSize: 12 }}
                      axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#8a9070', fontSize: 12 }}
                      axisLine={false} tickLine={false} width={40} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#c8872a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <AreaChart data={chartData}
                    margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                    <defs>
                      {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                        <linearGradient key={cat} id={`grad${cat}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={color} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid stroke="#2a2e22" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name"
                      tick={{ fill: '#8a9070', fontSize: 11 }}
                      axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#8a9070', fontSize: 11 }}
                      axisLine={false} tickLine={false} width={40} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{
                      fontSize: 12, color: '#8a9070', fontFamily: 'Arial, sans-serif',
                    }} />
                    {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                      <Area key={cat} type="monotone" dataKey={cat}
                        stroke={color} strokeWidth={2}
                        fill={`url(#grad${cat})`} stackId="1" />
                    ))}
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* ════════════════════════════════════
            TAB 2 — DAILY BREAKDOWN
        ════════════════════════════════════ */}
        {activeTab === 'breakdown' && (
          <>
            <div className="sf-card">
              <div className="sf-dropdown-row">
                <div className="sf-dropdown-label-group">
                  <p className="sf-card-title" style={{ margin: 0 }}>Filter by Day</p>
                  <p className="sf-card-sub" style={{ margin: 0 }}>
                    Select a specific day or view all
                  </p>
                </div>
                <select className="sf-select" value={selectedDay}
                  onChange={e => setSelectedDay(e.target.value)}>
                  <option value="all">📋 All 14 Days</option>
                  {forecastData.map(d => (
                    <option key={d.day_number} value={d.day_number}>
                      Day {d.day_number} — {d.date_pretty} ({d.day_name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sf-card no-padding">
              <div className="sf-card-header">
                <span className="sf-card-header-title">Daily Breakdown</span>
                <span className="sf-card-header-count">
                  {displayData.length} {displayData.length === 1 ? 'day' : 'days'} shown
                </span>
              </div>
              <div className="sf-table-wrap">
                <table className="sf-table">
                  <thead>
                    <tr>
                      {['Day', 'Date', 'Day Name', 'Chicken', 'Classic',
                        'Supreme', 'Veggie', 'Total'].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.map((row, i) => {
                      const isHighlighted = selectedDay !== 'all';
                      return (
                        <tr key={i}
                          className={isHighlighted ? 'highlighted'
                            : i % 2 === 0 ? 'even' : 'odd'}>
                          <td className="cell-day">{row.day_number}</td>
                          <td>{row.date}</td>
                          <td>{row.day_name}</td>
                          {['Chicken', 'Classic', 'Supreme', 'Veggie'].map(cat => (
                            <td key={cat} style={{ color: CATEGORY_COLORS[cat], fontWeight: 600 }}>
                              {row.categories?.[cat]?.predicted ?? '—'}
                              <span className="cell-range">
                                {row.categories?.[cat]?.lower}–{row.categories?.[cat]?.upper}
                              </span>
                            </td>
                          ))}
                          <td className="cell-total">
                            {row.total}
                            <span className="cell-range">
                              {row.total_lower}–{row.total_upper}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ════════════════════════════════════
            TAB 3 — MODEL ACCURACY
        ════════════════════════════════════ */}
        {activeTab === 'accuracy' && accuracyData && (
          <>
            <div className="sf-card">
              <p className="sf-card-title">Category Model Accuracy</p>
              <p className="sf-card-sub">
                Evaluated on last 28 days of training data (zero-sales days excluded)
              </p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={Object.entries(accuracyData.categories).map(([cat, m]) => ({
                    name: cat, Accuracy: m.accuracy,
                  }))}
                  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#2a2e22" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#8a9070', fontSize: 12 }}
                    axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#8a9070', fontSize: 12 }}
                    axisLine={false} tickLine={false} width={40} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Accuracy" fill="#c8872a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="sf-card no-padding">
              <div className="sf-card-header">
                <span className="sf-card-header-title">Accuracy Details</span>
              </div>
              <div className="sf-table-wrap">
                <table className="sf-table">
                  <thead>
                    <tr>
                      {['Model', 'Accuracy', 'MAPE', 'MAE', 'RMSE', 'Status'].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(accuracyData.categories).map(([cat, m], i) => (
                      <tr key={cat} className={i % 2 === 0 ? 'even' : 'odd'}>
                        <td style={{ fontWeight: 600, color: CATEGORY_COLORS[cat] }}>{cat}</td>
                        <td style={{ fontWeight: 700, color: '#e8e0d0' }}>{m.accuracy}%</td>
                        <td>{m.mape}%</td>
                        <td>{m.mae}</td>
                        <td>{m.rmse}</td>
                        <td>
                          <span className={`sf-badge ${m.accuracy >= 75 ? 'green' : 'amber'}`}>
                            {m.accuracy >= 80 ? 'Excellent'
                              : m.accuracy >= 70 ? 'Good' : 'Acceptable'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="odd">
                      <td style={{ fontWeight: 600, color: '#8a9070' }}>Global (baseline)</td>
                      <td style={{ fontWeight: 700, color: '#e8e0d0' }}>
                        {accuracyData.global.accuracy}%
                      </td>
                      <td>{accuracyData.global.mape}%</td>
                      <td colSpan={3}>
                        <span className="sf-badge amber">Baseline only</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

