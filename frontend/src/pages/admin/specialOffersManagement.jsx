

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

  function handleAdd() {
    setEditOffer(null);
    setForm(EMPTY_FORM);
    setImageFiles([null, null, null, null]);
    setImagePreviews(['', '', '', '']);
    setShowForm(true);
    setMsg('');
  }

  function handleEdit(offer) {
    setEditOffer(offer);
    setForm({
      badgeMain:   offer.badgeMain,
      badgeSub:    offer.badgeSub,
      pizzaName:   offer.pizzaName,
      description: offer.description,
      familyText:  offer.familyText,
      isActive:    offer.isActive,
    });
    setImageFiles([null, null, null, null]);
    // Load existing images as previews
    const previews = ['', '', '', ''];
    (offer.images || []).forEach((img, i) => {
      if (i < 4) previews[i] = `${IMG}${img}`;
    });
    setImagePreviews(previews);
    setShowForm(true);
    setMsg('');
  }

  function handleImagePick(index, e) {
    const file = e.target.files[0];
    if (!file) return;
    const newFiles    = [...imageFiles];
    const newPreviews = [...imagePreviews];
    newFiles[index]    = file;
    newPreviews[index] = URL.createObjectURL(file);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  }

  async function handleSave() {
    if (!form.pizzaName.trim() || !form.description.trim()) {
      setMsg('❌ Pizza name and description are required.');
      return;
    }
    setSaving(true);
    setMsg('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      imageFiles.forEach(file => { if (file) fd.append('images', file); });

      if (editOffer) {
        await axios.put(`${API}/${editOffer._id}`, fd);
        setMsg('✅ Offer updated!');
      } else {
        await axios.post(API, fd);
        setMsg('✅ Offer created!');
      }
      fetchOffers();
      setTimeout(() => { setShowForm(false); setMsg(''); }, 1200);
    } catch (err) {
      setMsg('❌ Failed. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id) {
    try {
      await axios.patch(`${API}/${id}/toggle`);
      fetchOffers();
    } catch (err) { console.error(err); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this offer?')) return;
    try {
      await axios.delete(`${API}/${id}`);
      fetchOffers();
    } catch (err) { console.error(err); }
  }

  if (loading) return (
    <div className="som-loading">
      <span className="som-loading-emoji">✦</span>
      <p className="som-loading-title">Special Offers</p>
      <p className="som-loading-sub">Loading offers...</p>
    </div>
  );

  return (
    <div className="som-wrap">

      {/* Header */}
      <div className="som-header">
        <div className="som-header-left">
          <span className="som-header-icon">🪇</span>
          <div>
            <h2 className="som-title">Special Offers</h2>
            <p className="som-subtitle">Manage offers shown on the customer home page</p>
          </div>
        </div>
        <button className="som-add-btn" onClick={handleAdd}>+ Add Offer</button>
      </div>

