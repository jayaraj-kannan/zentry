import React, { memo, useState, useCallback } from 'react';
import { Satellite, Layers, Info } from 'lucide-react';
import { useJsApiLoader, GoogleMap, OverlayView } from '@react-google-maps/api';

const LIBRARIES = [];

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Stadium center
const center = {
  lat: 13.0627,
  lng: 80.2794,
};

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '450px',
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeId: 'satellite',
  tilt: 45,
};

// SVG coordinate (0-800, center=400) to GPS mapping
// Stadium is ~200m across, so 400px radius ≈ 100m ≈ 0.0009°
const SCALE_LAT = 0.0000022;
const SCALE_LNG = 0.0000024;

const svgToGps = (x, y) => ({
  lat: center.lat - (y - 400) * SCALE_LAT,
  lng: center.lng + (x - 400) * SCALE_LNG,
});

// Color helpers
const getDensityStyle = (status) => {
  switch (status) {
    case 'clear': return { bg: 'rgba(16,185,129,0.35)', border: '#10b981', glow: 'rgba(16,185,129,0.6)' };
    case 'moderate': return { bg: 'rgba(245,158,11,0.35)', border: '#f59e0b', glow: 'rgba(245,158,11,0.6)' };
    case 'congested': return { bg: 'rgba(239,68,68,0.4)', border: '#ef4444', glow: 'rgba(239,68,68,0.7)' };
    default: return { bg: 'rgba(51,65,85,0.3)', border: '#334155', glow: 'rgba(51,65,85,0.4)' };
  }
};

const getCssColor = (level) => {
  switch (level) {
    case 'clear': return 'var(--status-clear)';
    case 'moderate': return 'var(--status-moderate)';
    case 'congested': return 'var(--status-congested)';
    default: return '#334155';
  }
};

// --- Satellite View Sub-Components ---

const DensityMarker = memo(({ zone }) => {
  const pos = svgToGps(zone.x, zone.y);
  const colors = getDensityStyle(zone.status);
  const size = Math.max(30, zone.density * 0.6);

  return (
    <OverlayView position={pos} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translate(-50%, -50%)' }}>
        <div
          className="density-pulse-ring"
          style={{
            position: 'absolute',
            width: `${size + 20}px`,
            height: `${size + 20}px`,
            borderRadius: '50%',
            background: colors.bg,
            border: `2px solid ${colors.border}`,
            boxShadow: `0 0 ${zone.density > 70 ? 20 : 10}px ${colors.glow}`,
            animation: `densityPulse ${zone.status === 'congested' ? '1.2s' : '2.5s'} ease-in-out infinite`,
          }}
        />
        <div style={{
          width: '10px', height: '10px', borderRadius: '50%',
          background: colors.border, zIndex: 2,
          boxShadow: `0 0 6px ${colors.glow}`,
        }} />
        <div style={{
          position: 'absolute',
          top: `${size / 2 + 16}px`,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(4px)',
          color: 'white',
          padding: '3px 8px',
          borderRadius: '6px',
          fontSize: '9px',
          fontWeight: '700',
          whiteSpace: 'nowrap',
          border: `1px solid ${colors.border}`,
        }}>
          {zone.name} · {zone.density}%
        </div>
      </div>
    </OverlayView>
  );
});

const UserMarker = memo(() => {
  const pos = svgToGps(680, 480);
  return (
    <OverlayView position={pos} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translate(-50%, -50%)' }}>
        <div className="density-pulse-ring" style={{
          position: 'absolute', width: '30px', height: '30px', borderRadius: '50%',
          background: 'rgba(59,130,246,0.3)',
          animation: 'densityPulse 2s ease-in-out infinite',
        }} />
        <div style={{
          width: '14px', height: '14px', borderRadius: '50%',
          background: '#3b82f6', border: '3px solid white', zIndex: 2,
          boxShadow: '0 0 10px rgba(59,130,246,0.6)',
        }} />
        <div style={{
          position: 'absolute', top: '22px',
          background: '#3b82f6', color: 'white',
          padding: '2px 8px', borderRadius: '4px',
          fontSize: '9px', fontWeight: '800', letterSpacing: '0.5px',
        }}>YOU</div>
      </div>
    </OverlayView>
  );
});

// --- Main Component ---

