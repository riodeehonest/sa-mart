'use client';

import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [location, setLocation] = useState({ lat: 24.8170, lng: 93.9368 });
  const [address, setAddress] = useState('Imphal, Manipur');
  const [serviceable, setServiceable] = useState<boolean | null>(null);
  const [locating, setLocating] = useState(false);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      if (data && data.address) {
        const a = data.address;
        const parts = [
          a.suburb || a.neighbourhood || a.village || a.town,
          a.city || a.district || a.county,
          a.state
        ].filter(Boolean);
        setAddress(parts.join(', ') || data.display_name);
      }
    } catch {
      setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

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
    if (mapRef.current) mapRef.current.remove();

    const map = L.map('map').setView([lat, lng], 14);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    markerRef.current = marker;
    marker.bindPopup('📍 Your Location').openPopup();

    marker.on('dragend', async (e: any) => {
      const p = e.target.getLatLng();
      setLocation({ lat: p.lat, lng: p.lng });
      await getAddressFromCoords(p.lat, p.lng);
    });

    map.on('click', async (e: any) => {
      marker.setLatLng(e.latlng);
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      await getAddressFromCoords(e.latlng.lat, e.latlng.lng);
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
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });
        setLocating(false);
        await getAddressFromCoords(lat, lng);
        if (markerRef.current && mapRef.current) {
          markerRef.current.setLatLng([lat, lng]);
          markerRef.current.bindPopup('📍 Your Location').openPopup();
          mapRef.current.flyTo([lat, lng], 16);
        }
      },
      (error) => {
        setLocating(false);
        if (error.code === 1) {
          alert('Location permission denied. Please allow location access in browser settings.');
        } else {
          alert('Could not get your location. Please try again.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
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
            <div style={{ fontSize: 14, fontWeight: 500, color: '#333' }}>{address}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button onClick={useCurrentLocation} disabled={locating}
            style={{ background: locating ? '#eee' : '#fff3ee', color: locating ? '#999' : '#ff6b35', border: '1.5px solid #ff6b35', borderRadius: 10, padding: '10px 8px', fontSize: 13, fontWeight: 600, cursor: locating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {locating ? '⏳ Locating...' : '📍 Use My Location'}
          </button>
          <button onClick={checkDelivery}
            style={{ background: '#ff6b35', color: 'white', border: 'none', borderRadius: 10, padding: '10px 8px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            🚚 Check Delivery
          </button>
        </div>
      </div>

      {serviceable !== null && (
        <div style={{ background: serviceable ? '#e8f5e9' : '#ffebee', color: serviceable ? '#2e7d32' : '#c62828', padding: '10px 20px', fontSize: 14, fontWeight: 500, textAlign: 'center' }}>
          {serviceable ? '✅ Delivery available at your location!' : '❌ Delivery not available here yet.'}
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <div id="map" style={{ height: '420px', width: '100%' }} />
        <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '8px 16px', borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', fontSize: 12, color: '#333', whiteSpace: 'nowrap' }}>
          📌 Click on map or drag pin to select location
        </div>
      </div>

      <div style={{ background: 'white', margin: 16, borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Selected Location</div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 12, padding: '10px', background: '#f9f9f9', borderRadius: 8 }}>
          📍 {address}
        </div>
        <button style={{ width: '100%', background: '#ff6b35', color: 'white', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          Confirm Location & Shop Now 🛍️
        </button>
      </div>
    </div>
  );
}