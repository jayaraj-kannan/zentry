import React, { useState, useEffect } from 'react';
import HeatMap from './components/HeatMap';
import Dashboard from './components/Dashboard';
import AlertOverlay from './components/AlertOverlay';
import QueueManager from './components/QueueManager';
import ParkingManager from './components/ParkingManager';
import ExitScheduler from './components/ExitScheduler';
import StadiumAssistant from './components/StadiumAssistant';
import EventInteract from './components/EventInteract';
import Logo from './components/Logo';

import { Activity, ShieldAlert, Home, Map as MapIcon, Ticket, QrCode, Calendar, MapPin, Settings, X, Car, AlertOctagon, HandMetal, MessageSquare, Bot, Sun, Moon, Phone, UserPlus, Save, Loader2 } from 'lucide-react';
import './queue-styles.css';
import './ar-styles.css';
import './emergency-styles.css';
import { useAuth } from './context/AuthContext';
import AuthScreen from './components/AuthScreen';
import { LogOut } from 'lucide-react';

// Mock initial data
const initialZones = [
  { id: 2, name: 'Gate 2 (Pavillion)', type: 'gate', density: 40, status: 'moderate', x: 740, y: 650, radius: 28 },
  { id: 5, name: 'Gate 5 (Emergency)', type: 'gate', density: 90, status: 'congested', x: 740, y: 400, radius: 28 },
  { id: 7, name: 'Gate 7', type: 'gate', density: 15, status: 'clear', x: 740, y: 150, radius: 28 },
  { id: 9, name: 'Gate 9', type: 'gate', density: 25, status: 'clear', x: 500, y: 60, radius: 28 },
  { id: 10, name: 'Gate 10 (V Pattabiram)', type: 'gate', density: 85, status: 'congested', x: 300, y: 60, radius: 28 },
  { id: 12, name: 'Gate 12 (AG Ramsingh)', type: 'gate', density: 35, status: 'clear', x: 60, y: 200, radius: 28 },
  { id: 14, name: 'Gate 14', type: 'gate', density: 50, status: 'moderate', x: 60, y: 400, radius: 28 },
  { id: 17, name: 'Gate 17 (MCC)', type: 'gate', density: 88, status: 'congested', x: 60, y: 650, radius: 28 },
  { id: 18, name: 'MAC B Ground', type: 'facility', density: 20, status: 'clear', x: 220, y: 160, radius: 45 },
  { id: 19, name: 'Food Court', type: 'facility', density: 75, status: 'congested', x: 580, y: 250, radius: 35 }
];

const initialStalls = [
  { id: 101, name: 'Chai Kings', type: 'food', waitTime: 5, diet: 'veg', serving: 'Tea, Coffee, Buns & Iced Teas' },
  { id: 102, name: 'KFC', type: 'food', waitTime: 20, diet: 'non-veg', serving: 'Popcorn Chicken' },
  { id: 103, name: 'Wow! Momo', type: 'food', waitTime: 12, diet: 'both', serving: 'Hot Momos' },
  { id: 104, name: 'Domino\'s Pizza', type: 'food', waitTime: 15, diet: 'both', serving: 'Pizzas & Sides' },
  { id: 105, name: 'Burger King', type: 'food', waitTime: 10, diet: 'both', serving: 'Burgers & Wraps' },
  { id: 106, name: 'Pavillion Washroom (M)', type: 'washroom', waitTime: 3 },
  { id: 107, name: 'Level 1 Washroom (W)', type: 'washroom', waitTime: 8 },
  { id: 108, name: 'Main Exit', type: 'exit', waitTime: 15 },
  { id: 109, name: 'Pavillion Exit', type: 'exit', waitTime: 5 }
];

