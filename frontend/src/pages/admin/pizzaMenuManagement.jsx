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

