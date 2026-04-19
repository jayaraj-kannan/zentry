import React from 'react';
import { MapPin } from 'lucide-react';

const HeatMap = ({ zones, isEmergency, isPreCheckin, showSeatRoute, isExitPhase }) => {
  const getColor = (level) => {
    switch (level) {
      case 'clear': return 'var(--status-clear)';
      case 'moderate': return 'var(--status-moderate)';
      case 'congested': return 'var(--status-congested)';
      default: return '#334155';
    }
  };

  const SEAT_X = 400;
  const SEAT_Y = 120; // Deeper in the top stands
  
  const EXIT_GATE_X = 740;
  const EXIT_GATE_Y = 650;

  return (
    <div className="heatmap-container">
      <div className="stadium-graphic">
        {/* Simple Abstract Stadium Representation */}
        <svg viewBox="0 0 800 800" className="stadium-svg">
          {/* Venue Name Title */}
          <text x="400" y="40" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="18" fontWeight="bold" letterSpacing="2px">
            M.A. CHIDAMBARAM STADIUM
          </text>
          
          {/* Ground Background */}
          <circle cx="400" cy="400" r="340" fill="var(--bg-darker)" stroke="var(--card-border)" strokeWidth="8" />
          {/* Stands around the pitch (Simplified blocks) */}
          <circle cx="400" cy="400" r="260" fill="none" stroke="#b45309" strokeWidth="55" opacity="0.2" strokeDasharray="100 20" />
          {/* Cricket Field */}
          <circle cx="400" cy="400" r="190" fill="#166534" opacity="0.3" />
          {/* Pitch */}
          <rect x="385" y="340" width="30" height="120" fill="#854d0e" opacity="0.4" />
          
          {/* Heatmap Zones (Live Movement) - Hidden during Exit Phase for focus */}
          {!isPreCheckin && !isEmergency && !isExitPhase && zones.map((zone) => (
            <g key={zone.id} className="zone-group">
              <circle 
                cx={zone.x} 
                cy={zone.y} 
                r={zone.radius} 
                fill={getColor(zone.status)} 
                className={`zone-pulse ${zone.status}`}
                opacity="0.6"
              />
              <circle cx={zone.x} cy={zone.y} r="6" fill="#fff" />
              <text x={zone.x} y={zone.y + 18} textAnchor="middle" fill="var(--text-main)" fontSize="11" fontWeight="600">{zone.name}</text>
            </g>
          ))}

          {/* Seat Location (Persistent) - Hidden during Exit Phase */}
          {!isEmergency && !isExitPhase && (
            <g className={`seat-location ${showSeatRoute ? 'seat-blink' : ''}`}>
              <circle cx={SEAT_X} cy={SEAT_Y} r={isPreCheckin ? 15 : 10} fill="#3b82f6" className="zone-pulse" opacity="0.8" />
              <circle cx={SEAT_X} cy={SEAT_Y} r="4" fill="#fff" />
              <text x={SEAT_X} y={SEAT_Y - 25} fill="#3b82f6" fontSize="12" fontWeight="bold" textAnchor="middle">
                {isPreCheckin ? "Your Seat" : "Assigned Seat"}
              </text>
            </g>
          )}

          {/* Live User Location */}
          {!isPreCheckin && !isEmergency && (
            <g className={`user-location ${isExitPhase ? 'seat-blink' : ''}`}>
              <circle cx="680" cy="480" r="12" fill="rgba(59, 130, 246, 0.4)" className="pulse" />
              <circle cx="680" cy="480" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
              <text x="680" y="505" fill="#3b82f6" fontSize="12" fontWeight="bold" textAnchor="middle">You</text>
            </g>
          )}

          {/* Exit Phase Specific Markers */}
          {isExitPhase && (
            <g className="exit-location seat-blink">
               <circle cx={EXIT_GATE_X} cy={EXIT_GATE_Y} r="30" fill="rgba(16, 185, 129, 0.2)" />
               <circle cx={EXIT_GATE_X} cy={EXIT_GATE_Y} r="10" fill="var(--status-clear)" />
               <text x={EXIT_GATE_X} y={EXIT_GATE_Y + 30} fill="var(--status-clear)" fontSize="14" fontWeight="bold" textAnchor="middle">EXIT GATE 2</text>
            </g>
          )}

          {isEmergency && (
            <>
              {/* Highlight Exit */}
              <circle cx={EXIT_GATE_X} cy={EXIT_GATE_Y} r="45" fill="rgba(239, 68, 68, 0.4)" className="zone-pulse" />
              <circle cx={EXIT_GATE_X} cy={EXIT_GATE_Y} r="15" fill="#ef4444" />
              
              {/* User Location */}
              <circle cx="600" cy="550" r="8" fill="#3b82f6" />
              <text x="600" y="535" fill="#3b82f6" fontSize="16" fontWeight="bold" textAnchor="middle">You</text>

              {/* Path Line */}
              <line 
                x1="600" y1="550" 
                x2={EXIT_GATE_X} y2={EXIT_GATE_Y} 
                stroke="#ef4444" 
                strokeWidth="6" 
                strokeDasharray="15 10" 
                className="escape-path"
              />
            </>
          )}
        </svg>
      </div>

      {!isPreCheckin && !isExitPhase && (
        <div className="legend">
          <div className="legend-item">
            <span className="dot clear"></span> Clear
          </div>
          <div className="legend-item">
            <span className="dot moderate"></span> Moderate
          </div>
          <div className="legend-item">
            <span className="dot congested"></span> Congested
          </div>
        </div>
      )}
    </div>
  );
};

export default HeatMap;
