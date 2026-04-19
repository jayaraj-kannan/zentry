import React, { useState, useEffect } from 'react';
import { Timer, Utensils, CheckCircle, Coffee, Droplets, MapPin } from 'lucide-react';

const QueueManager = ({ stalls, onNavigate }) => {
  const [orderedStall, setOrderedStall] = useState(null);

  // Separate stalls by type
  const foodStalls = stalls.filter(s => s.type === 'food');
  const washrooms = stalls.filter(s => s.type === 'washroom');
  const exits = stalls.filter(s => s.type === 'exit');

  // Find fastest food
  const fastestFood = [...foodStalls].sort((a, b) => a.waitTime - b.waitTime)[0];

  const handlePreOrder = (stallId) => {
    setOrderedStall(stallId);
    setTimeout(() => {
      setOrderedStall(null);
    }, 4000); // clear after 4s
  };

  return (
    <div className="queue-manager mt-4">
      <div className="card highlight-card mb-4" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <div className="card-header highlight" style={{ color: 'var(--status-clear)' }}>
          <Timer className="icon highlight-icon" size={20} />
          <h3>Optimization: Fastest Food</h3>
        </div>
        {fastestFood && (
          <p className="suggestion-text">
            Craving a snack? Head to <strong>{fastestFood.name}</strong>. Wait time is currently only <strong style={{ color: 'var(--status-clear)' }}>{fastestFood.waitTime} mins</strong>!
          </p>
        )}
      </div>

      <div className="status-section">
        <h3>Food Counters</h3>
        <div className="gate-list mt-2">
          {foodStalls.map(stall => (
            <div key={stall.id} className="status-item">
              <div className="item-info">
                <span className="item-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {stall.category === 'coffee' ? <Coffee size={16} color="var(--text-muted)" /> : <Utensils size={16} color="var(--text-muted)" />}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {stall.name}
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {(stall.diet === 'veg' || stall.diet === 'both') && (
                          <div title="Veg" style={{ width: '8px', height: '8px', border: '1px solid #10b981', padding: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '4px', height: '4px', background: '#10b981', borderRadius: '50%' }} />
                          </div>
                        )}
                        {(stall.diet === 'non-veg' || stall.diet === 'both') && (
                          <div title="Non-Veg" style={{ width: '8px', height: '8px', border: '1px solid #ef4444', padding: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%' }} />
                          </div>
                        )}
                      </div>
                    </span>
                    {stall.serving && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>{stall.serving}</span>}
                  </div>
                </span>
                <span className="wait-time text-sm" style={{ color: stall.waitTime > 15 ? 'var(--status-congested)' : 'var(--text-muted)' }}>
                  {stall.waitTime} min wait
                </span>
              </div>
              
              <div className="action-btn-wrapper">
                {orderedStall === stall.id ? (
                  <button className="preorder-btn success" disabled>
                    <CheckCircle size={14} /> Confirmed!
                  </button>
                ) : (
                  <>
                    <button className="nav-btn" onClick={() => onNavigate(stall.name)}>
                      <MapPin size={14} />
                    </button>
                    <button className="preorder-btn" onClick={() => handlePreOrder(stall.id)}>
                      Pre-Order
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

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
                <button className="nav-btn" onClick={() => onNavigate(stall.name)}>
                  <MapPin size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="status-section mt-4">
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

export default QueueManager;
