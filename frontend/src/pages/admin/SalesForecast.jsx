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

