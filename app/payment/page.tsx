'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const paymentMethods = [
  { id: 'upi', label: 'UPI Payment', icon: '📱', desc: 'Pay using any UPI app' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, Rupay' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks supported' },
  { id: 'wallet', label: 'Wallet', icon: '👛', desc: 'Paytm, PhonePe, Amazon Pay' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when order arrives' },
];

const upiApps = [
  { id: 'gpay', name: 'Google Pay', icon: '🟦' },
  { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
  { id: 'paytm', name: 'Paytm', icon: '🔵' },
  { id: 'bhim', name: 'BHIM', icon: '🟠' },
];

export default function PaymentPage() {
  const router = useRouter();
  const [method, setMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'payment' | 'processing' | 'success'>('payment');

  const orderTotal = 315;
  const savings = 35;

  const handlePay = () => {
    setLoading(true);
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setLoading(false);
    }, 3000);
  };

  if (step === 'processing') {
    return (
      <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#fff9f6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ fontSize: 64, marginBottom: 20, animation: 'spin 1s linear infinite' }}>⏳</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#333', marginBottom: 8 }}>Processing Payment...</div>
        <div style={{ fontSize: 14, color: '#999', marginBottom: 24 }}>Please do not close this page</div>
        <div style={{ background: 'white', borderRadius: 16, padding: 20, width: '100%', maxWidth: 340, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
            <span style={{ color: '#999' }}>Amount</span>
            <span style={{ fontWeight: 700, color: '#ff6b35' }}>₹{orderTotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: '#999' }}>Method</span>
            <span style={{ fontWeight: 500 }}>{paymentMethods.find(m => m.id === method)?.label}</span>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f0fdf4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>✅</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#2e7d32', marginBottom: 8 }}>Payment Successful!</div>
        <div style={{ fontSize: 14, color: '#999', marginBottom: 4 }}>₹{orderTotal} paid successfully</div>
        <div style={{ fontSize: 13, color: '#4CAF50', marginBottom: 24 }}>Transaction ID: TXN{Math.floor(Math.random() * 900000 + 100000)}</div>
        <div style={{ background: 'white', borderRadius: 16, padding: 20, width: '100%', maxWidth: 340, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {[
            { label: 'Amount Paid', value: `₹${orderTotal}` },
            { label: 'You Saved', value: `₹${savings} 🎉` },
            { label: 'Payment Method', value: paymentMethods.find(m => m.id === method)?.label },
            { label: 'Delivery ETA', value: '10 minutes 🛵' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: i < 3 ? '1px solid #f5f5f5' : 'none' }}>
              <span style={{ color: '#999' }}>{row.label}</span>
              <span style={{ fontWeight: 600, color: i === 1 ? '#4CAF50' : '#333' }}>{row.value}</span>
            </div>
          ))}
        </div>
        <button onClick={() => router.push('/tracking')} style={{ width: '100%', maxWidth: 340, background: '#ff6b35', color: 'white', border: 'none', borderRadius: 12, padding: '16px', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 12 }}>
          🛵 Track My Order
        </button>
        <button onClick={() => router.push('/orders')} style={{ width: '100%', maxWidth: 340, background: 'white', color: '#ff6b35', border: '1.5px solid #ff6b35', borderRadius: 12, padding: '16px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          📦 View Orders
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f5f5f5', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: '#ff6b35', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>💳</span>
          <span style={{ color: 'white', fontSize: 20, fontWeight: 600 }}>Payment</span>
        </div>
      </div>

      {/* Amount card */}
      <div style={{ background: 'white', margin: 16, borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, color: '#999' }}>Amount to Pay</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#ff6b35' }}>₹{orderTotal}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#4CAF50', fontWeight: 600 }}>You save ₹{savings}!</div>
            <div style={{ fontSize: 12, color: '#999', textDecoration: 'line-through' }}>₹{orderTotal + savings}</div>
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 12 }}>Select Payment Method</div>
        {paymentMethods.map(m => (
          <div
            key={m.id}
            onClick={() => setMethod(m.id)}
            style={{ background: 'white', borderRadius: 14, padding: '14px 16px', marginBottom: 10, border: `1.5px solid ${method === m.id ? '#ff6b35' : '#eee'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
          >
            <span style={{ fontSize: 26 }}>{m.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{m.label}</div>
              <div style={{ fontSize: 12, color: '#999' }}>{m.desc}</div>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${method === m.id ? '#ff6b35' : '#ddd'}`, background: method === m.id ? '#ff6b35' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {method === m.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
            </div>
          </div>
        ))}
      </div>

      {/* UPI details */}
      {method === 'upi' && (
        <div style={{ background: 'white', margin: '0 16px 16px', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Choose UPI App</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            {upiApps.map(app => (
              <div key={app.id} onClick={() => setSelectedUpiApp(app.id)}
                style={{ padding: '12px', borderRadius: 12, border: `1.5px solid ${selectedUpiApp === app.id ? '#ff6b35' : '#eee'}`, background: selectedUpiApp === app.id ? '#fff9f6' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>{app.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{app.name}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>Or enter UPI ID</div>
          <input
            value={upiId}
            onChange={e => setUpiId(e.target.value)}
            placeholder="yourname@upi"
            style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #eee', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      )}

      {/* Card details */}
      {method === 'card' && (
        <div style={{ background: 'white', margin: '0 16px 16px', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Card Details</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
              placeholder="Card Number" style={{ padding: '12px 14px', borderRadius: 12, border: '1.5px solid #eee', fontSize: 14, outline: 'none' }} />
            <input value={cardName} onChange={e => setCardName(e.target.value)}
              placeholder="Name on Card" style={{ padding: '12px 14px', borderRadius: 12, border: '1.5px solid #eee', fontSize: 14, outline: 'none' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input value={expiry} onChange={e => setExpiry(e.target.value)}
                placeholder="MM/YY" style={{ padding: '12px 14px', borderRadius: 12, border: '1.5px solid #eee', fontSize: 14, outline: 'none' }} />
              <input value={cvv} onChange={e => setCvv(e.target.value.slice(0, 3))}
                placeholder="CVV" type="password" style={{ padding: '12px 14px', borderRadius: 12, border: '1.5px solid #eee', fontSize: 14, outline: 'none' }} />
            </div>
          </div>
        </div>
      )}

      {/* Pay button */}
      <div style={{ position: 'fixed', bottom: 70, left: 0, right: 0, padding: '12px 16px', background: 'white', borderTop: '1px solid #eee' }}>
        <button
          onClick={handlePay}
          disabled={loading}
          style={{ width: '100%', background: '#ff6b35', color: 'white', border: 'none', borderRadius: 12, padding: '16px', fontSize: 16, fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>🔒 Pay Securely</span>
          <span>₹{orderTotal} →</span>
        </button>
      </div>
    </div>
  );
}