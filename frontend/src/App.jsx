import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Client Pages
import CustomerHome      from './pages/client/CustomerHome.jsx';
import Login             from './pages/login.jsx';
import Register          from './pages/register.jsx';
import CustomerMenu      from './pages/client/CustomerMenu.jsx';
import Cart              from './pages/client/cart.jsx';
import OrderConfirmation from './pages/client/OrderConfirmation.jsx';
import CustomerProfile   from './pages/client/CustomerProfile.jsx';
import SpecialOffers     from './pages/client/specialOffers.jsx';
import Gallery           from './pages/client/gallery.jsx'

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
          <Route path="/customer-profile" element={<CustomerProfile />} />
          <Route path="/special-offers" element={<SpecialOffers />} />
          <Route path="/gallery" element={<Gallery />} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/forecast"  element={<SalesForecast />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;