import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../style/register.css';

// Register Success Overlay

function RegisterOverlay({ show, username }) {
  if (!show) return null;
  return (
    <div className="register-overlay">
      <div className="register-anim-box">
        <div className="register-icon">🎉</div>
        <div className="register-pizza">🍕</div>
        <h2 className="register-title">Welcome to OvenZa..!</h2>
        <p className="register-sub">
          Account created for <strong>{username}</strong>!
        </p>
        <p className="register-sub2">Redirecting you to login..!</p>
        <div className="register-bar-wrap">
          <div className="register-bar" />
        </div>
      </div>
    </div>
  );
}

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username:        '',
    email:           '',
    password:        '',
    confirmPassword: ''
  });

  const [error,       setError]       = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [regUser,     setRegUser]     = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Check passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Password strength check
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username: formData.username,
        email:    formData.email,
        password: formData.password
      });

      // Show animation instead of Swal
      setRegUser(formData.username);
      setShowSuccess(true);

      // Wait 2.8s then redirect to login
      setTimeout(() => {
        navigate('/login');
      }, 2800);

    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      {/* Success Animation Overlay */}
      <RegisterOverlay show={showSuccess} username={regUser} />

      <div className="auth-container">
        <div className="auth-box">
          <h1>OvenZa Crust</h1>
          <div className="auth-letter">
            <h3>Register Here,</h3>
          </div>

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
            I already have an account?{' '}
            <Link to="/login" className="redirect-link">
              Login here
            </Link>
          </p>

        </div>
      </div>
    </>
  );
};

export default Register;