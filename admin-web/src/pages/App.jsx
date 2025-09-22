import React from 'react';
import { Link } from 'react-router-dom';

export default function App({ children }) {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, Arial', background: '#E8F5E9', minHeight: '100vh' }}>
      <header style={{ background: '#4CAF50', color: '#fff', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700 }}>Clean&Green Admin</div>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/pending" style={{ color: '#fff', textDecoration: 'none' }}>Pickups</Link>
          <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
        </nav>
      </header>
      <main style={{ maxWidth: 1100, margin: '20px auto', padding: '0 16px' }}>
        {children}
      </main>
    </div>
  );
}


