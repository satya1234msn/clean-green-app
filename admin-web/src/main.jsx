import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './pages/App.jsx';
import Login from './pages/Login.jsx';
import Pending from './pages/Pending.jsx';
import Dashboard from './pages/Dashboard.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/pending" element={<App><Pending /></App>} />
        <Route path="/dashboard" element={<App><Dashboard /></App>} />
        <Route path="/" element={<Navigate to="/pending" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


