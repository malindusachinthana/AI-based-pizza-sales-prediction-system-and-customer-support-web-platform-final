import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Client Pages
import CustomerHome      from './pages/client/CustomerHome.jsx';
import Login             from './pages/login.jsx';
import Register          from './pages/register.jsx';
import CustomerMenu      from './pages/client/CustomerMenu.jsx';
import Cart              from './pages/client/cart.jsx';
import OrderConfirmation from './pages/client/OrderConfirmation.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/adminDashboard.jsx';
import SalesForecast  from './pages/admin/SalesForecast';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Client Routes */}
          <Route path="/"                   element={<CustomerHome />} />
          <Route path="/login"              element={<Login />} />
          <Route path="/register"           element={<Register />} />
          <Route path="/menu"               element={<CustomerMenu />} />
          <Route path="/cart"               element={<Cart />} />              
          <Route path="/order-confirmation" element={<OrderConfirmation />} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/forecast"  element={<SalesForecast />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;