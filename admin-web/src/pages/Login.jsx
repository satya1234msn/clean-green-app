import React, { useState } from 'react';
import { authApi } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const token = res.data?.data?.token || res.data?.token;
      if (token) {
        localStorage.setItem('adminToken', token);
        window.location.href = '/pending';
      } else {
        setError('Login failed: No token returned');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#E8F5E9' }}>
      <form onSubmit={handleSubmit} style={{ background: '#C8E6C9', padding: 24, width: 360, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
        <h2 style={{ marginTop: 0, color: '#1B5E20' }}>Admin Login</h2>
        {error && <div style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</div>}
        <label style={{ color: '#1B5E20' }}>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required style={{ width: '100%', padding: 10, marginBottom: 12, border: '1px solid #A5D6A7', borderRadius: 8 }} />
        <label style={{ color: '#1B5E20' }}>Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required style={{ width: '100%', padding: 10, marginBottom: 16, border: '1px solid #A5D6A7', borderRadius: 8 }} />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, background: '#4CAF50', color: '#fff', border: 0, borderRadius: 8 }}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}


