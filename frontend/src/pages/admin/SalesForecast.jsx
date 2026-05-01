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

