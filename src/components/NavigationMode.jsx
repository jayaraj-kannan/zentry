import React, { useState, useEffect } from 'react';
import { ArrowUp, Mic, MicOff, User, X, MapPin } from 'lucide-react';

const NavigationMode = ({ destination, onClose }) => {
  const [distance, setDistance] = useState(75); // Starting simulated distance in meters
  const [voiceOn, setVoiceOn] = useState(true);
  const [wheelchair, setWheelchair] = useState(false);

  // Simulate walking by reducing distance
  useEffect(() => {
    if (distance <= 0) return;

    const walker = setInterval(() => {
      setDistance(prev => Math.max(0, prev - 1));
    }, 1000); // lose 1 meter per second
    
    return () => clearInterval(walker);
  }, [distance]);

  return (
    <div className="ar-nav-overlay">
      <div className="ar-camera-bg"></div> {/* Simulated camera feed context */}
      
      {/* Top Header */}
      <div className="ar-header">
        <div className="dest-info">
          <MapPin size={18} color="#3b82f6" />
          <span>Navigating to <strong>{destination || 'Destination'}</strong></span>
        </div>
        <button className="ar-close" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      {/* AR Center Content */}
      <div className="ar-center">
        {distance > 0 ? (
          <>
            <div className={`ar-arrow ${distance < 20 ? 'turn-right' : 'straight'}`}>
              <ArrowUp size={120} color="var(--status-clear)" strokeWidth={1.5} />
            </div>
            <h2 className="ar-distance">{distance}m</h2>
            <p className="ar-instruction">
              {distance < 20 ? 'Turn right ahead' : 'Continue straight along the corridor'}
            </p>
          </>
        ) : (
          <div className="ar-arrived">
            <div className="success-pulse">
              <MapPin size={64} color="var(--status-clear)" />
            </div>
            <h2>You have arrived!</h2>
            <p>Your destination is on your left.</p>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="ar-controls">
        <button 
          className={`ar-btn ${voiceOn ? 'active' : ''}`} 
          onClick={() => setVoiceOn(!voiceOn)}
        >
          {voiceOn ? <Mic size={24} /> : <MicOff size={24} />}
          <span>Voice {voiceOn ? 'On' : 'Off'}</span>
        </button>

        <button 
          className={`ar-btn feature-btn ${wheelchair ? 'active' : ''}`} 
          onClick={() => setWheelchair(!wheelchair)}
        >
          <User size={24} />
          <span>{wheelchair ? 'Step-Free Route' : 'Standard Route'}</span>
        </button>
      </div>
    </div>
  );
};

export default NavigationMode;
