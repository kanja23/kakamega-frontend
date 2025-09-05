// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Simple error handling
try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('React app rendered successfully');
} catch (error) {
  console.error('Failed to render React app:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h2>Application Error</h2>
      <p>${error.message}</p>
      <button onclick="window.location.reload()">Reload Page</button>
    </div>
  `;
}
