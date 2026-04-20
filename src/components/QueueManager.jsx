import React, { useState, useEffect } from 'react';
import { Timer, Utensils, CheckCircle, Coffee, Droplets, MapPin, Activity } from 'lucide-react';

const QueueManager = ({ stalls, onNavigate, onOrder, onClearOrder, activeOrders = [] }) => {
  // Separate stalls by type
  const foodStalls = stalls.filter(s => s.type === 'food');
  const washrooms = stalls.filter(s => s.type === 'washroom');
  const exits = stalls.filter(s => s.type === 'exit');

  // Find fastest food
  const fastestFood = [...foodStalls].sort((a, b) => a.waitTime - b.waitTime)[0];

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

      {/* ACTIVE ORDERS TRACKING */}
      {activeOrders.length > 0 && (
        <div className="status-section mb-6">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
            <Activity size={18} /> MY ACTIVE ORDERS
          </h3>
          <div className="gate-list mt-2">
            {activeOrders.map(order => (
              <div key={order.id} className="status-item" style={{ borderLeft: `4px solid ${order.status === 'ready' ? 'var(--status-clear)' : 'var(--primary)'}`, background: 'rgba(255,255,255,0.03)' }}>
                <div className="item-info">
                  <span className="item-name" style={{ fontWeight: 'bold' }}>{order.stallName}</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {order.items.map(i => i.name).join(', ')}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: order.status === 'ready' ? 'var(--status-clear)' : 'var(--primary)', marginTop: '4px' }}>
                      {order.status === 'ready' ? '✨ READY FOR PICKUP' : '⌛ PREPARING...'}
                    </span>
                  </div>
                </div>
                {order.status === 'ready' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="nav-btn" 
                      onClick={() => onNavigate(order.stallName)}
                      style={{ background: 'var(--status-clear)', color: 'white' }}
                      title="Navigate to Stall"
                    >
                      <MapPin size={14} />
                    </button>
                    <button 
                      className="nav-btn" 
                      onClick={() => onClearOrder(order.id)}
                      style={{ background: 'var(--primary)', color: 'white' }}
                      title="Mark as Picked Up"
                    >
                      <CheckCircle size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="status-section">
        <h3 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>Food Corner Counters</h3>
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
                <button 
                  className="nav-btn" 
                  onClick={() => onNavigate(stall.name)}
                  aria-label={`Navigate to ${stall.name}`}
                >
                  <MapPin size={14} aria-hidden="true" />
                </button>
                <button 
                  className="preorder-btn" 
                  onClick={() => onOrder(stall)}
                  style={{ background: 'var(--primary)', color: 'white' }}
                >
                  Order
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
