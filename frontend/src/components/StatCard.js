import React from 'react';

const StatCard = ({ title, value, icon, color = '#2563eb', bgColor = '#dbeafe', change, loading }) => {
  if (loading) {
    return (
      <div className="card" style={{ padding: 24 }}>
        <div style={{ background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200px 100%', animation: 'shimmer 1.5s infinite', borderRadius: 8, height: 80 }} />
      </div>
    );
  }

  return (
    <div className="card fade-in" style={{
      padding: 24, transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
          {title}
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: color,
        }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value ?? '—'}
      </div>
      {change !== undefined && (
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
          {change}
        </div>
      )}
    </div>
  );
};

export default StatCard;
