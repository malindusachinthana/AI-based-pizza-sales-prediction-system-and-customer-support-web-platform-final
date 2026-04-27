import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../style/login.css';
import logoImage from '../assets/OvenzaCrustlogo.png';

// ── Login Animation Overlay ───────────────────────────────────
function LoginOverlay({ show, username }) {
  if (!show) return null;
  return (
    <div className="login-overlay">
      <div className="login-box">
        <div className="login-pizza">🍕</div>
        <h2 className="login-title">Welcome Back!</h2>
        <p className="login-sub">👋 Hi, <strong>{username}</strong>! Ready to explore?</p>
        <div className="login-bar-wrap">
          <div className="login-bar" />
        </div>
      </div>
    </div>
  );
}
  
function Login() {
  const [username, setUsername]         = useState("");
  const [password, setPassword]         = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLogin, setShowLogin]       = useState(false); // ✅ Add this
  const [loggedUser, setLoggedUser]     = useState("");    // ✅ Add this

  const navigate = useNavigate();

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Redirecting to password reset...");
  };

  const validate = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });

      const data = response.data;

      // Store token and user info
      localStorage.setItem("token",    data.token);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("username", data.username);

      // ✅ Show animation first
      setLoggedUser(data.username);
      setShowLogin(true);

      // ✅ Wait 2.5s then redirect
      setTimeout(() => {
        if (data.role === 'admin') {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      }, 2500);

    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      {/* ✅ Login Animation Overlay */}
      <LoginOverlay show={showLogin} username={loggedUser} />

      <div id="heroDiv">
        <Link to="/">
          <img src={logoImage} alt="OvenZa Crust Logo" className="top-left-logo" />
        </Link>
        <h2>Welcome</h2>

        <div id="loginForm-container">
          <form id="loginForm" onSubmit={validate}>

            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />

            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />

            <div className="remember-forgot">
              <span
                className="forgot-btn-link"
                onClick={handleForgotPassword}
              >
                Forgot password..?
              </span>
            </div>

            {errorMessage && (
              <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
            )}

            <button type="submit" style={{ marginTop: "15px" }}>Login</button>

            <div className="register-link">
              <p>Don't have an account?{' '}
                <Link to="/register">Register</Link>
              </p>
            </div>

        </form>
      </div>
    </div>

    
  );
}

export default Login;