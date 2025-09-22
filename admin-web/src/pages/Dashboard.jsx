import React, { useEffect, useState } from 'react';
import { pickupApi } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [p, a, r] = await Promise.all([
          pickupApi.list({ status: 'pending', limit: 1 }),
          pickupApi.list({ status: 'awaiting_agent', limit: 1 }),
          pickupApi.list({ status: 'admin_rejected', limit: 1 }),
        ]);
        setStats({
          pending: p.data?.data?.pagination?.total || 0,
          approved: a.data?.data?.pagination?.total || 0,
          rejected: r.data?.data?.pagination?.total || 0,
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h2 style={{ color: '#1B5E20' }}>Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <Card title="Pending" value={stats.pending} color="#FF9800" loading={loading} />
        <Card title="Approved" value={stats.approved} color="#4CAF50" loading={loading} />
        <Card title="Rejected" value={stats.rejected} color="#F44336" loading={loading} />
      </div>
    </div>
  );
}

function Card({ title, value, color, loading }) {
  return (
    <div style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
      <div style={{ color: '#666', fontSize: 14 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{loading ? '…' : value}</div>
    </div>
  );
}


