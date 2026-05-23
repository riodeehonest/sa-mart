'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [location, setLocation] = useState({ lat: 24.817, lng: 93.936 });
  const [address, setAddress] = useState('Detecting your location...');
  const [serviceable, setServiceable] = useState<boolean | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setAddress(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        },
        () => setAddress('Imphal, Manipur, India')
      );
    }

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
    if (!mapReady) return;
    const L = (window as any).L;
    const map = L.map('map').setView([location.lat, location.lng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);
    const marker = L.marker([location.lat, location.lng], { draggable: true }).addTo(map);
    marker.bindPopup('Your Location').openPopup();
    marker.on('dragend', (e: any) => {
      const p = e.target.getLatLng();
      setLocation({ lat: p.lat, lng: p.lng });
      setAddress(`${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`);
    });
    map.on('click', (e: any) => {
      marker.setLatLng(e.latlng);
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      setAddress(`${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`);
    });
    return () => map.remove();
  }, [mapReady]);

  const useCurrentLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLat = pos.coords.latitude;
          const newLng = pos.coords.longitude;
          setLocation({ lat: newLat, lng: newLng });
          setAddress(`${newLat.toFixed(4)}, ${newLng.toFixed(4)}`);
          setLocating(false);
        },
        () => {
          setLocating(false);
          alert('Could not get your location. Please allow location access.');
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocating(false);
      alert('Location not supported on this device.');
    }
  };

  const checkDelivery = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/serviceability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(location)
      });
      const data = await res.json();
      setServiceable(data.serviceable);
    } catch {
      setServiceable(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <div style={{ background: '#ff6b35', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 24 }}>🛒</span>
        <span style={{ color: 'white', fontSize: 20, fontWeight: 600 }}>SA Mart</span>
        <span style={{ color: '#ffcba4', fontSize: 13, marginLeft: 'auto' }}>Delivery in 10 mins</span>
      </div>

      {/* Location bar */}
      <div style={{ background: 'white', padding: '12px 16px', borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 18 }}>📍</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#999' }}>Delivering to</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{address}</div>
          </div>
        </div>

        {/* Buttons row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button
            onClick={useCurrentLocation}
            disabled={locating}
            style={{
              background: locating ? '#eee' : '#fff3ee',
              color: locating ? '#999' : '#ff6b35',
              border: '1.5px solid #ff6b35',
              borderRadius: 10, padding: '10px 8px',
              fontSize: 13, fontWeight: 600,
              cursor: locating ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
            }}
          >
            {locating ? '⏳ Locating...' : '📍 Use My Location'}
          </button>
          <button
            onClick={checkDelivery}
            style={{
              background: '#ff6b35', color: 'white',
              border: 'none', borderRadius: 10,
              padding: '10px 8px', fontSize: 13,
              fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
            }}
          >
            🚚 Check Delivery
          </button>
        </div>
      </div>

      {/* Serviceability banner */}
      {serviceable !== null && (
        <div style={{
          background: serviceable ? '#e8f5e9' : '#ffebee',
          color: serviceable ? '#2e7d32' : '#c62828',
          padding: '10px 20px', fontSize: 14,
          fontWeight: 500, textAlign: 'center'
        }}>
          {serviceable ? '✅ Delivery available at your location!' : '❌ Delivery not available here yet.'}
        </div>
      )}

      {/* Map */}
      <div style={{ position: 'relative' }}>
        <div id="map" style={{ height: '420px', width: '100%' }} />
        <div style={{
          position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          background: 'white', padding: '8px 16px', borderRadius: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)', fontSize: 12, color: '#333', whiteSpace: 'nowrap'
        }}>
          📌 Click on map or drag pin to change location
        </div>
      </div>

      {/* Bottom card */}
      <div style={{ background: 'white', margin: 16, borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Selected Location</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div style={{ background: '#f9f9f9', borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 11, color: '#999' }}>Latitude</div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>{location.lat.toFixed(6)}</div>
          </div>
          <div style={{ background: '#f9f9f9', borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 11, color: '#999' }}>Longitude</div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>{location.lng.toFixed(6)}</div>
          </div>
        </div>
        <button style={{
          width: '100%', background: '#ff6b35', color: 'white',
          border: 'none', borderRadius: 10, padding: '14px',
          fontSize: 15, fontWeight: 600, cursor: 'pointer'
        }}>
          Confirm Location & Shop Now 🛍️
        </button>
      </div>
    </div>
  );
}