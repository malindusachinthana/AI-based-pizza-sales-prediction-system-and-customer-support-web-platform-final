import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swal } from 'sweetalert2/dist/sweetalert2.all.js';
import axios from 'axios'; 
import '../style/login.css'
import logoImage from '../assets/OvenzaCrustlogo.png';

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const navigate = useNavigate();

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Add your forgot password modal or routing logic here later
    alert("Redirecting to password reset..."); 
  };

  const handleRegisterRedirect = () => {
    navigate("/register"); // Ensure you have this route defined in App.js
  };

  const validate = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      // Call Node.js backend
      const response = await axios.post('http://localhost:5000/api/auth/login', { 
        userName, 
        password 
      });
      
      const data = response.data;

      // 1. Store the secure JWT token and user details in localStorage
      localStorage.setItem("token", data.token); 
      localStorage.setItem("userId", data._id);
      localStorage.setItem("userRole", data.role); // 'admin' or 'customer'

      Swal.fire("Success", "Login Successful", "success");

      // 2. Role-Based Routing 
      if (data.role === 'admin') {
        navigate("/admin-dashboard"); // Routes to AdminDashboard.jsx
      } else {
        navigate("/customer-home"); // Routes to CustomerHome.jsx
      }

    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div id="heroDiv">
     <h2>Welcome</h2>
     <img src={logoImage} alt="OvenZa Crust Logo" className="top-left-logo" /> 

      <div id="loginForm-container">
        <form id="loginForm" onSubmit={validate}>
          <label>Username:</label>
          <input 
            type="text" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
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
          
          <div className="remember-forgot" >

            <text 
                type="text" 
                className="forgot-btn-link" 
                onClick={handleForgotPassword}
            >   Forgot password..?
            </text>
          </div>



          {errorMessage && <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>}
          
          <button type="submit" style={{ marginTop: "15px" }}>Login</button>

          <div className="register-link">
            <p>Don't have an account? <span onClick={handleRegisterRedirect}>Register</span></p>
          </div>

        </form>
      </div>
    </div>

    
  );
}

export default Login;