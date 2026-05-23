'use client';

import { useEffect, useState, useRef } from 'react';

export default function TrackingPage() {
  const [riderPos, setRiderPos] = useState({ lat: 24.817, lng: 93.936 });
  const [customerPos] = useState({ lat: 24.820, lng: 93.940 });
  const [status, setStatus] = useState('Rider is on the way...');
  const [eta, setEta] = useState(8);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => setMapReady(true);
    document.head.appendChild(script);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!mapReady) return;
    const L = (window as any).L;

    const map = L.map('tracking-map').setView([riderPos.lat, riderPos.lng], 15);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // Rider marker (bike emoji)
    const riderIcon = L.divIcon({
      html: '<div style="font-size:28px">🛵</div>',
      className: '',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    // Customer marker (house emoji)
    const customerIcon = L.divIcon({
      html: '<div style="font-size:28px">🏠</div>',
      className: '',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const riderMarker = L.marker([riderPos.lat, riderPos.lng], { icon: riderIcon }).addTo(map);
    riderMarker.bindPopup('🛵 Rider').openPopup();
    markerRef.current = riderMarker;

    const customerMarker = L.marker([customerPos.lat, customerPos.lng], { icon: customerIcon }).addTo(map);
    customerMarker.bindPopup('🏠 Your Location');

    // Draw line between rider and customer
    const line = L.polyline(
      [[riderPos.lat, riderPos.lng], [customerPos.lat, customerPos.lng]],
      { color: '#ff6b35', weight: 3, dashArray: '8 8' }
    ).addTo(map);

  }, [mapReady]);

  const simulateRiderMovement = () => {
    setStatus('Rider is moving towards you...');
    let step = 0;
    const steps = 20;
    const startLat = 24.810;
    const startLng = 93.930;
    const endLat = customerPos.lat;
    const endLng = customerPos.lng;

    intervalRef.current = setInterval(() => {
      step++;
      const newLat = startLat + ((endLat - startLat) * step) / steps;
      const newLng = startLng + ((endLng - startLng) * step) / steps;

      setRiderPos({ lat: newLat, lng: newLng });
      setEta(Math.max(0, Math.round(8 - (step / steps) * 8)));

      if (markerRef.current) {
        markerRef.current.setLatLng([newLat, newLng]);
        if (mapRef.current) {
          mapRef.current.panTo([newLat, newLng]);
        }
      }

      if (step >= steps) {
        clearInterval(intervalRef.current);
        setStatus('✅ Rider has arrived!');
        setEta(0);
        if (markerRef.current) {
          markerRef.current.bindPopup('🛵 Arrived!').openPopup();
        }
      }
    }, 500);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <div style={{ background: '#ff6b35', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 24 }}>🛒</span>
        <span style={{ color: 'white', fontSize: 20, fontWeight: 600 }}>SA mart</span>
        <span style={{ color: '#ffcba4', fontSize: 13, marginLeft: 'auto' }}>Live Tracking</span>
      </div>

      {/* ETA Card */}
      <div style={{ background: 'white', margin: 16, borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ background: '#fff3ee', borderRadius: 12, padding: '12px 16px', textAlign: 'center', minWidth: 80 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#ff6b35' }}>{eta}</div>
          <div style={{ fontSize: 11, color: '#999' }}>mins away</div>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#333' }}>{status}</div>
          <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Order #QM12345</div>
        </div>
        <span style={{ fontSize: 28, marginLeft: 'auto' }}>🛵</span>
      </div>

      {/* Status steps */}
      <div style={{ background: 'white', margin: '0 16px 16px', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        {[
          { icon: '✅', label: 'Order Confirmed', done: true },
          { icon: '✅', label: 'Order Packed', done: true },
          { icon: eta < 8 ? '✅' : '🔄', label: 'Rider Picked Up', done: eta < 8 },
          { icon: eta === 0 ? '✅' : '⏳', label: 'Delivered', done: eta === 0 },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < 3 ? '1px solid #f5f5f5' : 'none' }}>
            <span style={{ fontSize: 18 }}>{s.icon}</span>
            <span style={{ fontSize: 14, color: s.done ? '#333' : '#bbb', fontWeight: s.done ? 500 : 400 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Map */}
      <div id="tracking-map" style={{ height: '350px', width: '100%', margin: '0 0 16px' }} />

      {/* Simulate button */}
      <div style={{ padding: '0 16px 24px' }}>
        <button
          onClick={simulateRiderMovement}
          style={{ width: '100%', background: '#ff6b35', color: 'white', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
        >
          🛵 Simulate Rider Movement
        </button>
      </div>
    </div>
  );
}