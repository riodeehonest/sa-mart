'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const orders = [
  {
    id: 'QM1234', date: 'Today, 10:30 AM', status: 'Delivered',
    items: [{ name: 'Fresh Apples', qty: 2, icon: '🍎' }, { name: 'Milk', qty: 1, icon: '🥛' }],
    total: 295, address: 'Lamphelpat, Imphal', deliveryTime: '9 mins'
  },
  {
    id: 'QM1233', date: 'Yesterday, 6:45 PM', status: 'Delivered',
    items: [{ name: 'Lays Chips', qty: 3, icon: '🍿' }, { name: 'Coca Cola', qty: 2, icon: '🥤' }],
    total: 140, address: 'Paona Bazar, Imphal', deliveryTime: '11 mins'
  },
  {
    id: 'QM1232', date: '19 May, 2:15 PM', status: 'Cancelled',
    items: [{ name: 'Chicken', qty: 1, icon: '🥩' }, { name: 'Bread', qty: 2, icon: '🍞' }],
    total: 250, address: 'Singjamei, Imphal', deliveryTime: '-'
  },
  {
    id: 'QM1231', date: '18 May, 9:00 AM', status: 'Delivered',
    items: [{ name: 'Bananas', qty: 1, icon: '🍌' }, { name: 'Butter', qty: 1, icon: '🧈' }, { name: 'Broccoli', qty: 2, icon: '🥦' }],
    total: 145, address: 'Lamphelpat, Imphal', deliveryTime: '8 mins'
  },
  {
    id: 'QM1230', date: '17 May, 7:30 PM', status: 'Delivered',
    items: [{ name: 'Orange Juice', qty: 2, icon: '🍊' }, { name: 'Spinach', qty: 1, icon: '🥬' }],
    total: 185, address: 'Paona Bazar, Imphal', deliveryTime: '12 mins'
  },
];

const statusColor = (status: string) => {
  if (status === 'Delivered') return { bg: '#e8f5e9', color: '#2e7d32' };
  if (status === 'Cancelled') return { bg: '#ffebee', color: '#c62828' };
  if (status === 'Processing') return { bg: '#fff3e0', color: '#e65100' };
  return { bg: '#e3f2fd', color: '#1565c0' };
};

export default function OrdersPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  const totalSpent = orders
    .filter(o => o.status === 'Delivered')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f5f5f5', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: '#ff6b35', padding: '14px 16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 24 }}>📦</span>
          <span style={{ color: 'white', fontSize: 20, fontWeight: 600 }}>My Orders</span>
          <span style={{ color: '#ffcba4', fontSize: 13, marginLeft: 'auto' }}>{orders.length} orders</span>
        </div>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: 'Total Orders', value: orders.length },
            { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length },
            { label: 'Total Spent', value: `₹${totalSpent}` },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '10px', textAlign: 'center' }}>
              <div style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>{s.value}</div>
              <div style={{ color: '#ffcba4', fontSize: 11 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ background: 'white', padding: '12px 16px', display: 'flex', gap: 8, overflowX: 'auto', borderBottom: '1px solid #eee' }}>
        {['All', 'Delivered', 'Cancelled'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
              background: filter === f ? '#ff6b35' : '#f5f5f5',
              color: filter === f ? 'white' : '#666',
              fontSize: 13, fontWeight: filter === f ? 600 : 400,
              whiteSpace: 'nowrap'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div style={{ padding: 16 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>No orders found</div>
          </div>
        )}
        {filtered.map(order => {
          const sc = statusColor(order.status);
          const isExpanded = expanded === order.id;
          return (
            <div key={order.id} style={{ background: 'white', borderRadius: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              {/* Order header */}
              <div
                onClick={() => setExpanded(isExpanded ? null : order.id)}
                style={{ padding: '14px 16px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#333' }}>#{order.id}</div>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600, background: sc.bg, color: sc.color }}>
                    {order.status}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#999', marginBottom: 2 }}>{order.date}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>
                      {order.items.map(i => i.icon).join(' ')} {order.items.length} items
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#ff6b35' }}>₹{order.total}</div>
                    <div style={{ fontSize: 11, color: '#999' }}>🕐 {order.deliveryTime}</div>
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid #f5f5f5', padding: '12px 16px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#333' }}>Order Items</div>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: i < order.items.length - 1 ? '1px solid #f9f9f9' : 'none' }}>
                      <span style={{ fontSize: 20 }}>{item.icon}</span>
                      <span style={{ fontSize: 13, flex: 1 }}>{item.name}</span>
                      <span style={{ fontSize: 12, color: '#999' }}>x{item.qty}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 10, fontSize: 12, color: '#999' }}>
                    📍 {order.address}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                    {order.status === 'Delivered' && (
                      <button
                        onClick={() => router.push('/products')}
                        style={{ background: '#fff3ee', color: '#ff6b35', border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                      >
                        🔄 Reorder
                      </button>
                    )}
                    <button
                      onClick={() => router.push('/tracking')}
                      style={{ background: '#ff6b35', color: 'white', border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >
                      📍 Track
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}