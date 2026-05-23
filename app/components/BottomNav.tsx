'use client';

import { useRouter, usePathname } from 'next/navigation';

const navItems = [
  { label: 'Home', icon: '🏠', path: '/' },
  { label: 'Products', icon: '🛒', path: '/products' },
  { label: 'Cart', icon: '🛍️', path: '/cart' },
  { label: 'Track', icon: '🛵', path: '/tracking' },
  { label: 'Login', icon: '👤', path: '/auth' },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'white', borderTop: '1px solid #eee',
      display: 'flex', justifyContent: 'space-around',
      padding: '8px 0 12px', zIndex: 1000,
      boxShadow: '0 -4px 12px rgba(0,0,0,0.08)'
    }}>
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 4, background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px 12px'
            }}
          >
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <span style={{
              fontSize: 10, fontWeight: isActive ? 600 : 400,
              color: isActive ? '#ff6b35' : '#999'
            }}>
              {item.label}
            </span>
            {isActive && (
              <div style={{
                width: 4, height: 4, borderRadius: '50%',
                background: '#ff6b35', marginTop: -2
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}