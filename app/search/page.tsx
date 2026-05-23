'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const allProducts = [
  { id: 1, name: 'Fresh Apples', category: 'Fruits', price: 120, unit: '1 kg', icon: '🍎', rating: 4.5 },
  { id: 2, name: 'Bananas', category: 'Fruits', price: 40, unit: '6 pcs', icon: '🍌', rating: 4.2 },
  { id: 3, name: 'Broccoli', category: 'Vegetables', price: 60, unit: '500 g', icon: '🥦', rating: 4.0 },
  { id: 4, name: 'Tomatoes', category: 'Vegetables', price: 30, unit: '500 g', icon: '🍅', rating: 4.3 },
  { id: 5, name: 'Full Cream Milk', category: 'Dairy', price: 55, unit: '1 litre', icon: '🥛', rating: 4.7 },
  { id: 6, name: 'Butter', category: 'Dairy', price: 45, unit: '100 g', icon: '🧈', rating: 4.4 },
  { id: 7, name: 'Lays Chips', category: 'Snacks', price: 20, unit: '1 pack', icon: '🍿', rating: 4.6 },
  { id: 8, name: 'Coca Cola', category: 'Beverages', price: 40, unit: '500 ml', icon: '🥤', rating: 4.5 },
  { id: 9, name: 'Bread', category: 'Bakery', price: 35, unit: '1 loaf', icon: '🍞', rating: 4.3 },
  { id: 10, name: 'Chicken', category: 'Meat', price: 180, unit: '500 g', icon: '🥩', rating: 4.6 },
  { id: 11, name: 'Orange Juice', category: 'Beverages', price: 80, unit: '1 litre', icon: '🍊', rating: 4.4 },
  { id: 12, name: 'Spinach', category: 'Vegetables', price: 25, unit: '250 g', icon: '🥬', rating: 4.1 },
];

const trending = ['Milk', 'Apples', 'Chicken', 'Bread', 'Chips'];
const recent = ['Tomatoes', 'Butter', 'Bananas'];

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<{ [key: number]: number }>({});

  const results = query.length > 0
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const addToCart = (id: number) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id: number) => setCart(prev => {
    const updated = { ...prev };
    if (updated[id] > 1) updated[id]--;
    else delete updated[id];
    return updated;
  });

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = allProducts.find(p => p.id === Number(id));
    return sum + (p ? p.price * qty : 0);
  }, 0);

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f5f5f5', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: '#ff6b35', padding: '14px 16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <span style={{ fontSize: 24 }}>🔍</span>
          <span style={{ color: 'white', fontSize: 20, fontWeight: 600 }}>Search</span>
        </div>
        {/* Search bar */}
        <div style={{ background: 'white', borderRadius: 14, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for products, categories..."
            style={{ border: 'none', outline: 'none', fontSize: 15, flex: 1, color: '#333' }}
          />
          {query.length > 0 && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#999' }}>✕</button>
          )}
        </div>
      </div>

      {/* Empty state — show trending & recent */}
      {query.length === 0 && (
        <div style={{ padding: 16 }}>
          {/* Recent searches */}
          <div style={{ background: 'white', borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#333' }}>🕐 Recent Searches</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {recent.map(r => (
                <button key={r} onClick={() => setQuery(r)}
                  style={{ background: '#f5f5f5', border: 'none', borderRadius: 20, padding: '6px 14px', fontSize: 13, cursor: 'pointer', color: '#555' }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Trending */}
          <div style={{ background: 'white', borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#333' }}>🔥 Trending Now</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {trending.map(t => (
                <button key={t} onClick={() => setQuery(t)}
                  style={{ background: '#fff3ee', border: 'none', borderRadius: 20, padding: '6px 14px', fontSize: 13, cursor: 'pointer', color: '#ff6b35', fontWeight: 500 }}>
                  🔥 {t}
                </button>
              ))}
            </div>
          </div>

          {/* All categories */}
          <div style={{ background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#333' }}>📂 Browse Categories</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { name: 'Fruits', icon: '🍎', color: '#fff3ee' },
                { name: 'Vegetables', icon: '🥦', color: '#e8f5e9' },
                { name: 'Dairy', icon: '🥛', color: '#e3f2fd' },
                { name: 'Snacks', icon: '🍿', color: '#fff8e1' },
                { name: 'Beverages', icon: '🥤', color: '#f3e5f5' },
                { name: 'Meat', icon: '🥩', color: '#fce4ec' },
              ].map(cat => (
                <button key={cat.name} onClick={() => setQuery(cat.name)}
                  style={{ background: cat.color, border: 'none', borderRadius: 12, padding: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{cat.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search results */}
      {query.length > 0 && (
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 13, color: '#999', marginBottom: 12 }}>
            {results.length > 0 ? `${results.length} results for "${query}"` : `No results for "${query}"`}
          </div>
          {results.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>No products found</div>
              <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Try searching for something else</div>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {results.map(product => (
              <div key={product.id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ background: '#fff9f6', padding: '20px 16px', textAlign: 'center' }}>
                  <span style={{ fontSize: 48 }}>{product.icon}</span>
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 2 }}>{product.name}</div>
                  <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>{product.unit} • ⭐ {product.rating}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#333' }}>₹{product.price}</span>
                    {cart[product.id] ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ff6b35', borderRadius: 8, padding: '4px 8px' }}>
                        <button onClick={() => removeFromCart(product.id)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 16, cursor: 'pointer' }}>−</button>
                        <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{cart[product.id]}</span>
                        <button onClick={() => addToCart(product.id)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 16, cursor: 'pointer' }}>+</button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(product.id)} style={{ background: '#ff6b35', color: 'white', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cart bar */}
      {totalItems > 0 && (
        <div onClick={() => router.push('/cart')} style={{ position: 'fixed', bottom: 70, left: 16, right: 16, background: '#ff6b35', padding: '14px 20px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 4px 12px rgba(255,107,53,0.4)', cursor: 'pointer' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: '4px 10px' }}>
            <span style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>{totalItems}</span>
          </div>
          <span style={{ color: 'white', fontSize: 15, fontWeight: 600 }}>View Cart</span>
          <span style={{ color: 'white', fontSize: 15, fontWeight: 700, marginLeft: 'auto' }}>₹{totalPrice} →</span>
        </div>
      )}
    </div>
  );
}