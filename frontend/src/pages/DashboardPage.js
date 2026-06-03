import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { messagesAPI } from '../services/api';
import { format } from 'date-fns';

const statIcons = {
  total: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  unread: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  today: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  week: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, messagesRes] = await Promise.all([
          messagesAPI.getStats(),
          messagesAPI.getAll({ limit: 5, sort: 'newest' }),
        ]);
        setStats(statsRes.data.stats);
        setRecent(messagesRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { title: 'Total Messages', key: 'total', color: '#2563eb', bgColor: '#dbeafe', icon: 'total', change: 'All time received' },
    { title: 'Unread', key: 'unread', color: '#d97706', bgColor: '#fef3c7', icon: 'unread', change: 'Needs attention' },
    { title: 'Today', key: 'today', color: '#059669', bgColor: '#d1fae5', icon: 'today', change: 'Received today' },
    { title: 'This Week', key: 'week', color: '#7c3aed', bgColor: '#ede9fe', icon: 'week', change: 'Last 7 days' },
  ];

  return (
    <div className="app-layout">
      <Sidebar unreadCount={stats?.unread || 0} />
      <main className="main-content">
        <Header />
        <div className="page-content">
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
            {statCards.map(({ title, key, color, bgColor, icon, change }) => (
              <StatCard
                key={key}
                title={title}
                value={stats?.[key]}
                color={color}
                bgColor={bgColor}
                icon={statIcons[icon]}
                change={change}
                loading={loading}
              />
            ))}
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Recent Messages</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Latest contact form submissions</p>
              </div>
              <button onClick={() => navigate('/messages')} className="btn btn-secondary btn-sm">
                View All →
              </button>
            </div>

            {loading ? (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <div className="spinner spinner-dark" style={{ margin: '0 auto' }} />
              </div>
            ) : recent.length === 0 ? (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <h3>No messages yet</h3>
                <p>Messages from your contact form will appear here.</p>
              </div>
            ) : (
              <div>
                {recent.map((msg) => (
                  <div key={msg._id}
                    onClick={() => navigate('/messages')}
                    style={{
                      padding: '16px 24px', borderBottom: '1px solid var(--border)',
                      display: 'flex', gap: 14, alignItems: 'flex-start',
                      cursor: 'pointer', transition: 'background 0.15s ease',
                      background: msg.isRead ? 'white' : 'rgba(37,99,235,0.02)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = msg.isRead ? 'white' : 'rgba(37,99,235,0.02)'}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                      background: `hsl(${msg.name.charCodeAt(0) * 5}, 55%, 85%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700,
                      color: `hsl(${msg.name.charCodeAt(0) * 5}, 55%, 35%)`,
                    }}>
                      {msg.name[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: msg.isRead ? 500 : 700, color: 'var(--text-primary)' }}>
                          {msg.name}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                          {format(new Date(msg.createdAt), 'MMM d')}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: msg.isRead ? 500 : 600, color: 'var(--text-primary)', marginTop: 1 }}>
                        {msg.subject}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {msg.message}
                      </div>
                    </div>
                    {!msg.isRead && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 6 }} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
