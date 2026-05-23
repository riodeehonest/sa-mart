'use client';

import { useState } from 'react';

const categories = [
  { id: 1, name: 'All', icon: '🛒' },
  { id: 2, name: 'Fruits', icon: '🍎' },
  { id: 3, name: 'Vegetables', icon: '🥦' },
  { id: 4, name: 'Dairy', icon: '🥛' },
  { id: 5, name: 'Snacks', icon: '🍿' },
  { id: 6, name: 'Beverages', icon: '🥤' },
  { id: 7, name: 'Bakery', icon: '🍞' },
  { id: 8, name: 'Meat', icon: '🥩' },
];

const products = [
  { id: 1, name: 'Fresh Apples', category: 'Fruits', price: 120, unit: '1 kg', icon: '🍎', rating: 4.5, discount: 10 },
  { id: 2, name: 'Bananas', category: 'Fruits', price: 40, unit: '6 pcs', icon: '🍌', rating: 4.2, discount: 0 },
  { id: 3, name: 'Broccoli', category: 'Vegetables', price: 60, unit: '500 g', icon: '🥦', rating: 4.0, discount: 15 },
  { id: 4, name: 'Tomatoes', category: 'Vegetables', price: 30, unit: '500 g', icon: '🍅', rating: 4.3, discount: 0 },
  { id: 5, name: 'Full Cream Milk', category: 'Dairy', price: 55, unit: '1 litre', icon: '🥛', rating: 4.7, discount: 5 },
  { id: 6, name: 'Butter', category: 'Dairy', price: 45, unit: '100 g', icon: '🧈', rating: 4.4, discount: 0 },
  { id: 7, name: 'Lays Chips', category: 'Snacks', price: 20, unit: '1 pack', icon: '🍿', rating: 4.6, discount: 0 },
  { id: 8, name: 'Coca Cola', category: 'Beverages', price: 40, unit: '500 ml', icon: '🥤', rating: 4.5, discount: 10 },
  { id: 9, name: 'Bread', category: 'Bakery', price: 35, unit: '1 loaf', icon: '🍞', rating: 4.3, discount: 0 },
  { id: 10, name: 'Chicken', category: 'Meat', price: 180, unit: '500 g', icon: '🥩', rating: 4.6, discount: 20 },
  { id: 11, name: 'Orange Juice', category: 'Beverages', price: 80, unit: '1 litre', icon: '🍊', rating: 4.4, discount: 0 },
  { id: 12, name: 'Spinach', category: 'Vegetables', price: 25, unit: '250 g', icon: '🥬', rating: 4.1, discount: 0 },
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [search, setSearch] = useState('');

  const filtered = products.filter(p => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (id: number) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id: number) => setCart(prev => {
    const updated = { ...prev };
    if (updated[id] > 1) updated[id]--;
    else delete updated[id];
    return updated;
  });

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find(p => p.id === Number(id));
    return sum + (product ? product.price * qty : 0);
  }, 0);

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f5f5f5', paddingBottom: 80 }}>

      {/* Sticky top section */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        {/* Header */}
        <div style={{ background: '#ff6b35', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 22 }}>🛒</span>
          <span style={{ color: 'white', fontSize: 18, fontWeight: 600 }}>SA mart</span>
          <div style={{ marginLeft: 'auto', background: 'white', borderRadius: 20, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13 }}>🛵</span>
            <span style={{ fontSize: 12, color: '#ff6b35', fontWeight: 600 }}>10 mins</span>
          </div>
        </div>

        {/* Sticky Search bar */}
        <div style={{ padding: '10px 16px', background: 'white' }}>
          <div style={{ background: '#f5f5f5', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              style={{ border: 'none', background: 'none', outline: 'none', fontSize: 14, flex: 1 }}
            />
            {search.length > 0 && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: '#999' }}>✕</button>
            )}
          </div>
        </div>

        {/* Sticky Categories */}
        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '0 0 10px', background: 'white' }}>
          <div style={{ display: 'inline-flex', gap: 8, padding: '0 16px' }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                style={{
                  display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '6px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: selectedCategory === cat.name ? '#fff3ee' : '#f5f5f5',
                  color: selectedCategory === cat.name ? '#ff6b35' : '#666',
                  fontWeight: selectedCategory === cat.name ? 600 : 400,
                  outline: selectedCategory === cat.name ? '1.5px solid #ff6b35' : 'none',
                  minWidth: 56
                }}
              >
                <span style={{ fontSize: 18 }}>{cat.icon}</span>
                <span style={{ fontSize: 10 }}>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 13, color: '#999', marginBottom: 12 }}>
          {search ? `${filtered.length} results for "${search}"` : `${filtered.length} products`}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>No products found</div>
            <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Try a different search</div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {filtered.map(product => (
            <div key={product.id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ background: '#fff9f6', padding: '20px 16px', textAlign: 'center', position: 'relative' }}>
                {product.discount > 0 && (
                  <span style={{ position: 'absolute', top: 8, left: 8, background: '#ff6b35', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6 }}>
                    {product.discount}% OFF
                  </span>
                )}
                <span style={{ fontSize: 48 }}>{product.icon}</span>
              </div>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 2 }}>{product.name}</div>
                <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>{product.unit} • ⭐ {product.rating}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#333' }}>₹{product.price}</span>
                    {product.discount > 0 && (
                      <span style={{ fontSize: 11, color: '#999', textDecoration: 'line-through', marginLeft: 4 }}>
                        ₹{Math.round(product.price / (1 - product.discount / 100))}
                      </span>
                    )}
                  </div>
                  {cart[product.id] ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ff6b35', borderRadius: 8, padding: '4px 8px' }}>
                      <button onClick={() => removeFromCart(product.id)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 16, cursor: 'pointer', lineHeight: 1 }}>−</button>
                      <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{cart[product.id]}</span>
                      <button onClick={() => addToCart(product.id)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 16, cursor: 'pointer', lineHeight: 1 }}>+</button>
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

      {/* Cart bar */}
      {totalItems > 0 && (
        <div style={{ position: 'fixed', bottom: 70, left: 0, right: 0, background: '#ff6b35', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 -4px 12px rgba(0,0,0,0.15)' }}>
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