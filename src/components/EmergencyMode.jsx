import React from 'react';
import { ShieldAlert, Map, X, PhoneCall } from 'lucide-react';

const EmergencyMode = ({ onClose, onGoogleMaps }) => {
  // Nearest emergency exit (Dynamic mocked for pavilion location)
  const userPos = { x: 600, y: 550 }; // Seated in the Pavilion area
  const nearestExit = { name: 'Gate 2 (Pavillion)', x: 740, y: 650 };

  return (
    <div className="emergency-overlay">
      <div className="emergency-header">
        <ShieldAlert size={32} />
        <h2>EMERGENCY MODE</h2>
        <button className="ar-close" onClick={onClose} style={{ marginLeft: 'auto' }}>
          <X size={24} />
        </button>
      </div>

      <div className="emergency-warning">
        Please proceed calmly to the nearest exit: <strong>{nearestExit.name}</strong>
      </div>

      <div className="emergency-map-container">
        <svg viewBox="0 0 800 800" className="stadium-svg emergency-map">
          {/* Ground Background */}
          <circle cx="400" cy="400" r="340" fill="#0f172a" stroke="#1e293b" strokeWidth="8" />
          
          {/* Cricket Field */}
          <circle cx="400" cy="400" r="190" fill="#1e293b" opacity="0.8" />
          
          {/* Highlight Exit */}
          <circle cx={nearestExit.x} cy={nearestExit.y} r="45" fill="rgba(239, 68, 68, 0.4)" className="zone-pulse" />
          <circle cx={nearestExit.x} cy={nearestExit.y} r="15" fill="#ef4444" />
          
          {/* User Location */}
          <circle cx={userPos.x} cy={userPos.y} r="8" fill="#3b82f6" />
          <text x={userPos.x} y={userPos.y - 15} fill="#3b82f6" fontSize="16" fontWeight="bold" textAnchor="middle">You</text>

          {/* Path Line */}
          <line 
            x1={userPos.x} y1={userPos.y} 
            x2={nearestExit.x} y2={nearestExit.y} 
            stroke="#ef4444" 
            strokeWidth="6" 
            strokeDasharray="15 10" 
            className="escape-path"
          />
        </svg>
      </div>

      <div className="emergency-actions">
        <button className="em-btn primary" onClick={() => onGoogleMaps(nearestExit.name)}>
          <Map size={20} />
          Open Route in Maps
        </button>
        <button className="em-btn outline">
          <PhoneCall size={20} />
          Call 112
        </button>
      </div>
    </div>
  );
};

export default EmergencyMode;
