import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Client Pages
import CustomerHome   from './pages/client/CustomerHome.jsx';
import Login          from './pages/login.jsx';
import Register       from './pages/register.jsx';
import CustomerMenu       from './pages/client/CustomerMenu.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/adminDashboard.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Client Routes */}
          <Route path="/"         element={<CustomerHome />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menu"     element={<CustomerMenu />} /> {/* ✅ Added */}

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;