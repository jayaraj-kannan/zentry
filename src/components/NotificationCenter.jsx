import React from 'react';
import { X, Bell, Utensils, AlertOctagon, Info, Check, Trash2, ChevronRight } from 'lucide-react';

const NotificationCenter = ({ notifications, onClose, onClearAll, onMarkRead, onAction }) => {
  const sortedNotifications = [...notifications].sort((a, b) => b.time - a.time);

  const getIcon = (type) => {
    switch (type) {
      case 'food': return <Utensils size={18} color="#10b981" />;
      case 'emergency': return <AlertOctagon size={18} color="#ef4444" />;
      default: return <Info size={18} color="var(--primary)" />;
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 4000, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }} onClick={onClose}>
      <div 
        style={{ 
          background: 'var(--bg-dark)', 
          width: '100%', 
          maxWidth: '400px', 
          height: '100vh',
          padding: '24px',
          borderLeft: '1px solid var(--card-border)',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>Notifications</h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        {notifications.length > 0 ? (
          <>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sortedNotifications.map((notif) => (
                <div 
                  key={notif.id} 
                  onClick={() => onAction(notif)}
                  style={{ 
                    padding: '16px', 
                    background: notif.read ? 'rgba(255,255,255,0.02)' : 'rgba(59, 130, 246, 0.05)', 
                    borderRadius: '16px', 
                    border: `1px solid ${notif.read ? 'var(--card-border)' : 'var(--primary)'}`,
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {!notif.read && (
                    <div style={{ position: 'absolute', top: '16px', right: '16px', width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }} />
                  )}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                      {getIcon(notif.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--text-main)' }}>{notif.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{notif.message}</p>
                      <p style={{ margin: '8px 0 0', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {notif.action && <span style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}> • Tap to view <ChevronRight size={12} /></span>}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={onClearAll}
              style={{ marginTop: '20px', padding: '12px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-muted)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <Trash2 size={16} /> Clear All
            </button>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.5 }}>
            <Bell size={64} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
            <p style={{ color: 'var(--text-muted)' }}>All caught up!<br />No new notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
