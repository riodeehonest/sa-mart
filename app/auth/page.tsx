'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (mode === 'signup' && !form.name) newErrors.name = 'Name is required';
    if (!form.phone) newErrors.phone = 'Phone number is required';
    else if (form.phone.length !== 10) newErrors.phone = 'Enter valid 10-digit number';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (mode === 'signup' && form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => router.push('/'), 2000);
    }, 1500);
  };

  if (success) {
    return (
      <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#fff9f6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#333', marginBottom: 8 }}>
          {mode === 'login' ? 'Welcome Back!' : 'Account Created!'}
        </div>
        <div style={{ fontSize: 14, color: '#999' }}>Redirecting to home...</div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#fff9f6' }}>
      {/* Header */}
      <div style={{ background: '#ff6b35', padding: '40px 24px 60px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🛒</div>
        <div style={{ color: 'white', fontSize: 24, fontWeight: 700 }}>SA mart</div>
        <div style={{ color: '#ffcba4', fontSize: 13, marginTop: 4 }}>Delivery in 10 minutes</div>
      </div>

      {/* Card */}
      <div style={{ background: 'white', borderRadius: '24px 24px 0 0', marginTop: -24, padding: '24px 20px', minHeight: '100vh' }}>

        {/* Toggle */}
        <div style={{ display: 'flex', background: '#f5f5f5', borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {(['login', 'signup'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setErrors({}); }}
              style={{
                flex: 1, padding: '10px', border: 'none', borderRadius: 10, cursor: 'pointer',
                background: mode === m ? '#ff6b35' : 'transparent',
                color: mode === m ? 'white' : '#999',
                fontWeight: mode === m ? 600 : 400, fontSize: 14
              }}
            >
              {m === 'login' ? '🔑 Login' : '✨ Sign Up'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {mode === 'signup' && (
            <div>
              <label style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>Full Name</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Enter your full name"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${errors.name ? '#ff4444' : '#eee'}`, fontSize: 14, marginTop: 6, outline: 'none', boxSizing: 'border-box' }}
              />
              {errors.name && <div style={{ fontSize: 11, color: '#ff4444', marginTop: 4 }}>{errors.name}</div>}
            </div>
          )}

          <div>
            <label style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>Phone Number</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <div style={{ background: '#f5f5f5', borderRadius: 12, padding: '12px 14px', fontSize: 14, color: '#333', whiteSpace: 'nowrap' }}>🇮🇳 +91</div>
              <input
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                placeholder="10-digit mobile number"
                type="tel"
                style={{ flex: 1, padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${errors.phone ? '#ff4444' : '#eee'}`, fontSize: 14, outline: 'none' }}
              />
            </div>
            {errors.phone && <div style={{ fontSize: 11, color: '#ff4444', marginTop: 4 }}>{errors.phone}</div>}
          </div>

          <div>
            <label style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>Password</label>
            <input
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Enter password"
              type="password"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${errors.password ? '#ff4444' : '#eee'}`, fontSize: 14, marginTop: 6, outline: 'none', boxSizing: 'border-box' }}
            />
            {errors.password && <div style={{ fontSize: 11, color: '#ff4444', marginTop: 4 }}>{errors.password}</div>}
          </div>

          {mode === 'signup' && (
            <div>
              <label style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>Confirm Password</label>
              <input
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Re-enter password"
                type="password"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${errors.confirmPassword ? '#ff4444' : '#eee'}`, fontSize: 14, marginTop: 6, outline: 'none', boxSizing: 'border-box' }}
              />
              {errors.confirmPassword && <div style={{ fontSize: 11, color: '#ff4444', marginTop: 4 }}>{errors.confirmPassword}</div>}
            </div>
          )}

          {mode === 'login' && (
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 13, color: '#ff6b35', cursor: 'pointer' }}>Forgot Password?</span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ background: loading ? '#ccc' : '#ff6b35', color: 'white', border: 'none', borderRadius: 12, padding: '16px', fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8 }}
          >
            {loading ? '⏳ Please wait...' : mode === 'login' ? '🔑 Login' : '✨ Create Account'}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#eee' }} />
            <span style={{ fontSize: 12, color: '#999' }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: '#eee' }} />
          </div>

          {/* Social login */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button style={{ background: 'white', border: '1.5px solid #eee', borderRadius: 12, padding: '12px', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span>🌐</span> Google
            </button>
            <button style={{ background: 'white', border: '1.5px solid #eee', borderRadius: 12, padding: '12px', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span>📱</span> OTP
            </button>
          </div>

          <div style={{ textAlign: 'center', fontSize: 13, color: '#999', marginTop: 8 }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <span onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErrors({}); }} style={{ color: '#ff6b35', fontWeight: 600, cursor: 'pointer' }}>
              {mode === 'login' ? 'Sign Up' : 'Login'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}