import React, { useEffect } from 'react';
import { format } from 'date-fns';

const MessageModal = ({ message, onClose, onToggleRead, onDelete }) => {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)',
      }} />

      <div style={{
        position: 'relative', width: '100%', maxWidth: 600,
        background: 'white', borderRadius: 16, boxShadow: 'var(--shadow-lg)',
        animation: 'fadeIn 0.2s ease',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                Message
              </span>
              {!message.isRead && (
                <span className="badge badge-primary" style={{ fontSize: 10 }}>Unread</span>
              )}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {message.subject}
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: 'var(--bg)', border: 'none', borderRadius: 8,
            width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={{
          padding: '16px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', flexWrap: 'wrap', gap: 24, background: '#f8fafc',
        }}>
          {[
            { label: 'From', value: message.name },
            { label: 'Email', value: message.email, mono: true },
            { label: 'Date', value: format(new Date(message.createdAt), 'MMM d, yyyy · h:mm a') },
          ].map(({ label, value, mono }) => (
            <div key={label}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                {label}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: mono ? 'var(--font-mono)' : 'var(--font)' }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '24px', flex: 1, overflow: 'auto' }}>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
            {message.message}
          </p>
        </div>

        
        <div style={{
          padding: '16px 24px', borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }}>
          <button onClick={() => { onDelete(message._id); onClose(); }}
            className="btn btn-danger btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            Delete
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => onToggleRead(message._id, !message.isRead)}
              className="btn btn-secondary btn-sm">
              {message.isRead ? 'Mark as Unread' : 'Mark as Read'}
            </button>
            <a href={`mailto:${message.email}?subject=Re: ${message.subject}`}
              className="btn btn-primary btn-sm" style={{ color: 'white' }}>
              Reply by Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
