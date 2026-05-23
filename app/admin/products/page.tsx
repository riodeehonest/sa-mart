'use client';

import { useState, useRef } from 'react';

const initialProducts = [
  { id: 1, name: 'Fresh Apples', category: 'Fruits', price: 120, unit: '1 kg', icon: '🍎', image: '', rating: 4.5, discount: 10, stock: 50, active: true },
  { id: 2, name: 'Bananas', category: 'Fruits', price: 40, unit: '6 pcs', icon: '🍌', image: '', rating: 4.2, discount: 0, stock: 80, active: true },
  { id: 3, name: 'Broccoli', category: 'Vegetables', price: 60, unit: '500 g', icon: '🥦', image: '', rating: 4.0, discount: 15, stock: 30, active: true },
  { id: 4, name: 'Full Cream Milk', category: 'Dairy', price: 55, unit: '1 litre', icon: '🥛', image: '', rating: 4.7, discount: 5, stock: 100, active: true },
  { id: 5, name: 'Lays Chips', category: 'Snacks', price: 20, unit: '1 pack', icon: '🍿', image: '', rating: 4.6, discount: 0, stock: 200, active: true },
  { id: 6, name: 'Chicken', category: 'Meat', price: 180, unit: '500 g', icon: '🥩', image: '', rating: 4.6, discount: 20, stock: 25, active: false },
];

const categories = ['Fruits', 'Vegetables', 'Dairy', 'Snacks', 'Beverages', 'Bakery', 'Meat'];
const icons = ['🍎','🍌','🥦','🍅','🥛','🧈','🍿','🥤','🍞','🥩','🍊','🥬','🧀','🥚','🍇'];

