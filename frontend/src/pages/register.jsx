import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../style/register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    
    setError('');
    // TODO: Send data to your Node.js backend here
    console.log("Registration data:", formData);
    
    // Redirect back to login after successful registration
    alert("Registration successful! Please login.");
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>OvenZa Crust</h1>
        <div className="auth-letter">
        <h3>Register Here,</h3></div>
        
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              placeholder="Choose a username" 
              required 
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Enter your email" 
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Create a password" 
              required 
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              placeholder="Confirm your password" 
              required 
            />
          </div>

          <button type="submit" className="primary-btn">Submit</button>
        </form>

        <p className="redirect-text">
          I already have an account? {' '}
          <span className="redirect-link" onClick={() => navigate('/')}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;