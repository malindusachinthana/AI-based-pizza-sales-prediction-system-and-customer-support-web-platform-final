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

  return (
    /* We attach the wrapperRef to this containing div */
    <div ref={wrapperRef}>
      {/* ── Floating Bubble Button ── */}
      <button
        className={`cb-bubble ${open ? 'cb-bubble--active' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Open chatbot"
      >
        {open ? (
          /* Show 'X' Close icon when open */
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          /* Show ONLY custom image when closed */
          <>
            <img src={chatIcon} alt="Chat Icon" className="cb-bubble-icon" />
            <span className="cb-bubble-ping" />
          </>
        )}
      </button>

      {/* ── Chat Window ── */}
      <div className={`cb-window ${open ? 'cb-window--open' : ''}`}>

        {/* Header */}
        <div className="cb-header">
          <div className="cb-header-avatar">🍕</div>
          <div className="cb-header-info">
            <p className="cb-header-name">OvenZ</p>
            <p className="cb-header-status">Always here to help</p>
          </div>
          <button className="cb-clear-btn" onClick={handleClear} title="Clear chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 .49-4.94"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="cb-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`cb-msg cb-msg--${msg.from}`}>
              {msg.from === 'bot' && <span className="cb-msg-avatar">🍕</span>}
              <div
                className="cb-msg-bubble"
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            </div>
          ))}

          {/* Loading dots */}
          {loading && (
            <div className="cb-msg cb-msg--bot">
              <span className="cb-msg-avatar">🍕</span>
              <div className="cb-msg-bubble cb-typing">
                <span /><span /><span />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Questions or Ask Another */}
        <div className="cb-footer">
          {!asked && !loading && (
            <div className="cb-questions">
              {QUESTIONS.map(q => (
                <button
                  key={q.id}
                  className="cb-question-btn"
                  onClick={() => handleQuestion(q)}
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}

          {asked && !loading && (
            <div className="cb-ask-another">
              <button className="cb-another-btn" onClick={handleAskAnother}>
                Ask another question 🔄
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}