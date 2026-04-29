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