function App() {
  const { user, profileData, updateProfileData, role, logout } = useAuth();
  
  // Local state for profile form
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize local state from profileData
  useEffect(() => {
    if (profileData) {
      setPhone(profileData.phone || '');
      setAddress(profileData.address || '');
      setEmergencyName(profileData.emergencyName || '');
      setEmergencyPhone(profileData.emergencyPhone || '');
    }
  }, [profileData]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfileData({
        phone,
        address,
        emergencyName,
        emergencyPhone
      });
      setCurrentAlert({ message: "Profile updated successfully!" });
    } catch (error) {
      setCurrentAlert({ message: "Failed to update profile." });
    } finally {
      setIsSaving(false);
    }
  };
  const [zones, setZones] = useState(initialZones);
  const [stalls, setStalls] = useState(initialStalls);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [isEmergency, setIsEmergency] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [homeTab, setHomeTab] = useState('live');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState('pending'); // pending, scanning, scanned
  const [sosState, setSosState] = useState('idle'); // idle, dispatching, active
  const [sosReason, setSosReason] = useState(null);
  const [showSOSOptions, setShowSOSOptions] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('zentry-theme') || 'dark');
  const [showSeatRoute, setShowSeatRoute] = useState(false);

  // Persist theme to localStorage
  useEffect(() => {
    localStorage.setItem('zentry-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const [activeEmergencyPayload, setActiveEmergencyPayload] = useState(null);
  const [isExitPhase, setIsExitPhase] = useState(false);

  const [parkingLots, setParkingLots] = useState([
    { id: 1, name: 'Main Lot A', occupancy: 92, distance: '100m', type: 'Public', entryGate: 'via Wallajah Rd' },
    { id: 2, name: 'Premium Lot B', occupancy: 45, distance: '50m', type: 'VIP', entryGate: 'via Gate 5 (Inner)' },
    { id: 3, name: 'South Lot C', occupancy: 60, distance: '250m', type: 'Overflow', entryGate: 'via Bells Rd' }
  ]);

  const [showAssistant, setShowAssistant] = useState(false);

  const triggerEmergency = (type) => {
    setActiveEmergencyPayload(type);
    setIsEmergency(true);
    setActiveTab('home');
    setShowAdminMenu(false);
    setCurrentAlert({ message: `🚨 EMERGENCY ALERT: ${type} initiated!`, persistent: true });
  };

  const cancelEmergency = () => {
    setIsEmergency(false);
    setIsExitPhase(false);
    setActiveEmergencyPayload(null);
    setShowAdminMenu(false);
    setCurrentAlert({ message: "All special protocols cleared. Normal operations resumed." });
  };

  const handleExitPhase = () => {
    setIsExitPhase(true);
    setActiveTab('home');
    setShowAdminMenu(false);
    setCurrentAlert({ message: "Phased Exit Protocol initiated. Please check your assigned slot.", persistent: true });
  };

  const handleSOS = () => {
    if (sosState !== 'idle') {
      setShowAdminMenu(false); // In case they check thru admin
      return;
    }
    setShowSOSOptions(true);
  };

  const submitUserSOS = (type) => {
    setSosReason(type);
    setSosState('dispatching');
    setShowSOSOptions(false);
    setCurrentAlert({ message: `SOS Received: ${type}. Locating you now...`, persistent: true });

    setTimeout(() => {
      setSosState('active');
      setCurrentAlert({ message: `Security Dispatched for ${type}! Personnel are on the way. ETA: 45s.`, persistent: true });
    }, 4000);
  };

  const handleShowQR = () => {
    setCheckInStatus('qr_shown');
    setTimeout(() => {
      handleUpdateStatus();
    }, 1500);
  };

  const handleUpdateStatus = () => {
    setCheckInStatus('scanning');
    setTimeout(() => {
      setCheckInStatus('scanned');
      setIsCheckedIn(true);
      setCurrentAlert({ message: "Verified successfully. You're in the event!" });
    }, 4000);
  };

  const handleNavigation = (dest) => {
    const searchQuery = encodeURIComponent(`M.A. Chidambaram Stadium ${dest}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
    window.open(url, '_blank');

    setCurrentAlert({ message: `Opening Google Maps for ${dest}...` });
  };

  // Simulate dynamic crowd data changes
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(prevZones => prevZones.map(zone => {
        // Randomly fluctuate density by -5 to +5
        let change = Math.floor(Math.random() * 11) - 5;
        let newDensity = Math.max(0, Math.min(100, zone.density + change));

        let newStatus = 'clear';
        if (newDensity > 70) newStatus = 'congested';
        else if (newDensity > 40) newStatus = 'moderate';

        return { ...zone, density: newDensity, status: newStatus };
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Simulate Wait Time fluctuations
  useEffect(() => {
    const stallInterval = setInterval(() => {
      setStalls(prev => prev.map(stall => {
        let change = Math.floor(Math.random() * 5) - 2;
        let newWaitTime = Math.max(0, stall.waitTime + change);
        return { ...stall, waitTime: newWaitTime };
      }));
    }, 5000);
    return () => clearInterval(stallInterval);
  }, []);

  // Simulate Real-time Parking Availability changes
  useEffect(() => {
    const parkingInterval = setInterval(() => {
      setParkingLots(prev => prev.map(lot => {
        // Subtle drift in occupancy
        let change = Math.floor(Math.random() * 3) - 1;
        let newOccupancy = Math.max(0, Math.min(100, lot.occupancy + change));
        return { ...lot, occupancy: newOccupancy };
      }));
    }, 6000);
    return () => clearInterval(parkingInterval);
  }, []);

  // Simulate Push Alert System
  useEffect(() => {
    const alertTimer = setTimeout(() => {
      const congestedGate = zones.find(z => z.type === 'gate' && z.status === 'congested');
      const clearGate = zones.find(z => z.type === 'gate' && z.status === 'clear');

      if (congestedGate && clearGate) {
        setCurrentAlert({
          message: `${congestedGate.name} is currently very crowded. Please use ${clearGate.name} for faster entry.`
        });
      }
    }, 6000);

    return () => clearTimeout(alertTimer);
  }, [zones]);

  // AI Abnormal Crowd Behavior Detection Simulator
  useEffect(() => {
    if (isCheckedIn) {
      const aiTimer = setTimeout(() => {
        setCurrentAlert({
          message: "⚠️ AI Alert: Sudden abnormal crowd surge detected near Gate 5. Auto-monitoring active.",
          persistent: true
        });
      }, 15000);
      return () => clearTimeout(aiTimer);
    }
  }, [isCheckedIn]);

  // Auto-dismiss logic for alerts
  useEffect(() => {
    if (currentAlert) {
      const delay = currentAlert.persistent ? 5000 : 3000;
      const timer = setTimeout(() => {
        setCurrentAlert(null);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [currentAlert]);

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div className={`app-container ${theme === 'light' ? 'light-theme' : ''}`}>
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="mdi mdi-zend pulse" style={{ fontSize: '28px', color: 'var(--primary)' }}></span>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: 0, letterSpacing: '0.5px' }}>Zentry</h1>
        </div>
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            className="settings-trigger"
            onClick={() => setShowAdminMenu(true)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {showAdminMenu && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setShowAdminMenu(false)}>
          <div style={{ background: 'var(--bg-dark)', width: '100%', maxWidth: '420px', borderRadius: '30px 30px 0 0', padding: '2rem', borderTop: '1px solid var(--card-border)', boxShadow: '0 -10px 40px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Account & Settings</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>{role}</span>
                  {role === 'admin' && <ShieldAlert size={12} color="var(--primary)" />}
                </div>
              </div>
              <button onClick={() => setShowAdminMenu(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            <div style={{ background: 'var(--surface-subtle)', borderRadius: '16px', padding: '1.2rem', marginBottom: '1.5rem', border: '1px solid var(--card-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ color: 'var(--text-main)', fontWeight: 'bold', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.displayName || 'Stadium Guest'}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {role === 'admin' ? (
                <>
                  <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Admin Security Controls</p>
                  
                  <button
                    onClick={() => triggerEmergency('Fire Evacuation')}
                    style={{ width: '100%', padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    Trigger Fire Evacuation <ShieldAlert size={18} />
                  </button>

                  <button
                    onClick={() => triggerEmergency('Critical Crowd Crush')}
                    style={{ width: '100%', padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    Trigger Crowd Crush Warning <Activity size={18} />
                  </button>

                  <button
                    onClick={() => triggerEmergency('Medical Emergency')}
                    style={{ width: '100%', padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#3b82f6', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    Trigger Medical Alert <Activity size={18} />
                  </button>

                  <button
                    onClick={() => handleExitPhase()}
                    style={{ width: '100%', padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.3)', color: 'var(--primary)', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    Initiate Phased Exit <MapIcon size={18} />
                  </button>
                  <div style={{ height: '1rem' }}></div>
                </>
              ) : null}

              <p style={{ color: 'var(--text-main)', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Personal Details</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', background: 'var(--surface-inner)', padding: '1.2rem', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', marginLeft: '4px' }}>Phone Number</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Phone size={14} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                    <input 
                      type="tel" 
                      placeholder="Enter phone number" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 12px 10px 36px', color: 'white', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', marginLeft: '4px' }}>Current Address</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <MapPin size={14} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      placeholder="Enter city or address" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 12px 10px 36px', color: 'white', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div style={{ height: '0.2rem' }}></div>
                <p style={{ color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Emergency Contact</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <UserPlus size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
                      <input 
                        type="text" 
                        placeholder="Name" 
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 10px 10px 32px', color: 'white', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <Phone size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
                      <input 
                        type="tel" 
                        placeholder="Phone" 
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 10px 10px 32px', color: 'white', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  style={{ width: '100%', marginTop: '0.5rem', padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {isSaving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                  Save Profile Details
                </button>
              </div>

              {sosState !== 'idle' && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', border: '1px solid #ef4444' }}>
                  <p style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '8px' }}>ACTIVE USER SOS REPORT</p>
                  <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '12px' }}><strong>Category:</strong> {sosReason}</p>
                  <button
                    onClick={cancelEmergency}
                    style={{ width: '100%', padding: '10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    RESOLVE & DISPATCH
                  </button>
                </div>
              )}

              {(isEmergency || isExitPhase) && (
                <button
                  onClick={cancelEmergency}
                  style={{ width: '100%', padding: '1rem', background: 'var(--status-clear)', border: 'none', color: '#000', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}
                >
                  RESET SYSTEM (CLEARED)
                </button>
              )}

              <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)', margin: '1rem 0' }} />
              
              <button
                onClick={() => {
                  logout();
                  setShowAdminMenu(false);
                }}
                style={{ width: '100%', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                Sign Out <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="content">
        {activeTab === 'home' && (
          <>
            <section className="map-section">
              {(isEmergency || sosState !== 'idle') && (
                <div className="emergency-banner" style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', padding: '12px', borderRadius: '12px', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-main)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem' }}>🚨 <strong>{sosState === 'active' ? 'SECURITY DISPATCHED' : sosState === 'dispatching' ? 'SOS TRANSMITTING' : (activeEmergencyPayload || 'CRITICAL EMERGENCY')}</strong></span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sosState !== 'idle' ? 'Personnel are tracking your location. Stay where you are.' : 'Follow safe route to Gate 2 (Pavillion)'}</span>
                    <button
                      onClick={() => handleNavigation('Gate 2 (Pavillion)')}
                      style={{ background: '#ef4444', color: 'var(--text-inverse)', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 10px rgba(239, 68, 68, 0.4)' }}
                    >
                      {sosState !== 'idle' ? 'Your Location' : 'Evacuation Route'}
                    </button>
                  </div>
                </div>
              )}
              <HeatMap 
                zones={zones} 
                isEmergency={isEmergency || sosState !== 'idle'} 
                isPreCheckin={!isCheckedIn} 
                showSeatRoute={showSeatRoute} 
                isExitPhase={isExitPhase}
              />
            </section>

            {(!isEmergency && !isExitPhase && sosState === 'idle') && (
              <>
                {/* Unified Sub-Tabs for all Users */}
                <div style={{ padding: '0 1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', background: 'var(--surface-subtle)', borderRadius: '12px', padding: '4px', border: '1px solid var(--card-border)' }}>
                    <button
                      style={{ flex: 1, padding: '10px 4px', border: 'none', borderRadius: '10px', background: homeTab === 'live' ? 'rgba(59, 130, 246, 0.2)' : 'transparent', color: homeTab === 'live' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: '600', transition: 'all 0.2s', cursor: 'pointer', fontSize: '0.8rem' }}
                      onClick={() => setHomeTab('live')}
                    >
                      {isCheckedIn ? 'Status' : 'Event Info'}
                    </button>
                    {isCheckedIn && (
                      <button
                        style={{ flex: 1, padding: '10px 4px', border: 'none', borderRadius: '10px', background: homeTab === 'interact' ? 'rgba(59, 130, 246, 0.2)' : 'transparent', color: homeTab === 'interact' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: '600', transition: 'all 0.2s', cursor: 'pointer', fontSize: '0.8rem' }}
                        onClick={() => setHomeTab('interact')}
                      >
                        Interact
                      </button>
                    )}
                    {isCheckedIn && (
                      <button
                        style={{ flex: 1, padding: '10px 4px', border: 'none', borderRadius: '10px', background: homeTab === 'queue' ? 'rgba(59, 130, 246, 0.2)' : 'transparent', color: homeTab === 'queue' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: '600', transition: 'all 0.2s', cursor: 'pointer', fontSize: '0.8rem' }}
                        onClick={() => setHomeTab('queue')}
                      >
                        Queue
                      </button>
                    )}
                    <button
                      style={{ flex: 1, padding: '10px 4px', border: 'none', borderRadius: '10px', background: homeTab === 'parking' ? 'rgba(59, 130, 246, 0.2)' : 'transparent', color: homeTab === 'parking' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: '600', transition: 'all 0.2s', cursor: 'pointer', fontSize: '0.8rem' }}
                      onClick={() => setHomeTab('parking')}
                    >
                      Parking
                    </button>
                  </div>
                </div>

                <section className="dashboard-section" style={{ paddingBottom: '2rem' }}>
                  {homeTab === 'live' && (
                    !isCheckedIn ? (
                      <div style={{ padding: '0 1rem', textAlign: 'center', marginTop: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <span className="mdi mdi-zend" style={{ fontSize: '72px', color: 'var(--primary)', filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.4))' }}></span>
                        </div>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Live Event Access</span>
                        <h3 style={{ marginBottom: '8px', color: 'var(--text-main)', fontSize: '1.4rem', marginTop: '4px' }}>Welcome to the Grand Finale!</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6', padding: '0 1rem' }}>
                          Your personalized stadium guide is ready. Navigate to your seat mapped above, or check-in now to unlock live queue tracking and interactive maps.
                        </p>
                        <button
                          onClick={() => setActiveTab('tickets')}
                          style={{ background: 'var(--primary)', color: 'var(--text-inverse)', padding: '14px 32px', borderRadius: '14px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 8px 15px rgba(59, 130, 246, 0.3)' }}
                        >
                          Check-In
                        </button>
                      </div>
                    ) : (
                      <Dashboard zones={zones} onNavigate={handleNavigation} />
                    )
                  )}
                  {homeTab === 'queue' && <QueueManager stalls={stalls} onNavigate={handleNavigation} />}
                  {homeTab === 'parking' && <ParkingManager parkingLots={parkingLots} onNavigate={handleNavigation} isCheckedIn={isCheckedIn} userParkingId={2} zones={zones} />}
                  {homeTab === 'interact' && <EventInteract />}
                </section>
              </>
            )}

            {isExitPhase && (
              <div style={{ padding: '0 1rem' }}>
                <ExitScheduler onNavigate={handleNavigation} />
              </div>
            )}
          </>
        )}

        {activeTab === 'routes' && (
          <section className="queue-section" style={{ padding: '1rem' }}>
            <QueueManager stalls={stalls} onNavigate={handleNavigation} />
          </section>
        )}

        {activeTab === 'tickets' && (
          <section className="dashboard-section" style={{ padding: '1rem', height: '100%', overflowY: 'auto' }}>
            <div className={`ticket-wrapper ${checkInStatus === 'scanning' ? 'scanning' : checkInStatus === 'scanned' ? 'scanned' : ''}`}>
              <div className="ticket-inner">
                <div className="ticket-divider"></div>

                {/* Left Side: Match & Seat Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.2)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 'bold', width: 'fit-content', marginBottom: '4px' }}>
                      VIP Access
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)', lineHeight: '1.1' }}>CSK vs RCB</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>IPL 2026 • Match 24</p>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="var(--primary)" />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>Apr 24 • 7:30 PM</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} color="var(--primary)" />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-main)' }}>Chennai</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--surface-inner)', padding: '8px 12px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Block</p>
                      <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>C</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Row</p>
                      <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>D</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Seat</p>
                      <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>23</p>
                    </div>
                  </div>
                </div>

                {/* Right Side: QR Code / Scanning */}
                <div style={{ display: 'flex', paddingLeft: '34px', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {checkInStatus === 'pending' ? (
                    <div
                      onClick={handleShowQR}
                      style={{ cursor: 'pointer', textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '14px', border: '1px dashed var(--status-clear)' }}
                    >
                      <QrCode size={48} color="var(--status-clear)" />
                      <p style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--status-clear)', marginTop: '4px' }}>TAP TO SHOW</p>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ background: 'var(--text-inverse)', padding: '6px', borderRadius: '12px', border: checkInStatus === 'scanned' ? '3px solid var(--status-clear)' : '2px solid var(--card-border)', boxShadow: checkInStatus === 'scanned' ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none' }}>
                        <QrCode size={70} color="#000" />
                      </div>
                      {checkInStatus === 'scanning' && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--primary)', marginTop: '8px' }}>
                          <Activity className="pulse" size={12} /> <span style={{ fontWeight: '600', fontSize: '0.7rem' }}>Scanning...</span>
                        </div>
                      )}
                      {checkInStatus === 'scanned' && (
                        <div style={{ color: 'var(--status-clear)', fontSize: '0.7rem', fontWeight: 'bold', marginTop: '6px' }}>✓ VERIFIED</div>
                      )}
                    </div>
                  )}
                  <p style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontFamily: 'monospace', opacity: 0.6 }}>TKT-829471940</p>
                </div>
              </div>
            </div>

            {/* Post-Ticket Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {checkInStatus === 'scanned' && (
                <button
                  onClick={() => {
                    setActiveTab('home');
                    setHomeTab('live');
                    setShowSeatRoute(true);
                  }}
                  style={{ width: '100%', background: 'var(--primary)', color: 'var(--text-inverse)', border: 'none', padding: '14px', borderRadius: '14px', fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.4)' }}
                >
                  <MapPin size={18} color="var(--text-inverse)" /> Locate My Seat
                </button>
              )}

              {(checkInStatus === 'qr_shown' || checkInStatus === 'scanned') && (
                <button
                  onClick={handleUpdateStatus}
                  style={{ width: '100%', background: 'var(--surface-subtle)', border: '1px solid var(--card-border)', color: 'var(--text-muted)', padding: '12px', borderRadius: '14px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}
                >
                  Sync Ticket Status
                </button>
              )}
            </div>

            {checkInStatus !== 'scanned' && (
              <button
                style={{ width: '100%', padding: '1.2rem', background: 'var(--primary)', color: 'var(--text-inverse)', borderRadius: '16px', border: 'none', fontSize: '1rem', fontWeight: '600', marginTop: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                onClick={() => handleNavigation('Gate 2 (Pavillion)')}
              >
                <MapPin size={20} /> Navigate to Gate 2 (Pavillion)
              </button>
            )}
          </section>
        )}
      </main>

      {!isEmergency && (
        <div className="bottom-nav">
          <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <Home size={22} />
            <span>Home</span>
          </button>
          {isCheckedIn && (
            <>
              <button
                className={`nav-item ${activeTab === 'sos' ? 'active' : ''}`}
                onClick={handleSOS}
                style={{ color: sosState !== 'idle' ? 'var(--status-congested)' : 'var(--text-muted)' }}
              >
                <AlertOctagon size={24} className={sosState === 'dispatching' ? 'pulse' : ''} />
                <span style={{ fontWeight: sosState !== 'idle' ? 'bold' : 'normal' }}>SOS</span>
              </button>
            </>
          )}
          <button className={`nav-item ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')}>
            <Ticket size={22} />
            <span>Tickets</span>
          </button>
        </div>
      )}

      {/* Floating AI Assistant Button */}
      {isCheckedIn && !isEmergency && !showAdminMenu && (
        <button
          onClick={() => setShowAssistant(true)}
          className="pulse"
          style={{
            position: 'fixed', bottom: '100px', right: '20px',
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), #2dd4bf)',
            border: 'none', color: 'var(--text-inverse)', cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(59, 130, 246, 0.5)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <Bot size={32} />
        </button>
      )}

      {showAssistant && (
        <StadiumAssistant
          zones={zones}
          stalls={stalls}
          parkingLots={parkingLots}
          onClose={() => setShowAssistant(false)}
          onNavigate={handleNavigation}
        />
      )}

      {showSOSOptions && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setShowSOSOptions(false)}>
          <div style={{ background: 'var(--bg-dark)', width: '100%', maxWidth: '420px', borderRadius: '30px 30px 0 0', padding: '2rem', borderTop: '2px solid #ef4444' }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', marginBottom: '12px' }}>
                <ShieldAlert size={32} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Emergency SOS</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Help is 1-tap away. Select your situation.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '2rem' }}>
              {[
                { id: 'medical', label: 'Medical', icon: <Activity size={20} />, color: '#ef4444' },
                { id: 'security', label: 'Security', icon: <ShieldAlert size={20} />, color: '#f59e0b' },
                { id: 'harassment', label: 'Harassment', icon: <HandMetal size={20} />, color: '#3b82f6' },
                { id: 'fire', label: 'Fire', icon: <Activity size={20} />, color: '#ef4444' },
                { id: 'child', label: 'Lost Person', icon: <MapPin size={20} />, color: '#10b981' },
                { id: 'other', label: 'Other', icon: <AlertOctagon size={20} />, color: 'var(--text-muted)' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => submitUserSOS(opt.label)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '1.2rem 0.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)',
                    borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <div style={{ color: opt.color }}>{opt.icon}</div>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>{opt.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowSOSOptions(false)}
              style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-muted)', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <AlertOverlay alert={currentAlert} onClose={() => setCurrentAlert(null)} />
    </div>
  );
}

export default App;
