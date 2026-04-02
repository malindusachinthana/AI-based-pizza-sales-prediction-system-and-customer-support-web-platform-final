import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "../src/pages/login";


function App() {
  return (
    <Router>
      <div className="Login">
        <Routes> 

          <Route path="/" element={<Login />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;