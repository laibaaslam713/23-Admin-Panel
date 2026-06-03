import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MessageRow from '../components/MessageRow';
import MessageModal from '../components/MessageModal';
import { messagesAPI } from '../services/api';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [viewMessage, setViewMessage] = useState(null);
  const [filters, setFilters] = useState({ search: '', filter: 'all', sort: 'newest', page: 1 });
  const [searchInput, setSearchInput] = useState('');

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await messagesAPI.getAll(filters);
      setMessages(data.data);
      setPagination(data.pagination);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  useEffect(() => {
    const t = setTimeout(() => {
      setFilters(f => ({ ...f, search: searchInput, page: 1 }));
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleToggleRead = async (id, isRead) => {
    try {
      await messagesAPI.markRead(id, isRead);
      setMessages(msgs => msgs.map(m => m._id === id ? { ...m, isRead } : m));
      setUnreadCount(c => isRead ? Math.max(0, c - 1) : c + 1);
      if (viewMessage?._id === id) setViewMessage(v => ({ ...v, isRead }));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await messagesAPI.delete(id);
      setMessages(msgs => msgs.filter(m => m._id !== id));
      setPagination(p => ({ ...p, total: p.total - 1 }));
      setSelected(s => s.filter(sid => sid !== id));
    } catch (err) { console.error(err); }
  };

  const handleSelectAll = () => {
    setSelected(selected.length === messages.length ? [] : messages.map(m => m._id));
  };

  const handleBulkRead = async (isRead) => {
    await Promise.all(selected.map(id => messagesAPI.markRead(id, isRead)));
    setMessages(msgs => msgs.map(m => selected.includes(m._id) ? { ...m, isRead } : m));
    setSelected([]);
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selected.length} message(s)?`)) return;
    await Promise.all(selected.map(id => messagesAPI.delete(id)));
    setMessages(msgs => msgs.filter(m => !selected.includes(m._id)));
    setSelected([]);
  };

  const filterTabs = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
  ];

  return (
    <div className="app-layout">
      <Sidebar unreadCount={unreadCount} />
      <main className="main-content">
        <Header title="Messages" subtitle={`${pagination.total} total · ${unreadCount} unread`} />
        <div className="page-content">
          <div className="card" style={{ overflow: 'hidden' }}>
            
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
             
              <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
                <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
                  width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" placeholder="Search messages…" value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  style={{ padding: '8px 12px 8px 36px', border: '1.5px solid var(--border)', borderRadius: 8, fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-primary)', background: 'white', width: '100%', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 8, padding: 3, gap: 2 }}>
                {filterTabs.map(tab => (
                  <button key={tab.value} onClick={() => setFilters(f => ({ ...f, filter: tab.value, page: 1 }))}
                    style={{
                      padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: 'var(--font)',
                      fontSize: 12, fontWeight: 600, transition: 'all 0.15s ease',
                      background: filters.filter === tab.value ? 'white' : 'transparent',
                      color: filters.filter === tab.value ? 'var(--text-primary)' : 'var(--text-muted)',
                      boxShadow: filters.filter === tab.value ? 'var(--shadow-sm)' : 'none',
                    }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              
              <select value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
                style={{ padding: '7px 10px', border: '1.5px solid var(--border)', borderRadius: 8, fontFamily: 'var(--font)', fontSize: 13, color: 'var(--text-primary)', background: 'white', cursor: 'pointer', outline: 'none' }}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>

            
            {selected.length > 0 && (
              <div style={{ padding: '10px 20px', background: '#eff6ff', borderBottom: '1px solid #bfdbfe', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
                  {selected.length} selected
                </span>
                <button onClick={() => handleBulkRead(true)} className="btn btn-ghost btn-sm" style={{ fontSize: 12, color: 'var(--success)' }}>
                  Mark all read
                </button>
                <button onClick={() => handleBulkRead(false)} className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>
                  Mark all unread
                </button>
                <button onClick={handleBulkDelete} className="btn btn-ghost btn-sm" style={{ fontSize: 12, color: 'var(--danger)' }}>
                  Delete selected
                </button>
                <button onClick={() => setSelected([])} className="btn btn-ghost btn-sm" style={{ fontSize: 12, marginLeft: 'auto' }}>
                  Clear selection
                </button>
              </div>
            )}

            {loading ? (
              <div style={{ padding: 60, textAlign: 'center' }}>
                <div className="spinner spinner-dark" style={{ margin: '0 auto 12px' }} />
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading messages…</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="empty-state">
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <h3>No messages found</h3>
                <p>Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '10px 16px', width: 40 }}>
                        <input type="checkbox"
                          checked={selected.length === messages.length && messages.length > 0}
                          onChange={handleSelectAll}
                          style={{ width: 15, height: 15, accentColor: 'var(--primary)', cursor: 'pointer' }} />
                      </th>
                      <th style={{ width: 8 }} />
                      {['Sender', 'Subject & Preview', 'Date', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map(msg => (
                      <MessageRow
                        key={msg._id}
                        message={msg}
                        selected={selected.includes(msg._id)}
                        onSelect={(id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])}
                        onView={setViewMessage}
                        onToggleRead={handleToggleRead}
                        onDelete={handleDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {pagination.pages > 1 && (
              <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  Page {pagination.page} of {pagination.pages} · {pagination.total} messages
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setFilters(f => ({ ...f, page: p }))}
                      className="btn btn-sm"
                      style={{
                        minWidth: 34, justifyContent: 'center', padding: '5px 10px',
                        background: filters.page === p ? 'var(--primary)' : 'white',
                        color: filters.page === p ? 'white' : 'var(--text-secondary)',
                        border: `1px solid ${filters.page === p ? 'var(--primary)' : 'var(--border)'}`,
                        borderRadius: 6, fontSize: 13,
                      }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {viewMessage && (
        <MessageModal
          message={viewMessage}
          onClose={() => setViewMessage(null)}
          onToggleRead={handleToggleRead}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default MessagesPage;
