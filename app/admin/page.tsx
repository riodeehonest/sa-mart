'use client';

import { useEffect, useState } from 'react';

const riders = [
  { id: 1, name: 'Rahul Singh', status: 'Delivering', orders: 3, lat: 24.817, lng: 93.936 },
  { id: 2, name: 'Amit Kumar', status: 'Available', orders: 0, lat: 24.820, lng: 93.940 },
  { id: 3, name: 'Priya Devi', status: 'Delivering', orders: 2, lat: 24.815, lng: 93.930 },
];

const zones = [
  { id: 1, name: 'Imphal City Zone', orders: 45, revenue: '₹12,400', active: true },
  { id: 2, name: 'Lamphelpat Zone', orders: 28, revenue: '₹8,200', active: true },
  { id: 3, name: 'Singjamei Zone', orders: 12, revenue: '₹3,800', active: false },
];

const stats = [
  { label: 'Active Orders', value: '24', icon: '📦', color: '#ff6b35' },
  { label: 'Riders Online', value: '3', icon: '🛵', color: '#4CAF50' },
  { label: "Today's Revenue", value: '₹24,400', icon: '💰', color: '#2196F3' },
  { label: 'Zones Active', value: '2', icon: '🗺️', color: '#9C27B0' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mapReady, setMapReady] = useState(false);
  const [zones_list, setZonesList] = useState(zones);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => setMapReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapReady || activeTab !== 'map') return;
    const L = (window as any).L;
    const existing = (document.getElementById('admin-map') as any)._leaflet_id;
    if (existing) return;

    const map = L.map('admin-map').setView([24.817, 93.936], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // Add rider markers
    riders.forEach(rider => {
      const icon = L.divIcon({
        html: `<div style="background:${rider.status === 'Delivering' ? '#ff6b35' : '#4CAF50'};color:white;padding:4px 8px;border-radius:12px;font-size:11px;font-weight:600;white-space:nowrap">🛵 ${rider.name.split(' ')[0]}</div>`,
        className: '',
        iconAnchor: [40, 15]
      });
      L.marker([rider.lat, rider.lng], { icon }).addTo(map)
        .bindPopup(`<b>${rider.name}</b><br>Status: ${rider.status}<br>Orders: ${rider.orders}`);
    });

    // Add zone circles
    L.circle([24.817, 93.936], { color: '#ff6b35', fillColor: '#ff6b35', fillOpacity: 0.1, radius: 1500 })
      .addTo(map).bindPopup('Imphal City Zone');
    L.circle([24.820, 93.945], { color: '#2196F3', fillColor: '#2196F3', fillOpacity: 0.1, radius: 1000 })
      .addTo(map).bindPopup('Lamphelpat Zone');

  }, [mapReady, activeTab]);

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Header */}
      <div style={{ background: '#1a1a2e', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 24 }}>⚙️</span>
        <span style={{ color: 'white', fontSize: 18, fontWeight: 600 }}>SA mart Admin</span>
        <span style={{ color: '#aaa', fontSize: 13, marginLeft: 'auto' }}>Dashboard</span>
      </div>

      {/* Tabs */}
      <div style={{ background: 'white', padding: '0 16px', display: 'flex', gap: 4, borderBottom: '1px solid #eee' }}>
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'riders', label: '🛵 Riders' },
          { id: 'zones', label: '🗺️ Zones' },
          { id: 'map', label: '📍 Live Map' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 16px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 500,
              color: activeTab === tab.id ? '#ff6b35' : '#666',
              borderBottom: activeTab === tab.id ? '2px solid #ff6b35' : '2px solid transparent'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'white', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Recent Orders</div>
            {[
              { id: '#QM001', customer: 'Mohan Singh', area: 'Imphal City', status: 'Delivering', time: '8 mins' },
              { id: '#QM002', customer: 'Priya Devi', area: 'Lamphelpat', status: 'Packed', time: '12 mins' },
              { id: '#QM003', customer: 'Ravi Kumar', area: 'Singjamei', status: 'Confirmed', time: '15 mins' },
            ].map((o, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: i < 2 ? '1px solid #f5f5f5' : 'none' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{o.id} — {o.customer}</div>
                  <div style={{ fontSize: 12, color: '#999' }}>{o.area} • ETA: {o.time}</div>
                </div>
                <span style={{
                  marginLeft: 'auto', fontSize: 11, padding: '3px 10px', borderRadius: 20,
                  background: o.status === 'Delivering' ? '#fff3ee' : o.status === 'Packed' ? '#e3f2fd' : '#f3e5f5',
                  color: o.status === 'Delivering' ? '#ff6b35' : o.status === 'Packed' ? '#1976d2' : '#7b1fa2'
                }}>
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Riders Tab */}
      {activeTab === 'riders' && (
        <div style={{ padding: 16 }}>
          {riders.map((rider, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: rider.status === 'Delivering' ? '#fff3ee' : '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                🛵
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{rider.name}</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>Active Orders: {rider.orders}</div>
              </div>
              <span style={{
                fontSize: 11, padding: '4px 12px', borderRadius: 20, fontWeight: 500,
                background: rider.status === 'Delivering' ? '#fff3ee' : '#e8f5e9',
                color: rider.status === 'Delivering' ? '#ff6b35' : '#2e7d32'
              }}>
                {rider.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Zones Tab */}
      {activeTab === 'zones' && (
        <div style={{ padding: 16 }}>
          {zones_list.map((zone, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{zone.name}</div>
                <button
                  onClick={() => {
                    const updated = [...zones_list];
                    updated[i].active = !updated[i].active;
                    setZonesList(updated);
                  }}
                  style={{
                    marginLeft: 'auto', fontSize: 11, padding: '4px 12px', borderRadius: 20,
                    border: 'none', cursor: 'pointer', fontWeight: 500,
                    background: zone.active ? '#e8f5e9' : '#ffebee',
                    color: zone.active ? '#2e7d32' : '#c62828'
                  }}
                >
                  {zone.active ? '✅ Active' : '❌ Inactive'}
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: '#f9f9f9', borderRadius: 8, padding: 10 }}>
                  <div style={{ fontSize: 11, color: '#999' }}>Today Orders</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#ff6b35' }}>{zone.orders}</div>
                </div>
                <div style={{ background: '#f9f9f9', borderRadius: 8, padding: 10 }}>
                  <div style={{ fontSize: 11, color: '#999' }}>Revenue</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#4CAF50' }}>{zone.revenue}</div>
                </div>
              </div>
            </div>
          ))}
          <button style={{ width: '100%', background: '#ff6b35', color: 'white', border: 'none', borderRadius: 10, padding: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            + Add New Zone
          </button>
        </div>
      )}

      {/* Live Map Tab */}
      {activeTab === 'map' && (
        <div>
          <div style={{ padding: '12px 16px', background: 'white', borderBottom: '1px solid #eee', display: 'flex', gap: 16 }}>
            <span style={{ fontSize: 12, color: '#ff6b35' }}>🔴 Delivering</span>
            <span style={{ fontSize: 12, color: '#4CAF50' }}>🟢 Available</span>
            <span style={{ fontSize: 12, color: '#2196F3' }}>🔵 Zone</span>
          </div>
          <div id="admin-map" style={{ height: '500px', width: '100%' }} />
        </div>
      )}
    </div>
  );
}