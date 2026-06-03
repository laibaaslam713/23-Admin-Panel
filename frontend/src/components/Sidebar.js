import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  messages: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  contact: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 9.94a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.97a16 16 0 0 0 7.09 7.09l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 23 17z"/>
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  menu: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  close: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/messages', label: 'Messages', icon: 'messages' },
  { to: '/contact', label: 'Contact Form', icon: 'contact' },
];

const Sidebar = ({ unreadCount = 0 }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>AdminHub</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Message Center</div>
          </div>
        </div>
      </div>

     
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', padding: '0 12px 8px', textTransform: 'uppercase' }}>
          Navigation
        </div>
        {navItems.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 8, marginBottom: 2,
              fontWeight: 600, fontSize: 14, textDecoration: 'none',
              transition: 'all 0.2s ease',
              background: isActive ? 'rgba(37,99,235,0.3)' : 'transparent',
              color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
              borderLeft: isActive ? '3px solid #2563eb' : '3px solid transparent',
            })}
          >
            {icons[icon]}
            <span style={{ flex: 1 }}>{label}</span>
            {icon === 'messages' && unreadCount > 0 && (
              <span style={{
                background: '#ef4444', color: 'white', fontSize: 11, fontWeight: 700,
                padding: '1px 7px', borderRadius: 999, minWidth: 20, textAlign: 'center',
              }}>{unreadCount}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
          borderRadius: 8, marginBottom: 4, background: 'rgba(255,255,255,0.04)',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0,
          }}>
            {admin?.username?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {admin?.username}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>
              {admin?.role}
            </div>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 12px',
          borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer',
          color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font)',
          transition: 'all 0.2s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#fca5a5'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >
          {icons.logout} Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
     
      <aside style={{
        width: 'var(--sidebar-width)', background: 'var(--bg-sidebar)',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
        overflow: 'hidden auto',
        display: window.innerWidth <= 768 ? 'none' : 'block',
      }} className="desktop-sidebar">
        <SidebarContent />
      </aside>

      
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          display: 'none', position: 'fixed', top: 12, left: 12, zIndex: 300,
          background: 'var(--bg-sidebar)', color: 'white', border: 'none',
          borderRadius: 8, padding: 10, cursor: 'pointer',
        }}
        className="mobile-menu-btn"
      >
        {mobileOpen ? icons.close : icons.menu}
      </button>

      
      {mobileOpen && (
        <>
          <div onClick={() => setMobileOpen(false)} style={{
            display: 'none', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 199,
          }} className="mobile-overlay" />
          <aside style={{
            display: 'none', width: 260, background: 'var(--bg-sidebar)',
            position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 200,
            overflow: 'hidden auto', animation: 'slideIn 0.25s ease',
          }} className="mobile-sidebar">
            <SidebarContent />
          </aside>
        </>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-overlay { display: block !important; }
          .mobile-sidebar { display: block !important; }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
