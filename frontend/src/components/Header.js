import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = ({ title, subtitle }) => {
  const { admin } = useAuth();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <header style={{
      position: 'fixed', top: 0, right: 0,
      left: 'var(--sidebar-width)',
      height: 'var(--header-height)',
      background: 'rgba(248,250,252,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 32px 0 32px',
      zIndex: 90, gap: 16,
    }}>
      <div style={{ flex: 1 }}>
        {title ? (
          <>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {title}
            </h1>
            {subtitle && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 1 }}>{subtitle}</p>}
          </>
        ) : (
          <>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {greeting}, {admin?.username}! 👋
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 1 }}>
              {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
          borderRadius: 999, background: 'var(--primary-light)',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>Online</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          header { left: 0 !important; padding: 0 16px 0 56px !important; }
          header h1 { font-size: 15px !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;
