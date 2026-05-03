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
