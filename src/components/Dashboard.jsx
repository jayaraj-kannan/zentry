import React from 'react';
import { Navigation2, MapPin } from 'lucide-react';

const Dashboard = ({ zones, onNavigate }) => {
  const gates = zones.filter(z => z.type === 'gate');

  // Find best gate (clear status ideally)
  const bestGate = gates.find(g => g.status === 'clear') || gates.find(g => g.status === 'moderate');

  return (
    <div className="dashboard">
      <div className="card highlight-card">
        <div className="card-header highlight">
          <Navigation2 className="icon highlight-icon" size={20} />
          <h3>Smart Rerouting</h3>
        </div>
        <p className="suggestion-text">
          Avoid the crowds! We recommend using <strong>{bestGate ? bestGate.name : 'any available gate'}</strong> for the fastest entry.
        </p>
      </div>

      <div className="status-section">
        <h3>Live Gate Status</h3>
        <div className="gate-list">
          {gates.map(gate => (
            <div key={gate.id} className="status-item">
              <span className="item-name">{gate.name}</span>
              <div className="status-indicator-wrapper">
                <span className={`status-pill ${gate.status}`}>
                  {gate.status.charAt(0).toUpperCase() + gate.status.slice(1)}
                </span>
                <span className="density-text">{gate.density}%</span>
                {onNavigate && (
                  <button className="nav-btn" onClick={() => onNavigate(gate.name)}>
                    <MapPin size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
