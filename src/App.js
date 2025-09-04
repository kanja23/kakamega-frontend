// src/App.js - Now with the real Dashboard
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage'; // <-- Import the REAL dashboard
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} /> {/* <-- Use it here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;


