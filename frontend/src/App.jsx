import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import CustomerHome   from './pages/client/CustomerHome.jsx';
import Login          from './pages/login.jsx';
import Register       from './pages/register.jsx';
// import AdminDashboard from './pages/admin/AdminDashboard.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>

          <Route path="/"              element={<CustomerHome />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />

          {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
          {/* <Route path="/customer-home" element={<CustomerHome />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;