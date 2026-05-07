

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../style/specialOffersManagement.css';

const API = 'http://localhost:5000/api/offers';
const IMG = 'http://localhost:5000';

const EMPTY_FORM = {
  badgeMain:   'BUY 1\nGET 1',
  badgeSub:    'FREE\nOFFER..!',
  pizzaName:   '',
  description: '',
  familyText:  'Enjoy\nWith\nYour\nWhole\nFamily.',
  isActive:    true,
};

export default function SpecialOffersManagement() {
  const [offers,       setOffers]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showForm,     setShowForm]     = useState(false);
  const [editOffer,    setEditOffer]    = useState(null);
  const [form,         setForm]         = useState(EMPTY_FORM);
  const [imageFiles,   setImageFiles]   = useState([null, null, null, null]);
  const [imagePreviews,setImagePreviews]= useState(['', '', '', '']);
  const [saving,       setSaving]       = useState(false);
  const [msg,          setMsg]          = useState('');

  useEffect(() => { fetchOffers(); }, []);

  async function fetchOffers() {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setOffers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
