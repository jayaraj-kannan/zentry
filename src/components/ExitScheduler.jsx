import React from 'react';
import { Clock, Route, AlertCircle, Map as MapIcon, ChevronRight } from 'lucide-react';

const ExitScheduler = ({ onNavigate }) => {
  // Mock user seat info
  const userSeat = { block: 'C', row: 'D', seat: '23' };
  
  const exitSlots = [
    { block: 'A', time: '10:00 PM', status: 'completed' },
    { block: 'B', time: '10:15 PM', status: 'active' },
    { block: 'C', time: '10:30 PM', status: 'upcoming' },
    { block: 'D', time: '10:45 PM', status: 'upcoming' },
  ];

  const userSlot = exitSlots.find(s => s.block === userSeat.block);

  return (
    <div className="exit-scheduler">
      <div className="card highlight-card" style={{ padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--primary)', background: 'var(--card-bg)', marginBottom: '1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '14px', color: 'var(--text-inverse)' }}>
            <Clock size={24} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Exit window</p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{userSlot.time}</h2>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.2rem' }}>
           <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: 'var(--status-clear)' }}></div>
           <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: 'var(--primary)', animation: 'pulse 1.5s infinite' }}></div>
           <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: 'var(--surface-subtle)' }}></div>
           <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: 'var(--surface-subtle)' }}></div>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Phased exit is active for <strong>Block {userSeat.block}</strong>. Please remain in the concourse until your slot activates to avoid gate congestion.
        </p>
      </div>

      <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)', paddingLeft: '4px' }}>Recommended Routes</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div className="status-item" onClick={() => onNavigate('Mount Road - Back Gate')} style={{ cursor: 'pointer', border: '1px solid rgba(16, 185, 129, 0.2)', background: 'rgba(16, 185, 129, 0.05)' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '12px', color: 'var(--status-clear)' }}>
            <Route size={20} />
          </div>
          <div style={{ flex: 1, marginLeft: '12px' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>Back Gate → Mount Road</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>12 min • Minimal Traffic • AI Optimized</p>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </div>

        <div className="status-item" onClick={() => onNavigate('Wallajah Road - Main Gate')} style={{ cursor: 'pointer', opacity: 0.7 }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '10px', borderRadius: '12px', color: 'var(--status-congested)' }}>
            <AlertCircle size={20} />
          </div>
          <div style={{ flex: 1, marginLeft: '12px' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>Main Gate → Wallajah Rd</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>45 min • High Congestion</p>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </div>
      </div>
    </div>
  );
};

export default ExitScheduler;
