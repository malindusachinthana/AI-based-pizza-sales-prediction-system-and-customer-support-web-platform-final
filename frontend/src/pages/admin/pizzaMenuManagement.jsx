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

