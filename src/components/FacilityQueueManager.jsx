import React from 'react';
import { Droplets, MapPin } from 'lucide-react';

const FacilityQueueManager = ({ stalls, onNavigate }) => {
  const washrooms = stalls.filter(s => s.type === 'washroom');
  const exits = stalls.filter(s => s.type === 'exit');

  return (
    <div className="queue-manager mt-4">
      <div className="status-section mt-4">
        <h3>Washroom Queues</h3>
        <div className="gate-list mt-2">
          {washrooms.map(stall => (
            <div key={stall.id} className="status-item">
              <span className="item-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Droplets size={16} color="var(--text-muted)" />
                {stall.name}
              </span>
              <div className="action-btn-wrapper">
                <span className="wait-time" style={{ color: stall.waitTime > 10 ? 'var(--status-congested)' : stall.waitTime > 5 ? 'var(--status-moderate)' : 'var(--status-clear)', fontWeight: '600' }}>
                  {stall.waitTime} min
                </span>
                <button 
                  className="nav-btn" 
                  onClick={() => onNavigate(stall.name)}
                  aria-label={`Navigate to ${stall.name}`}
                >
                  <MapPin size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="status-section mt-4" style={{ marginBottom: '80px' }}>
        <h3>Exit Queues</h3>
        <div className="gate-list mt-2">
          {exits.map(stall => (
            <div key={stall.id} className="status-item">
              <span className="item-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="var(--text-muted)" />
                {stall.name}
              </span>
              <div className="action-btn-wrapper">
                <span className="wait-time" style={{ color: stall.waitTime > 10 ? 'var(--status-congested)' : stall.waitTime > 5 ? 'var(--status-moderate)' : 'var(--status-clear)', fontWeight: '600' }}>
                  {stall.waitTime} min
                </span>
                <button className="nav-btn" onClick={() => onNavigate(stall.name)}>
                  <MapPin size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacilityQueueManager;
