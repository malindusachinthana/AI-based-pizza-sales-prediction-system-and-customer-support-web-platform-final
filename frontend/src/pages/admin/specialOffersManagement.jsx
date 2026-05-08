

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

      {/* ── Add / Edit Form ── */}
      {showForm && (
        <div className="som-form-card">
          <h3 className="som-form-title">{editOffer ? '✏️ Edit Offer' : '➕ New Offer'}</h3>

          <div className="som-form-grid">
            <div className="som-form-col">

              <div className="som-field">
                <label className="som-label">Offer Name *</label>
                <input className="som-input" value={form.pizzaName}
                  onChange={e => setForm(f => ({ ...f, pizzaName: e.target.value }))}
                  placeholder="e.g. The Grilled Chicken Pizza" />
              </div>

              <div className="som-field">
                <label className="som-label">Description *</label>
                <textarea className="som-textarea" rows={3} value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="e.g. Purchase Any Variety & Get Same Variety FREE!" />
              </div>

              <div className="som-field">
                <label className="som-label">Badge Main Text</label>
                <textarea className="som-textarea" rows={2} value={form.badgeMain}
                  onChange={e => setForm(f => ({ ...f, badgeMain: e.target.value }))}
                  placeholder="BUY 1&#10;GET 1" />
              </div>

              <div className="som-field">
                <label className="som-label">Badge Sub Text</label>
                <textarea className="som-textarea" rows={2} value={form.badgeSub}
                  onChange={e => setForm(f => ({ ...f, badgeSub: e.target.value }))}
                  placeholder="FREE&#10;OFFER..!" />
              </div>

              <div className="som-field">
                <label className="som-label">Right Side Text</label>
                <textarea className="som-textarea" rows={3} value={form.familyText}
                  onChange={e => setForm(f => ({ ...f, familyText: e.target.value }))}
                  placeholder="Enjoy&#10;With&#10;Your&#10;Whole&#10;Family." />
              </div>

              <div className="som-field som-field--row">
                <label className="som-label">Show on Customer Page</label>
                <button
                  className={`som-toggle ${form.isActive ? 'som-toggle--on' : ''}`}
                  onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                >
                  {form.isActive ? 'Active ✅' : 'Hidden 🔴'}
                </button>
              </div>

            </div>

            {/* Right col — 4 images */}
            <div className="som-form-col">
              <label className="som-label">Pizza Images (up to 4)</label>
              <div className="som-images-grid">
                {[0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="som-image-upload"
                    onClick={() => document.getElementById(`offer-img-${i}`).click()}
                  >
                    {imagePreviews[i]
                      ? <img src={imagePreviews[i]} alt={`preview ${i}`} className="som-image-preview" />
                      : <div className="som-image-placeholder">
                          <span>🍕</span>
                          <p>Image {i + 1}</p>
                        </div>
                    }
                    <input
                      id={`offer-img-${i}`}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => handleImagePick(i, e)}
                    />
                  </div>
                ))}
              </div>
              <p className="som-hint">Click each slot to upload. These 4 images will show as a 2×2 grid on the customer page.</p>
            </div>
          </div>

          {msg && <p className={`som-msg ${msg.startsWith('✅') ? 'som-msg--ok' : 'som-msg--err'}`}>{msg}</p>}

          <div className="som-form-actions">
            <button className="som-btn som-btn--save" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editOffer ? '💾 Update Offer' : '➕ Create Offer'}
            </button>
            <button className="som-btn som-btn--cancel" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Offers List ── */}
      {offers.length === 0 ? (
        <div className="som-empty">
          <span>✦</span>
          <p>No offers yet. Click <strong>+ Add Offer</strong> to create one!</p>
        </div>
      ) : (
        <div className="som-offers-list">
          {offers.map(offer => (
            <div key={offer._id} className={`som-offer-row ${!offer.isActive ? 'som-offer-row--hidden' : ''}`}>

              {/* Images preview */}
              <div className="som-offer-imgs">
                {(offer.images || []).slice(0, 4).map((img, i) => (
                  <img key={i} src={`${IMG}${img}`} alt={`offer ${i}`} />
                ))}
                {(offer.images || []).length === 0 && <span>🍕</span>}
              </div>

              <div className="som-offer-info">
                <p className="som-offer-name">{offer.pizzaName}</p>
                <p className="som-offer-desc">{offer.description}</p>
                <p className="som-offer-badge-text">
                  Badge: <strong>{offer.badgeMain.replace('\n', ' ')} — {offer.badgeSub.replace('\n', ' ')}</strong>
                </p>
              </div>

              <span className={`som-status ${offer.isActive ? 'som-status--on' : 'som-status--off'}`}>
                {offer.isActive ? '● Live' : '● Hidden'}
              </span>

              <div className="som-offer-actions">
                <button className="som-action-btn som-action-btn--toggle"
                  onClick={() => handleToggle(offer._id)}>
                  {offer.isActive ? '🙈 Hide' : '👁 Show'}
                </button>
                <button className="som-action-btn som-action-btn--edit"
                  onClick={() => handleEdit(offer)}>
                  ✏️ Edit
                </button>
                <button className="som-action-btn som-action-btn--delete"
                  onClick={() => handleDelete(offer._id)}>
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
