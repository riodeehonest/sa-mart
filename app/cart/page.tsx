'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const initialCart = [
  { id: 1, name: 'Fresh Apples', price: 120, unit: '1 kg', icon: '🍎', qty: 2 },
  { id: 2, name: 'Full Cream Milk', price: 55, unit: '1 litre', icon: '🥛', qty: 1 },
  { id: 3, name: 'Lays Chips', price: 20, unit: '1 pack', icon: '🍿', qty: 3 },
];

const addresses = [
  { id: 1, label: '🏠 Home', address: 'Lamphelpat, Imphal West, Manipur' },
  { id: 2, label: '🏢 Work', address: 'Paona Bazar, Imphal, Manipur' },
];

type CartItem = { id: number; name: string; price: number; unit: string; icon: string; qty: number };

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [step, setStep] = useState('cart');
  const [loading, setLoading] = useState(false);

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = subtotal > 200 ? 0 : 20;
  const total = subtotal + deliveryFee;

  const placeOrder = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🎉</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#333', marginBottom: 8 }}>Order Placed!</div>
        <div style={{ fontSize: 14, color: '#999', marginBottom: 4 }}>Order #SA{Math.floor(Math.random() * 9000 + 1000)}</div>
        <div style={{ fontSize: 14, color: '#ff6b35', fontWeight: 600, marginBottom: 24 }}>Arriving in 10 minutes 🛵</div>
        <div style={{ background: 'white', borderRadius: 16, padding: 20, width: '100%', maxWidth: 340, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 13, color: '#999', marginBottom: 8 }}>Order Summary</div>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
              <span>{item.icon} {item.name} x{item.qty}</span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #eee', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
        <button onClick={() => router.push('/tracking')}
          style={{ background: '#ff6b35', color: 'white', border: 'none', borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 12, width: '100%', maxWidth: 340 }}>
          🛵 Track My Order
        </button>
        <button onClick={() => router.push('/products')}
          style={{ background: 'white', color: '#ff6b35', border: '1.5px solid #ff6b35', borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%', maxWidth: 340 }}>
          🛒 Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f5f5f5', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: '#ff6b35', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 24 }}>🛒</span>
        <span style={{ color: 'white', fontSize: 20, fontWeight: 600 }}>
          {step === 'cart' ? 'My Cart' : 'Checkout'}
        </span>
        <span style={{ color: '#ffcba4', fontSize: 13, marginLeft: 'auto' }}>{cart.length} items</span>
      </div>

      {/* Steps indicator */}
      <div style={{ background: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #eee' }}>
        {['Cart', 'Checkout', 'Done'].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 600,
              background: (step === 'cart' && i === 0) || (step === 'checkout' && i === 1) || (step === 'success' && i === 2) ? '#ff6b35' : '#eee',
              color: (step === 'cart' && i === 0) || (step === 'checkout' && i === 1) ? 'white' : '#999'
            }}>{i + 1}</div>
            <span style={{ fontSize: 12, color: '#666' }}>{s}</span>
            {i < 2 && <div style={{ width: 20, height: 1, background: '#eee' }} />}
          </div>
        ))}
      </div>

      {step === 'cart' && (
        <>
          <div style={{ padding: 16 }}>
            {cart.map(item => (
              <div key={item.id} style={{ background: 'white', borderRadius: 16, padding: 14, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 36 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: '#999' }}>{item.unit}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#ff6b35', marginTop: 4 }}>₹{item.price * item.qty}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5f5f5', borderRadius: 8, padding: '4px 8px' }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#ff6b35' }}>−</button>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#ff6b35' }}>+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', fontSize: 11, color: '#ff4444', cursor: 'pointer' }}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: 'white', margin: '0 16px 16px', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Bill Summary</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', marginBottom: 8 }}>
              <span>Subtotal</span><span>₹{subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', marginBottom: 8 }}>
              <span>Delivery Fee</span>
              <span style={{ color: deliveryFee === 0 ? '#4CAF50' : '#333' }}>{deliveryFee === 0 ? 'FREE 🎉' : `₹${deliveryFee}`}</span>
            </div>
            <div style={{ borderTop: '1px solid #eee', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700 }}>
              <span>Total</span><span style={{ color: '#ff6b35' }}>₹{total}</span>
            </div>
            {subtotal < 200 && (
              <div style={{ background: '#fff3ee', borderRadius: 8, padding: '8px 12px', marginTop: 10, fontSize: 12, color: '#ff6b35' }}>
                Add ₹{200 - subtotal} more for FREE delivery! 🎁
              </div>
            )}
          </div>
        </>
      )}

      {step === 'checkout' && (
        <div style={{ padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Deliver to</div>
            {addresses.map(addr => (
              <div key={addr.id} onClick={() => setSelectedAddress(addr.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 12, marginBottom: 8, border: `1.5px solid ${selectedAddress === addr.id ? '#ff6b35' : '#eee'}`, cursor: 'pointer' }}>
                <span style={{ fontSize: 20 }}>{addr.label.split(' ')[0]}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{addr.label.split(' ').slice(1).join(' ')}</div>
                  <div style={{ fontSize: 12, color: '#999' }}>{addr.address}</div>
                </div>
                {selectedAddress === addr.id && <span style={{ marginLeft: 'auto', color: '#ff6b35' }}>✓</span>}
              </div>
            ))}
          </div>
          <div style={{ background: 'white', borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Payment Method</div>
            {[
              { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
              { id: 'upi', label: 'UPI Payment', icon: '📱' },
            ].map(method => (
              <div key={method.id} onClick={() => setPaymentMethod(method.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 12, marginBottom: 8, border: `1.5px solid ${paymentMethod === method.id ? '#ff6b35' : '#eee'}`, cursor: 'pointer' }}>
                <span style={{ fontSize: 22 }}>{method.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{method.label}</span>
                {paymentMethod === method.id && <span style={{ marginLeft: 'auto', color: '#ff6b35' }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 70, left: 0, right: 0, padding: '12px 16px', background: 'white', borderTop: '1px solid #eee' }}>
        {step === 'cart' ? (
          <button onClick={() => setStep('checkout')} disabled={cart.length === 0}
            style={{ width: '100%', background: cart.length === 0 ? '#ccc' : '#ff6b35', color: 'white', border: 'none', borderRadius: 12, padding: '16px', fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Proceed to Checkout</span><span>₹{total} →</span>
          </button>
        ) : (
          <button onClick={placeOrder} disabled={loading}
            style={{ width: '100%', background: loading ? '#ccc' : '#ff6b35', color: 'white', border: 'none', borderRadius: 12, padding: '16px', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
            {loading ? '⏳ Placing Order...' : `Place Order • ₹${total}`}
          </button>
        )}
      </div>
    </div>
  );
}