import React from 'react';
import { format } from 'date-fns';

const MessageRow = ({ message, onToggleRead, onDelete, onView, selected, onSelect }) => {
  const date = new Date(message.createdAt);
  const isToday = new Date().toDateString() === date.toDateString();
  const timeStr = isToday
    ? format(date, 'h:mm a')
    : format(date, 'MMM d, yyyy');

  return (
    <tr style={{
      background: message.isRead ? 'white' : 'rgba(37,99,235,0.03)',
      borderBottom: '1px solid var(--border)',
      transition: 'background 0.15s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
      onMouseLeave={e => e.currentTarget.style.background = message.isRead ? 'white' : 'rgba(37,99,235,0.03)'}
    >
      <td style={{ padding: '12px 16px', width: 40 }}>
        <input type="checkbox" checked={selected} onChange={() => onSelect(message._id)}
          style={{ width: 15, height: 15, accentColor: 'var(--primary)', cursor: 'pointer' }} />
      </td>
      <td style={{ padding: '12px 8px', width: 8 }}>
        {!message.isRead && (
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)' }} />
        )}
      </td>
      <td style={{ padding: '12px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: `hsl(${message.name.charCodeAt(0) * 5}, 60%, 85%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700,
            color: `hsl(${message.name.charCodeAt(0) * 5}, 60%, 35%)`,
          }}>
            {message.name[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: message.isRead ? 500 : 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              {message.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {message.email}
            </div>
          </div>
        </div>
      </td>
      <td style={{ padding: '12px 12px', maxWidth: 260 }}>
        <div style={{ fontSize: 13, fontWeight: message.isRead ? 500 : 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {message.subject}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {message.message}
        </div>
      </td>
      <td style={{ padding: '12px 12px', whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {timeStr}
        </span>
      </td>
      <td style={{ padding: '12px 12px 12px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={() => onView(message)} className="btn btn-ghost btn-sm" title="View message"
            style={{ padding: '5px 8px', fontSize: 12 }}>
            View
          </button>
          <button onClick={() => onToggleRead(message._id, !message.isRead)}
            className="btn btn-ghost btn-sm" title={message.isRead ? 'Mark unread' : 'Mark read'}
            style={{ padding: '5px 8px', fontSize: 12, color: message.isRead ? 'var(--text-muted)' : 'var(--primary)' }}>
            {message.isRead ? '● Unread' : '○ Read'}
          </button>
          <button onClick={() => onDelete(message._id)} className="btn btn-ghost btn-sm"
            style={{ padding: '5px 8px', fontSize: 12, color: 'var(--danger)' }} title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default MessageRow;