const HeatMap = memo(({ zones, isEmergency, isPreCheckin, showSeatRoute, isExitPhase }) => {
  const [mapView, setMapView] = useState('heatmap');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
    libraries: LIBRARIES,
  });

  const SEAT_X = 400;
  const SEAT_Y = 120;
  const EXIT_GATE_X = 740;
  const EXIT_GATE_Y = 650;

  return (
    <div
      className="heatmap-container"
      role="region"
      aria-label="Stadium Crowd Heatmap"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Toggle */}
      <div style={{
        position: 'absolute', top: '12px', right: '12px', zIndex: 100,
        display: 'flex', gap: '2px',
        background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)',
        borderRadius: '10px', padding: '3px',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>
        <button
          onClick={() => setMapView('heatmap')}
          title="Crowd Heatmap"
          aria-label="Crowd Heatmap View"
          style={{
            padding: '8px', border: 'none', borderRadius: '8px',
            background: mapView === 'heatmap' ? 'var(--primary)' : 'transparent',
            color: mapView === 'heatmap' ? 'white' : 'var(--text-muted)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <Layers size={16} />
        </button>
        <button
          onClick={() => setMapView('satellite')}
          title="Satellite View"
          aria-label="Satellite Map View"
          style={{
            padding: '8px', border: 'none', borderRadius: '8px',
            background: mapView === 'satellite' ? 'var(--primary)' : 'transparent',
            color: mapView === 'satellite' ? 'white' : 'var(--text-muted)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <Satellite size={16} />
        </button>
      </div>

      {/* ===== SATELLITE VIEW ===== */}
      {mapView === 'satellite' && isLoaded ? (
        <div style={{ width: '100%', height: '100%', minHeight: '450px', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={18} options={mapOptions}>
            {/* Live Density Markers */}
            {!isPreCheckin && !isEmergency && !isExitPhase && zones.map(zone => (
              <DensityMarker key={zone.id} zone={zone} />
            ))}

            {/* Seat Location */}
            {!isEmergency && !isExitPhase && (
              <OverlayView position={svgToGps(SEAT_X, SEAT_Y)} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translate(-50%, -50%)' }}>
                  <div className="density-pulse-ring" style={{
                    position: 'absolute', width: isPreCheckin ? '34px' : '24px', height: isPreCheckin ? '34px' : '24px',
                    borderRadius: '50%', background: 'rgba(59,130,246,0.3)',
                    border: '2px solid #3b82f6',
                    animation: 'densityPulse 2s ease-in-out infinite',
                  }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', zIndex: 2, boxShadow: '0 0 8px rgba(59,130,246,0.6)' }} />
                  <div style={{
                    position: 'absolute', top: '20px', background: '#3b82f6', color: 'white',
                    padding: '2px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: '800',
                    whiteSpace: 'nowrap', letterSpacing: '0.3px',
                  }}>
                    {isPreCheckin ? 'Your Seat' : 'Assigned Seat'}
                  </div>
                </div>
              </OverlayView>
            )}

            {/* User Location */}
            {!isPreCheckin && !isEmergency && (
              <UserMarker />
            )}

            {/* Exit Phase - Exit Gate Marker */}
            {isExitPhase && (
              <OverlayView position={svgToGps(EXIT_GATE_X, EXIT_GATE_Y)} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translate(-50%, -50%)' }}>
                  <div className="density-pulse-ring" style={{
                    position: 'absolute', width: '50px', height: '50px', borderRadius: '50%',
                    background: 'rgba(16,185,129,0.25)', border: '2px solid #10b981',
                    animation: 'densityPulse 1.5s ease-in-out infinite',
                  }} />
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#10b981', zIndex: 2, boxShadow: '0 0 12px rgba(16,185,129,0.7)' }} />
                  <div style={{
                    position: 'absolute', top: '32px', background: 'rgba(16,185,129,0.9)', color: 'white',
                    padding: '3px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: '800',
                    whiteSpace: 'nowrap', letterSpacing: '0.5px',
                  }}>
                    EXIT GATE 2
                  </div>
                </div>
              </OverlayView>
            )}

            {/* Emergency Mode - Exit + User + Path */}
            {isEmergency && (
              <>
                {/* Emergency Exit */}
                <OverlayView position={svgToGps(EXIT_GATE_X, EXIT_GATE_Y)} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translate(-50%, -50%)' }}>
                    <div className="density-pulse-ring" style={{
                      position: 'absolute', width: '60px', height: '60px', borderRadius: '50%',
                      background: 'rgba(239,68,68,0.3)', border: '2px solid #ef4444',
                      animation: 'densityPulse 0.8s ease-in-out infinite',
                    }} />
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#ef4444', zIndex: 2, boxShadow: '0 0 15px rgba(239,68,68,0.8)' }} />
                    <div style={{
                      position: 'absolute', top: '36px', background: '#ef4444', color: 'white',
                      padding: '3px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: '800',
                      whiteSpace: 'nowrap', letterSpacing: '0.5px',
                    }}>
                      🚨 EMERGENCY EXIT
                    </div>
                  </div>
                </OverlayView>
                {/* Emergency User Location */}
                <OverlayView position={svgToGps(600, 550)} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translate(-50%, -50%)' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#3b82f6', border: '3px solid white', zIndex: 2, boxShadow: '0 0 10px rgba(59,130,246,0.6)' }} />
                    <div style={{
                      position: 'absolute', top: '20px', background: '#3b82f6', color: 'white',
                      padding: '2px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: '800',
                    }}>YOU</div>
                  </div>
                </OverlayView>
              </>
            )}
          </GoogleMap>

          {/* Info Card */}
          <div style={{
            position: 'absolute', bottom: '16px', left: '16px',
            background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)',
            padding: '12px 18px', borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)', maxWidth: '220px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Info size={14} color="var(--primary)" />
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '800' }}>Live Satellite</p>
            </div>
            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>M.A. Chidambaram Stadium · Real-time density overlay</p>
          </div>
        </div>
      ) : (
        /* ===== SVG HEATMAP VIEW ===== */
        <>
          <div className="stadium-graphic">
            <svg viewBox="0 0 800 800" className="stadium-svg" aria-hidden="true">
              <title>Stadium Map</title>
              <text x="400" y="40" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="18" fontWeight="bold" letterSpacing="2px">
                M.A. CHIDAMBARAM STADIUM
              </text>

              <circle cx="400" cy="400" r="340" fill="var(--bg-darker)" stroke="var(--card-border)" strokeWidth="8" />
              <circle cx="400" cy="400" r="260" fill="none" stroke="#b45309" strokeWidth="55" opacity="0.2" strokeDasharray="100 20" />
              <circle cx="400" cy="400" r="190" fill="#166534" opacity="0.3" />
              <rect x="385" y="340" width="30" height="120" fill="#854d0e" opacity="0.4" />

              {!isPreCheckin && !isEmergency && !isExitPhase && zones.map((zone) => (
                <g key={zone.id} className="zone-group">
                  <circle cx={zone.x} cy={zone.y} r={zone.radius} fill={getCssColor(zone.status)} className={`zone-pulse ${zone.status}`} opacity="0.6" />
                  <circle cx={zone.x} cy={zone.y} r="6" fill="#fff" />
                  <text x={zone.x} y={zone.y + 18} textAnchor="middle" fill="var(--text-main)" fontSize="11" fontWeight="600">{zone.name}</text>
                </g>
              ))}

              {!isEmergency && !isExitPhase && (
                <g className={`seat-location ${showSeatRoute ? 'seat-blink' : ''}`}>
                  <circle cx={SEAT_X} cy={SEAT_Y} r={isPreCheckin ? 15 : 10} fill="#3b82f6" className="zone-pulse" opacity="0.8" />
                  <circle cx={SEAT_X} cy={SEAT_Y} r="4" fill="#fff" />
                  <text x={SEAT_X} y={SEAT_Y - 25} fill="#3b82f6" fontSize="12" fontWeight="bold" textAnchor="middle">
                    {isPreCheckin ? "Your Seat" : "Assigned Seat"}
                  </text>
                </g>
              )}

              {!isPreCheckin && !isEmergency && (
                <g className={`user-location ${isExitPhase ? 'seat-blink' : ''}`}>
                  <circle cx="680" cy="480" r="12" fill="rgba(59, 130, 246, 0.4)" className="pulse" />
                  <circle cx="680" cy="480" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                  <text x="680" y="505" fill="#3b82f6" fontSize="12" fontWeight="bold" textAnchor="middle">You</text>
                </g>
              )}

              {isExitPhase && (
                <g className="exit-location seat-blink">
                  <circle cx={EXIT_GATE_X} cy={EXIT_GATE_Y} r="30" fill="rgba(16, 185, 129, 0.2)" />
                  <circle cx={EXIT_GATE_X} cy={EXIT_GATE_Y} r="10" fill="var(--status-clear)" />
                  <text x={EXIT_GATE_X} y={EXIT_GATE_Y + 30} fill="var(--status-clear)" fontSize="14" fontWeight="bold" textAnchor="middle">EXIT GATE 2</text>
                </g>
              )}

              {isEmergency && (
                <>
                  <circle cx={EXIT_GATE_X} cy={EXIT_GATE_Y} r="45" fill="rgba(239, 68, 68, 0.4)" className="zone-pulse" />
                  <circle cx={EXIT_GATE_X} cy={EXIT_GATE_Y} r="15" fill="#ef4444" />
                  <circle cx="600" cy="550" r="8" fill="#3b82f6" />
                  <text x="600" y="535" fill="#3b82f6" fontSize="16" fontWeight="bold" textAnchor="middle">You</text>
                  <line x1="600" y1="550" x2={EXIT_GATE_X} y2={EXIT_GATE_Y} stroke="#ef4444" strokeWidth="6" strokeDasharray="15 10" className="escape-path" />
                </>
              )}
            </svg>
          </div>

          {!isPreCheckin && !isExitPhase && (
            <div className="legend" role="presentation">
              <div className="legend-item"><span className="dot clear"></span> Clear</div>
              <div className="legend-item"><span className="dot moderate"></span> Moderate</div>
              <div className="legend-item"><span className="dot congested"></span> Congested</div>
            </div>
          )}
        </>
      )}
    </div>
  );
});

export default HeatMap;
