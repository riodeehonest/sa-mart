'use client';

import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [location, setLocation] = useState({ lat: 24.8170, lng: 93.9368 });
  const [address, setAddress] = useState('Imphal, Manipur');
  const [serviceable, setServiceable] = useState<boolean | null>(null);
  const [locating, setLocating] = useState(false);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => initMap(24.8170, 93.9368);
    document.head.appendChild(script);
  }, []);

  const initMap = (lat: number, lng: number) => {
    const L = (window as any).L;
    if (mapRef.current) {
      mapRef.current.remove();
    }
    const map = L.map('map').setView([lat, lng], 14);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    markerRef.current = marker;
    marker.bindPopup('📍 Your Location').openPopup();

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
  };

  const useCurrentLocation = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      alert('Location not supported on this browser.');
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });
        setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        setLocating(false);

        // Move marker and map to new location
        if (markerRef.current && mapRef.current) {
          markerRef.current.setLatLng([lat, lng]);
          markerRef.current.bindPopup('📍 Your Location').openPopup();
          mapRef.current.flyTo([lat, lng], 16);
        }
      },
      (error) => {
        setLocating(false);
        if (error.code === 1) {
          alert('Location permission denied. Please allow location access in your browser settings and try again.');
        } else {
          alert('Could not get your location. Please try again.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const checkDelivery = async () => {
    try {
      const res = await fetch('https://sa-mart-eight.vercel.app/api/serviceability', {
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
          📌 Click on map or drag pin to select location
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