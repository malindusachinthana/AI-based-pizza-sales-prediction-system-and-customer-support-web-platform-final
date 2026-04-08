// App.js (or App.jsx)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your page components
import Login from './pages/login.jsx';       // Adjust the path based on your folder structure
import Register from './pages/register.jsx'; // Adjust the path based on your folder structure

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* This makes Login the default page when the app loads */}
          <Route path="/" element={<Login />} />
          
          {/* This is the route your Login page redirect is looking for */}
          <Route path="/register" element={<Register />} />
          
          {/* You will add these routes later based on your login logic */}
          {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
          {/* <Route path="/customer-home" element={<CustomerHome />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;