type Product = {
  id: number; name: string; category: string; price: number;
  unit: string; icon: string; image: string; rating: number;
  discount: number; stock: number; active: boolean;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [newProduct, setNewProduct] = useState({
    name: '', category: 'Fruits', price: '', unit: '',
    icon: '🍎', image: '', discount: '', stock: ''
  });
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (isEdit) {
        setEditForm(prev => ({ ...prev, image: reader.result as string }));
      } else {
        setNewProduct(prev => ({ ...prev, image: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
    setShowAddForm(false);
  };

  const saveEdit = () => {
    setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...editForm } as Product : p));
    setEditingId(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleActive = (id: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    const product: Product = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      unit: newProduct.unit || 'per unit',
      icon: newProduct.icon,
      image: newProduct.image,
      rating: 4.0,
      discount: Number(newProduct.discount) || 0,
      stock: Number(newProduct.stock) || 0,
      active: true,
    };
    setProducts(prev => [...prev, product]);
    setNewProduct({ name: '', category: 'Fruits', price: '', unit: '', icon: '🍎', image: '', discount: '', stock: '' });
    setShowAddForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f0f2f5', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: '#1a1a2e', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 22 }}>📦</span>
        <span style={{ color: 'white', fontSize: 18, fontWeight: 600 }}>Manage Products</span>
        <span style={{ color: '#aaa', fontSize: 12, marginLeft: 'auto' }}>{products.length} products</span>
      </div>

      {/* Saved toast */}
      {saved && (
        <div style={{ background: '#4CAF50', color: 'white', padding: '10px 16px', textAlign: 'center', fontSize: 14, fontWeight: 500 }}>
          ✅ Changes saved successfully!
        </div>
      )}

      {/* Search + Add */}
      <div style={{ padding: '12px 16px', display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, background: 'white', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
          <span>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            style={{ border: 'none', outline: 'none', fontSize: 14, flex: 1 }} />
        </div>
        <button onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); }}
          style={{ background: '#ff6b35', color: 'white', border: 'none', borderRadius: 12, padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          + Add
        </button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div style={{ background: 'white', margin: '0 16px 16px', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, color: '#333' }}>➕ Add New Product</div>

          {/* Image upload */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8, fontWeight: 500 }}>Product Image</div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={e => handleImageUpload(e)}
              style={{ display: 'none' }} />

            {newProduct.image ? (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img src={newProduct.image} alt="product"
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 12, border: '2px solid #ff6b35' }} />
                <button onClick={() => setNewProduct(prev => ({ ...prev, image: '' }))}
                  style={{ position: 'absolute', top: -8, right: -8, background: '#ff4444', color: 'white', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: 12 }}>
                  ✕
                </button>
              </div>
            ) : (
              <button onClick={() => fileInputRef.current?.click()}
                style={{ width: '100%', padding: '20px', borderRadius: 12, border: '2px dashed #ff6b35', background: '#fff9f6', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 32 }}>📸</span>
                <span style={{ fontSize: 13, color: '#ff6b35', fontWeight: 600 }}>Tap to upload from gallery</span>
                <span style={{ fontSize: 11, color: '#999' }}>JPG, PNG supported</span>
              </button>
            )}
          </div>

          {/* Icon picker (fallback) */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Or pick an emoji icon</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {icons.map(icon => (
                <button key={icon} onClick={() => setNewProduct({ ...newProduct, icon })}
                  style={{ fontSize: 20, padding: '6px', borderRadius: 8, border: `2px solid ${newProduct.icon === icon ? '#ff6b35' : '#eee'}`, background: newProduct.icon === icon ? '#fff3ee' : 'white', cursor: 'pointer' }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="Product Name *" style={{ padding: '10px 12px', borderRadius: 10, border: '1.5px solid #eee', fontSize: 14, outline: 'none' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                placeholder="Price ₹ *" type="number" style={{ padding: '10px 12px', borderRadius: 10, border: '1.5px solid #eee', fontSize: 14, outline: 'none' }} />
              <input value={newProduct.unit} onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })}
                placeholder="Unit (e.g. 1 kg)" style={{ padding: '10px 12px', borderRadius: 10, border: '1.5px solid #eee', fontSize: 14, outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input value={newProduct.discount} onChange={e => setNewProduct({ ...newProduct, discount: e.target.value })}
                placeholder="Discount %" type="number" style={{ padding: '10px 12px', borderRadius: 10, border: '1.5px solid #eee', fontSize: 14, outline: 'none' }} />
              <input value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                placeholder="Stock quantity" type="number" style={{ padding: '10px 12px', borderRadius: 10, border: '1.5px solid #eee', fontSize: 14, outline: 'none' }} />
            </div>
            <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
              style={{ padding: '10px 12px', borderRadius: 10, border: '1.5px solid #eee', fontSize: 14, outline: 'none' }}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <button onClick={addProduct}
              style={{ background: '#ff6b35', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              ✅ Add Product
            </button>
          </div>
        </div>
      )}

      {/* Products list */}
      <div style={{ padding: '0 16px' }}>
        {filtered.map(product => (
          <div key={product.id} style={{ background: 'white', borderRadius: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Show uploaded image or emoji */}
              {product.image ? (
                <img src={product.image} alt={product.name}
                  style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 10 }} />
              ) : (
                <span style={{ fontSize: 36 }}>{product.icon}</span>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: product.active ? '#333' : '#bbb' }}>{product.name}</div>
                <div style={{ fontSize: 12, color: '#999' }}>{product.category} • {product.unit}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#ff6b35' }}>₹{product.price}</span>
                  {product.discount > 0 && <span style={{ fontSize: 11, background: '#fff3ee', color: '#ff6b35', padding: '1px 6px', borderRadius: 6, fontWeight: 600 }}>{product.discount}% OFF</span>}
                  <span style={{ fontSize: 11, color: '#999' }}>Stock: {product.stock}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                <button onClick={() => toggleActive(product.id)}
                  style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, background: product.active ? '#e8f5e9' : '#ffebee', color: product.active ? '#2e7d32' : '#c62828' }}>
                  {product.active ? '✅ Active' : '❌ Hidden'}
                </button>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => startEdit(product)}
                    style={{ background: '#e3f2fd', color: '#1565c0', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => deleteProduct(product.id)}
                    style={{ background: '#ffebee', color: '#c62828', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
                    🗑️
                  </button>
                </div>
              </div>
            </div>

            {/* Edit form */}
            {editingId === product.id && (
              <div style={{ borderTop: '1px solid #f5f5f5', padding: '14px 16px', background: '#fafafa' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#333' }}>✏️ Edit Product</div>

                {/* Edit image upload */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Product Image</div>
                  <input ref={editFileInputRef} type="file" accept="image/*"
                    onChange={e => handleImageUpload(e, true)} style={{ display: 'none' }} />
                  {editForm.image ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={editForm.image} alt="product"
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 10, border: '2px solid #ff6b35' }} />
                      <button onClick={() => editFileInputRef.current?.click()}
                        style={{ background: '#fff3ee', color: '#ff6b35', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
                        📸 Change Image
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => editFileInputRef.current?.click()}
                      style={{ width: '100%', padding: '14px', borderRadius: 10, border: '2px dashed #ff6b35', background: '#fff9f6', cursor: 'pointer', fontSize: 13, color: '#ff6b35', fontWeight: 500 }}>
                      📸 Upload Image from Gallery
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Product Name" style={{ padding: '10px 12px', borderRadius: 10, border: '1.5px solid #eee', fontSize: 14, outline: 'none' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>Price (₹)</div>
                      <input value={editForm.price || ''} onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })}
                        type="number" style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #ff6b35', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>Discount (%)</div>
                      <input value={editForm.discount || ''} onChange={e => setEditForm({ ...editForm, discount: Number(e.target.value) })}
                        type="number" style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #eee', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>Stock</div>
                      <input value={editForm.stock || ''} onChange={e => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                        type="number" style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #eee', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>Unit</div>
                      <input value={editForm.unit || ''} onChange={e => setEditForm({ ...editForm, unit: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #eee', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button onClick={saveEdit}
                      style={{ background: '#ff6b35', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                      💾 Save
                    </button>
                    <button onClick={() => setEditingId(null)}
                      style={{ background: '#f5f5f5', color: '#666', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}