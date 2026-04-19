import React from 'react';
import { Car, MapPin, CheckCircle2, Navigation } from 'lucide-react';

const ParkingManager = ({ parkingLots, onNavigate, isCheckedIn, userParkingId, zones = [] }) => {
  const userLot = parkingLots.find(lot => lot.id === userParkingId);
  
  // AI Calculation for Exit Estimation
  // Base time = 8 mins + (Avg Zone Density / 10)
  const avgDensity = zones.length > 0 ? zones.reduce((acc, z) => acc + z.density, 0) / zones.length : 30;
  const estExitTime = Math.round(8 + (avgDensity / 5));
  const exitStatus = avgDensity > 60 ? 'Delayed' : avgDensity > 40 ? 'Moderate' : 'Smooth';

  return (
    <div className="parking-manager">
      {isCheckedIn && userLot && (
        <div className="card highlight-card" style={{ marginBottom: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--primary)', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px', color: 'var(--text-inverse)' }}>
                <Car size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Your Vehicle</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Parked in {userLot.name}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Status</span>
              <div style={{ color: exitStatus === 'Smooth' ? 'var(--status-clear)' : exitStatus === 'Moderate' ? 'var(--status-moderate)' : 'var(--status-congested)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                {exitStatus} Exit
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', background: 'var(--surface-subtle)', padding: '15px', borderRadius: '15px', border: '1px solid var(--card-border)' }}>
             <div>
               <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Est. Time to Vehicle</p>
               <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <CheckCircle2 size={16} color="var(--status-clear)" />
                 <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fff' }}>~{estExitTime} mins</span>
               </div>
             </div>
             <div style={{ textAlign: 'right' }}>
               <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Lot Occupancy</p>
               <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: userLot.occupancy > 80 ? 'var(--status-congested)' : '#fff' }}>{userLot.occupancy}% Filled</span>
             </div>
          </div>

          <button 
            onClick={() => onNavigate(userLot.name)}
            style={{ width: '100%', marginTop: '1rem', background: 'var(--primary)', color: 'var(--text-inverse)', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}
          >
            <Navigation size={18} /> Route to My Vehicle
          </button>
        </div>
      )}

      {(!isCheckedIn || !userLot) && (
        <div className="card highlight-card" style={{ marginBottom: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--status-clear)', boxShadow: '0 8px 32px rgba(16, 185, 129, 0.1)' }}>
          <div className="card-header" style={{ color: 'var(--status-clear)' }}>
            <Car size={20} />
            <h3>AI Parking Assistant</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Finding you the best spot. Lot B currently has the most available spaces.
          </p>
        </div>
      )}

      <div style={{ marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
         <MapPin size={14} /> ALL PARKING FACILITIES
      </div>

      <div className="gate-list">
        {parkingLots.map(lot => (
          <div key={lot.id} className="status-item" style={{ padding: '1.2rem', border: lot.id === userParkingId ? '1px solid var(--primary)' : '1px solid var(--card-border)', background: lot.id === userParkingId ? 'rgba(59, 130, 246, 0.03)' : 'inherit' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="item-name" style={{ fontSize: '1rem' }}>{lot.name}</span>
                  {lot.id === userParkingId && <span style={{ padding: '2px 8px', background: 'var(--primary)', color: 'var(--text-inverse)', fontSize: '0.6rem', borderRadius: '4px', fontWeight: 'bold' }}>YOUR SPOT</span>}
                </div>
                <span style={{ fontSize: '0.8rem', color: lot.occupancy < 80 ? 'var(--status-clear)' : 'var(--status-congested)', fontWeight: 'bold' }}>
                  {100 - lot.occupancy}% Available
                </span>
              </div>
              
              {/* Progress Bar */}
              <div style={{ width: '100%', height: '6px', background: 'var(--surface-subtle)', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ width: `${lot.occupancy}%`, height: '100%', background: lot.occupancy > 80 ? 'var(--status-congested)' : lot.occupancy > 50 ? 'var(--status-moderate)' : 'var(--status-clear)', transition: 'width 1s ease-in-out' }}></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {lot.distance} from Entrance • {lot.type}
                  </span>
                  {!isCheckedIn && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>
                      Entry: {lot.entryGate}
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => onNavigate(lot.name)}
                  style={{ background: 'rgba(59, 130, 246, 0.1)', border: 'none', color: 'var(--primary)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                >
                  <Navigation size={14} /> {isCheckedIn ? 'Navigate' : 'Get Directions'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingManager;
