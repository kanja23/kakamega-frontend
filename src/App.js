// src/App.js - Now with a Router
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import LoggedInPage from './LoggedInPage'; // Import the new page
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<LoggedInPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

