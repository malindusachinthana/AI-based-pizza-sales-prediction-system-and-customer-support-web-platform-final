import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../style/pizzaMenuManagement.css';

export default function PizzaMenuManagement() {
  const [pizzas,    setPizzas]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);

  const [formData, setFormData] = useState({
    name:        '',
    category:    'Classic',
    description: '',
    smallPrice:  '',
    mediumPrice: '',
    largePrice:  '',
    image:       null
  });

  const [preview,       setPreview]       = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});

  // ── Fetch pizzas ──────────────────────────────────────────
  const fetchPizzas = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/pizzas');
      setPizzas(res.data);
      const initial = {};
      res.data.forEach(p => { initial[p._id] = 'medium'; });
      setSelectedSizes(initial);
    } catch (err) {
      console.error('Failed to fetch pizzas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPizzas(); }, []);

  // ── Handle form input ─────────────────────────────────────
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // ── Add pizza ─────────────────────────────────────────────
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      Swal.fire('Error', 'Please select an image!', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const data  = new FormData();
      data.append('name',        formData.name);
      data.append('category',    formData.category);
      data.append('description', formData.description);
      data.append('smallPrice',  formData.smallPrice);
      data.append('mediumPrice', formData.mediumPrice);
      data.append('largePrice',  formData.largePrice);
      data.append('image',       formData.image);

      await axios.post('http://localhost:5000/api/pizzas', data, {
        headers: {
          Authorization:  `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      await Swal.fire({
        title: '🍕 Pizza Added!',
        text:  `${formData.name} added successfully!`,
        icon:  'success',
        timer: 1500,
        showConfirmButton: false
      });

      setFormData({
        name: '', category: 'Classic', description: '',
        smallPrice: '', mediumPrice: '', largePrice: '', image: null
      });
      setPreview(null);
      setShowForm(false);
      fetchPizzas();

    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to add pizza', 'error');
    }
  };

  // ── Delete pizza ──────────────────────────────────────────
  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Pizza?',
      text:  `Are you sure you want to delete "${name}"?`,
      icon:  'warning',
      showCancelButton:   true,
      confirmButtonColor: '#c0392b',
      cancelButtonColor:  '#3a4a32',
      confirmButtonText:  'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/pizzas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await Swal.fire({
        title: 'Deleted!',
        text:  `${name} has been removed.`,
        icon:  'success',
        timer: 1500,
        showConfirmButton: false
      });

      fetchPizzas();
    } catch (err) {
      Swal.fire('Error', 'Failed to delete pizza', 'error');
    }
  };

  // ── Group by category ─────────────────────────────────────
  const groupedPizzas = {
    Classic: pizzas.filter(p => p.category === 'Classic'),
    Chicken: pizzas.filter(p => p.category === 'Chicken'),
    Supreme: pizzas.filter(p => p.category === 'Supreme'),
    Veggie:  pizzas.filter(p => p.category === 'Veggie'),
  };

  return (
    <div className="admin-content">

      {/* ── Header ── */}
      <div className="content-header">
        <div>
          <h1 className="content-title">Pizza Menu Management</h1>
          <span className="content-date">Total: {pizzas.length} pizzas</span>
        </div>
        <button
          className="add-pizza-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Add New Pizza'}
        </button>
      </div>

      {/* ── Add Form ── */}
      {showForm && (
        <div className="add-pizza-form">
          <h2 className="form-title">Add New Pizza</h2>
          <form onSubmit={handleAdd}>
            <div className="form-grid">

              <div className="form-group">
                <label>Pizza Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. The BBQ Chicken Pizza"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="Classic">Classic</option>
                  <option value="Chicken">Chicken</option>
                  <option value="Supreme">Supreme</option>
                  <option value="Veggie">Veggie</option>
                </select>
              </div>

              {/* ✅ Size Prices */}
              <div className="form-group">
                <label>Small Price (Rs.)</label>
                <input
                  type="number"
                  name="smallPrice"
                  value={formData.smallPrice}
                  onChange={handleChange}
                  placeholder="e.g. 1000"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Medium Price (Rs.)</label>
                <input
                  type="number"
                  name="mediumPrice"
                  value={formData.mediumPrice}
                  onChange={handleChange}
                  placeholder="e.g. 1500"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Large Price (Rs.)</label>
                <input
                  type="number"
                  name="largePrice"
                  value={formData.largePrice}
                  onChange={handleChange}
                  placeholder="e.g. 2000"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Pizza Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  required
                />
              </div>

              <div className="form-group form-group--full">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the pizza..."
                  rows="3"
                />
              </div>

              {preview && (
                <div className="form-group form-group--full">
                  <label>Image Preview</label>
                  <img src={preview} alt="Preview" className="form-preview" />
                </div>
              )}

            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-submit">✓ Add Pizza</button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => { setShowForm(false); setPreview(null); }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Pizza List ── */}
      {loading ? (
        <div className="loading-stats">🍕 Loading pizzas...</div>
      ) : pizzas.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍕</div>
          <p>No pizzas yet. Click "+ Add New Pizza" to start!</p>
        </div>
      ) : (
        Object.entries(groupedPizzas).map(([category, list]) =>
          list.length > 0 && (
            <div className="category-section" key={category}>
              <h2 className="category-title">{category}</h2>
              <div className="pizza-grid">
                {list.map(pizza => (
                  <div className="pizza-card" key={pizza._id}>

                    {/* Image */}
                    <div className="pizza-card-img-wrap">
                      <img
                        src={`http://localhost:5000${pizza.imageUrl}`}
                        alt={pizza.name}
                        className="pizza-card-img"
                      />
                    </div>

                    {/* Body */}
                    <div className="pizza-card-body">
                      <h3 className="pizza-card-name">{pizza.name}</h3>

                      {/* ✅ Size Dropdown */}
                      <div className="pizza-size-row">
                        <select
                          className="pizza-size-select"
                          value={selectedSizes[pizza._id] || 'medium'}
                          onChange={(e) =>
                            setSelectedSizes({
                              ...selectedSizes,
                              [pizza._id]: e.target.value
                            })
                          }
                        >
                          <option value="small">
                            Small — Rs. {pizza.sizes?.small}
                          </option>
                          <option value="medium">
                            Medium — Rs. {pizza.sizes?.medium}
                          </option>
                          <option value="large">
                            Large — Rs. {pizza.sizes?.large}
                          </option>
                        </select>
                      </div>

                      {/* Price + Delete */}
                      {/* Price + Delete */}
                        <div className="pizza-card-footer">
                            <span className="pizza-card-price">
                            {selectedSizes[pizza._id] === 'small'  ? 'Small'  :
                            selectedSizes[pizza._id] === 'large'  ? 'Large'  : 'Medium'}
                            {' — '}Rs. {pizza.sizes?.[selectedSizes[pizza._id] || 'medium']}
                            </span>
                            <button
                                className="btn-delete"
                                onClick={() => handleDelete(pizza._id, pizza.name)}
                            >
                                🗑️ Delete Pizza
                            </button>
                        </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )
        )
      )}
    </div>
  );
}