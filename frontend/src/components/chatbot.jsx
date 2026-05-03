import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../style/chatbot.css';
import chatIcon from '../../src/assets/OvenZlogo.png';

// ── Question categories ────────────────────────────────────────
const QUESTIONS = [
  { id: 'best_seller',   label: '🏆 Best selling pizza?'        },
  { id: 'most_expensive',label: '💎 Most expensive pizza?'      },
  { id: 'cheapest',      label: '💚 Most affordable pizza?'     },
  { id: 'veggie',        label: '🥦 Vegetarian options?'        },
  { id: 'chicken',       label: '🍗 Chicken pizzas?'            },
  { id: 'classic',       label: '🍕 Classic pizzas?'            },
  { id: 'supreme',       label: '👑 Supreme pizzas?'            },
  { id: 'total_pizzas',  label: '📋 How many pizzas on menu?'   },
  { id: 'hours',         label: '🕐 Opening hours?'             },
  { id: 'how_to_order',  label: '🛒 How to place an order?'     },
  { id: 'payment',       label: '💳 Payment methods?'           },
  { id: 'contact',       label: '📍 Location & contact?'        },
];

const BOT_GREETING = "Hey there! 👋 I'm <strong>OvenZ</strong> 🍕<br/>How can I help you today? Pick a question below!";

export default function Chatbot() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: BOT_GREETING }
  ]);
  const [loading,  setLoading]  = useState(false);
  const [asked,    setAsked]    = useState(false); 
  const bottomRef = useRef(null);

  const wrapperRef = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 2. ADD THIS NEW useEffect FOR OUTSIDE CLICKS
  useEffect(() => {
    function handleClickOutside(event) {
      // If the chat is open, and the click happened outside of our wrapper block, close it
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    // Bind the event listener to the whole document
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    }, []);

  // ── Handle question tap ────────────────────────────────────
  async function handleQuestion(q) {
    // Add user bubble
    setMessages(prev => [...prev, { from: 'user', text: q.label }]);
    setLoading(true);
    setAsked(false);

    try {
      const res = await axios.post('http://localhost:5000/api/chatbot/query', { type: q.id });
      setMessages(prev => [...prev, { from: 'bot', text: res.data.answer }]);
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: '⚠️ Something went wrong. Please try again!' }]);
    } finally {
      setLoading(false);
      setAsked(true);
    }
  }

  // ── Reset to show questions again ──────────────────────────
  function handleAskAnother() {
    setAsked(false);
    setMessages(prev => [...prev, {
      from: 'bot',
      text: 'Sure! What else would you like to know? 😊'
    }]);
  }

  // ── Clear chat ─────────────────────────────────────────────
  function handleClear() {
    setMessages([{ from: 'bot', text: BOT_GREETING }]);
    setAsked(false);
    setLoading(false);
  }

