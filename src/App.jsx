import React, { useState, useEffect } from 'react';
import HeatMap from './components/HeatMap';
import Dashboard from './components/Dashboard';
import AlertOverlay from './components/AlertOverlay';
import QueueManager from './components/QueueManager';
import ParkingManager from './components/ParkingManager';
import ExitScheduler from './components/ExitScheduler';
import StadiumAssistant from './components/StadiumAssistant';
import FacilityQueueManager from './components/FacilityQueueManager';
import EventInteract from './components/EventInteract';
import Logo from './components/Logo';

import { Activity, ShieldAlert, Home, Map as MapIcon, Ticket, QrCode, Calendar, MapPin, Settings, X, Car, AlertOctagon, HandMetal, MessageSquare, Bot, Sun, Moon, Phone, UserPlus, Save, Loader2, Flame, Utensils } from 'lucide-react';
import './queue-styles.css';
import './ar-styles.css';
import './emergency-styles.css';
import { useAuth } from './context/AuthContext';
import { useStadium } from './context/StadiumContext';
import { seedInitialData, simulateCrowdDynamics, reportSosAlert, resolveSosAlert, getActiveUserSos, placeFoodOrder, subscribeToUserOrders, updateFoodOrderStatus } from './firebase/stadiumService';
import AuthScreen from './components/AuthScreen';
import { LogOut, Play, Square, Database } from 'lucide-react';
import { FoodMenuModal, PaymentModal } from './components/FoodOrderModals';
import NotificationCenter from './components/NotificationCenter';
import { Bell } from 'lucide-react';

// Mock initial data moved to stadiumService.js for seeding
const initialZonesData = [
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

const initialStallsData = [
  { 
    id: 101, name: 'Chai Kings', type: 'food', waitTime: 5, diet: 'veg', serving: 'Tea, Coffee, Buns & Iced Teas',
    menu: [
      { id: 'ck1', name: 'Ginger Chai', price: 45, image: '☕' },
      { id: 'ck2', name: 'Filter Coffee', price: 50, image: '🥤' },
      { id: 'ck3', name: 'Bun Maska', price: 60, image: '🍞' },
      { id: 'ck4', name: 'Samosa (2pcs)', price: 40, image: '🥟' },
      { id: 'ck5', name: 'Corn Puff', price: 35, image: '🥐' },
      { id: 'ck6', name: 'Rose Milk', price: 55, image: '🥛' }
    ]
  },
  { 
    id: 102, name: 'KFC', type: 'food', waitTime: 20, diet: 'non-veg', serving: 'Popcorn Chicken',
    menu: [
      { id: 'k1', name: 'Popcorn Chicken', price: 180, image: '🍗' },
      { id: 'k2', name: 'Zinger Burger', price: 195, image: '🍔' },
      { id: 'k3', name: 'Hot & Spicy Wings (4)', price: 160, image: '🍗' },
      { id: 'k4', name: 'Pepsi', price: 60, image: '🥤' },
      { id: 'k5', name: 'Chicken Strips', price: 150, image: '🍗' },
      { id: 'k6', name: 'Fries (L)', price: 110, image: '🍟' }
    ]
  },
  { 
    id: 103, name: 'Wow! Momo', type: 'food', waitTime: 12, diet: 'both', serving: 'Hot Momos',
    menu: [
      { id: 'wm1', name: 'Steamed Momos (6)', price: 140, image: '🥟' },
      { id: 'wm2', name: 'Fried Momos (6)', price: 160, image: '🥟' },
      { id: 'wm3', name: 'Pan Fried Momos', price: 180, image: '🥟' },
      { id: 'wm4', name: 'Thums Up', price: 60, image: '🥤' },
      { id: 'wm5', name: 'Mobo (Momo Burger)', price: 120, image: '🍔' },
      { id: 'wm6', name: 'Chocolate Momo', price: 90, image: '🍫' }
    ]
  },
  { 
    id: 104, name: 'Domino\'s Pizza', type: 'food', waitTime: 15, diet: 'both', serving: 'Pizzas & Sides',
    menu: [
      { id: 'd1', name: 'Margherita Pizza', price: 220, image: '🍕' },
      { id: 'd2', name: 'Peppy Paneer Pizza', price: 340, image: '🍕' },
      { id: 'd3', name: 'Garlic Breadsticks', price: 110, image: '🥖' },
      { id: 'd4', name: 'Coke', price: 60, image: '🥤' },
      { id: 'd5', name: 'Choco Lava Cake', price: 100, image: '🍰' },
      { id: 'd6', name: 'Veggie Paradise', price: 280, image: '🍕' }
    ]
  },
  { 
    id: 105, name: 'Burger King', type: 'food', waitTime: 10, diet: 'both', serving: 'Burgers & Wraps',
    menu: [
      { id: 'bk1', name: 'Whopper Junior', price: 150, image: '🍔' },
      { id: 'bk2', name: 'Crispy Veg Burger', price: 120, image: '🍔' },
      { id: 'bk3', name: 'Onion Rings', price: 90, image: '🧅' },
      { id: 'bk4', name: 'Sprite', price: 60, image: '🥤' },
      { id: 'bk5', name: 'Veg Whopper', price: 180, image: '🍔' },
      { id: 'bk6', name: 'Hash Brown', price: 70, image: '🥔' }
    ]
  },
  { id: 106, name: 'Pavillion Washroom (M)', type: 'washroom', waitTime: 3 },
  { id: 107, name: 'Level 1 Washroom (W)', type: 'washroom', waitTime: 8 },
  { id: 108, name: 'Main Exit', type: 'exit', waitTime: 15 },
  { id: 109, name: 'Pavillion Exit', type: 'exit', waitTime: 5 }
];

function App() {
  const { user, profileData, updateProfileData, role, logout } = useAuth();
  const { zones, stalls, parkingLots, loading: stadiumLoading } = useStadium();
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  
  // Real-time Simulation Loop
  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        simulateCrowdDynamics();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      // These are the constants defined above
      const parkingLotsInit = [
        { id: 1, name: 'Main Lot A', occupancy: 92, distance: '100m', type: 'Public', entryGate: 'via Wallajah Rd' },
        { id: 2, name: 'Premium Lot B', occupancy: 45, distance: '50m', type: 'VIP', entryGate: 'via Gate 5 (Inner)' },
        { id: 3, name: 'South Lot C', occupancy: 60, distance: '250m', type: 'Overflow', entryGate: 'via Bells Rd' }
      ];
      await seedInitialData(initialZonesData, initialStallsData, parkingLotsInit);
      setCurrentAlert({ message: "Stadium data seeded successfully!" });
    } catch (error) {
       console.error(error);
       setCurrentAlert({ message: "Seeding failed. Check console." });
    } finally {
      setIsSeeding(false);
    }
  };
  
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
      
      // Persistent Check-in Sync
      if (profileData.isCheckedIn) {
        setIsCheckedIn(true);
        setCheckInStatus('scanned');
      }
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
  const [currentAlert, setCurrentAlert] = useState(null);
  const [isEmergency, setIsEmergency] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [homeTab, setHomeTab] = useState('live');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [activeSosId, setActiveSosId] = useState(null);
  const [checkInStatus, setCheckInStatus] = useState('pending'); // pending, scanning, scanned
  const [sosState, setSosState] = useState('idle'); // idle, dispatching, active
  const [sosReason, setSosReason] = useState(null);
  const [showSOSOptions, setShowSOSOptions] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('zentry-theme') || 'dark');
  const [showSeatRoute, setShowSeatRoute] = useState(false);
  
  // Food Ordering States
  const [activeOrders, setActiveOrders] = useState([]);
  const [orderingStall, setOrderingStall] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cart, setCart] = useState([]);

  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Remapped constants to context values
  const userParkingId = 2; // Fixed for demo

  // Persist theme to localStorage
  useEffect(() => {
    localStorage.setItem('zentry-theme', theme);
  }, [theme]);

  // Persistent SOS Restoration Logic
  useEffect(() => {
    const restoreSos = async () => {
      if (user) {
        const activeSos = await getActiveUserSos(user.uid);
        if (activeSos) {
          setSosState('active');
          setActiveSosId(activeSos.id);
          setSosReason(activeSos.reason);
          setCurrentAlert({ 
            message: `Security Dispatched for ${activeSos.reason}! Personnel are on the way. ETA: 45s.`, 
            persistent: true 
          });
        }
      }
    };
    restoreSos();
  }, [user]);

  // Real-time Orders Subscription
  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToUserOrders(user.uid, (orders) => {
        // Check for new 'ready' orders to notify
        orders.forEach(order => {
          if (order.status === 'ready') {
            const notifId = `order-ready-${order.id}`;
            if (!notifications.some(n => n.id === notifId)) {
              addNotification(
                'food',
                'Your Order is Ready! ✨',
                `${order.stallName}: ${order.items.map(i => i.name).join(', ')} is waiting for pickup.`,
                { tab: 'food' },
                notifId
              );
            }
          }
        });
        setActiveOrders(orders);
      });
      return () => unsubscribe();
    }
  }, [user, notifications]);

  const addNotification = (type, title, message, action = null, customId = null) => {
    const id = customId || Date.now();
    if (!notifications.some(n => n.id === id)) {
      setNotifications(prev => [{
        id, type, title, message, action,
        time: Date.now(),
        read: false
      }, ...prev]);
    }
  };

  const handleNotificationAction = (notif) => {
    // Mark as read
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    
    // Execute action
    if (notif.action?.tab) {
      setActiveTab(notif.action.tab);
    }
    
    setShowNotifications(false);
  };

  const handleStartOrder = (stall) => {
    setOrderingStall(stall);
    setCart([]);
  };

  const handleConfirmOrder = async (paymentMethod) => {
    if (!user || cart.length === 0) return;

    try {
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const orderData = {
        userId: user.uid,
        userName: user.displayName || 'Guest',
        stallId: orderingStall.id,
        stallName: orderingStall.name,
        items: cart,
        total,
        paymentMethod
      };

      const orderId = await placeFoodOrder(orderData);
      
      setOrderingStall(null);
      setCart([]);
      setShowPaymentModal(false);
      setCurrentAlert({ message: "Order placed successfully! Tracking active." });

      // Simulate order becoming ready after 15 seconds
      setTimeout(async () => {
        await updateFoodOrderStatus(orderId, 'ready');
      }, 15000);

    } catch (error) {
      console.error("Order failed:", error);
      setCurrentAlert({ message: "Failed to place order." });
    }
  };

  const handleClearOrder = async (orderId) => {
    try {
      await updateFoodOrderStatus(orderId, 'picked_up');
      setCurrentAlert({ message: "Order picked up successfully. Enjoy!" });
    } catch (error) {
      console.error("Failed to clear order:", error);
      setCurrentAlert({ message: "Failed to clear order." });
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const [activeEmergencyPayload, setActiveEmergencyPayload] = useState(null);
  const [isExitPhase, setIsExitPhase] = useState(false);

  const [parkingLotsState, setParkingLots] = useState([]); // Fallback

  const [showAssistant, setShowAssistant] = useState(false);

  const triggerEmergency = (type) => {
    setActiveEmergencyPayload(type);
    setIsEmergency(true);
    setActiveTab('home');
    setShowAdminMenu(false);
    const msg = `🚨 EMERGENCY ALERT: ${type} initiated!`;
    setCurrentAlert({ message: msg, persistent: true });
    addNotification('emergency', 'CRITICAL ALERT', msg, { tab: 'home' });
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
    const msg = "Phased Exit Protocol initiated. Please check your assigned slot.";
    setCurrentAlert({ message: msg, persistent: true });
    addNotification('info', 'Exit Protocol Started', msg, { tab: 'home' });
  };

  const handleSOS = () => {
    if (sosState !== 'idle') {
      setShowAdminMenu(false); // In case they check thru admin
      return;
    }
    setShowSOSOptions(true);
  };

  const submitUserSOS = async (type) => {
    setSosReason(type);
    setSosState('dispatching');
    setShowSOSOptions(false);
    setCurrentAlert({ message: `SOS Received: ${type}. Locating you now...`, persistent: true });

    // Report to Firestore for Cloud Function dispatching
    try {
      const alertId = await reportSosAlert(user.uid, user.email, type);
      setActiveSosId(alertId);
    } catch (error) {
      console.error("Failed to sync SOS to cloud:", error);
    }

    setTimeout(() => {
      setSosState('active');
      const msg = `Security Dispatched for ${type}! Personnel are on the way. ETA: 45s.`;
      setCurrentAlert({ message: msg, persistent: true });
      addNotification('emergency', 'Security Dispatched', msg, { tab: 'home' });
    }, 4000);

    addNotification('emergency', 'SOS Initiated', `Your SOS for ${type} has been received. Locating you now...`, { tab: 'home' });
  };

  const handleResolveSOS = async (status = 'resolved') => {
    if (activeSosId) {
      await resolveSosAlert(activeSosId, status);
    }
    setSosState('idle');
    setSosReason(null);
    setActiveSosId(null);
    setCurrentAlert(null);
    addNotification('info', 'SOS Resolved', 'Emergency responder status cleared.', { tab: 'home' });
  };

  const handleShowQR = () => {
    setCheckInStatus('qr_shown');
    setTimeout(() => {
      handleUpdateStatus();
    }, 1500);
  };

  const handleUpdateStatus = () => {
    setCheckInStatus('scanning');
    setTimeout(async () => {
      setCheckInStatus('scanned');
      setIsCheckedIn(true);
      
      // Persist to DB
      try {
        await updateProfileData({
          isCheckedIn: true,
          checkInTime: new Date().toISOString()
        });
        setCurrentAlert({ message: "Verified successfully. You're in the event!" });
      } catch (error) {
        console.error("Failed to persist check-in:", error);
        setCurrentAlert({ message: "Checked in locally, but failed to sync with server." });
      }
    }, 4000);
  };

  const handleNavigation = (dest) => {
    // Tracking Google Maps Navigation Event
    console.log(`[Analytics] User navigating to: ${dest}`);
    const searchQuery = encodeURIComponent(`M.A. Chidambaram Stadium ${dest}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
    window.open(url, '_blank');

    setCurrentAlert({ message: `Opening Google Maps for ${dest}...` });
  };


  // Simulate Push Alert System
  useEffect(() => {
    const alertTimer = setTimeout(() => {
      const congestedGate = zones.find(z => z.type === 'gate' && z.status === 'congested');
      const clearGate = zones.find(z => z.type === 'gate' && z.status === 'clear');

      if (congestedGate && clearGate) {
        const msg = `${congestedGate.name} is currently very crowded. Please use ${clearGate.name} for faster entry.`;
        setCurrentAlert({ message: msg });
        addNotification('info', 'Stadium Traffic Alert', msg);
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
        addNotification('info', 'AI Security Alert', 'Sudden abnormal crowd surge detected near Gate 5. Auto-monitoring active.');
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
          <span className="mdi mdi-zend pulse" style={{ fontSize: '28px', color: 'var(--primary)' }} aria-hidden="true"></span>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: 0, letterSpacing: '0.5px' }}>Zentry</h1>
        </div>
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
          >
            {theme === 'dark' ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
          </button>
          
          <button
            onClick={() => setShowNotifications(true)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', position: 'relative' }}
          >
            <Bell size={22} />
            {notifications.filter(n => !n.read).length > 0 && (
              <span style={{ position: 'absolute', top: '0', right: '0', width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%', border: '2px solid var(--bg-dark)' }} />
            )}
          </button>

          <button
            className="settings-trigger"
            onClick={() => setShowAdminMenu(true)}
            aria-label="Open Account and Admin Settings"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
          >
            <Settings size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      {showSOSOptions && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setShowSOSOptions(false)}>
          <div 
            style={{ 
              background: 'var(--bg-dark)', 
              width: '100%', 
              maxWidth: '500px', 
              borderTopLeftRadius: '24px', 
              borderTopRightRadius: '24px', 
              padding: '24px',
              border: '1px solid var(--card-border)',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--status-congested)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertOctagon size={24} /> Emergency SOS
              </h2>
              <button onClick={() => setShowSOSOptions(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>
            
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>Choose your emergency type. Security and medical teams will use your GPS to find you immediately.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button 
                onClick={() => submitUserSOS('Medical')}
                style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '16px', color: '#ef4444', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <Activity size={32} />
                <span style={{ fontWeight: 'bold' }}>Medical</span>
              </button>
              <button 
                onClick={() => submitUserSOS('Security')}
                style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--primary)', borderRadius: '16px', color: 'var(--primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <ShieldAlert size={32} />
                <span style={{ fontWeight: 'bold' }}>Security</span>
              </button>
              <button 
                onClick={() => submitUserSOS('Fire')}
                style={{ padding: '16px', background: 'rgba(249, 115, 22, 0.1)', border: '1px solid #f97316', borderRadius: '16px', color: '#f97316', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <Flame size={32} />
                <span style={{ fontWeight: 'bold' }}>Fire</span>
              </button>
              <button 
                onClick={() => submitUserSOS('Other')}
                style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--card-border)', borderRadius: '16px', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <Activity size={32} />
                <span style={{ fontWeight: 'bold' }}>Other</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Food Ordering Modals */}
      {orderingStall && (
        <FoodMenuModal 
          stall={orderingStall}
          cart={cart}
          setCart={setCart}
          onCheckout={() => setShowPaymentModal(true)}
          onClose={() => setOrderingStall(null)}
        />
      )}

      {showPaymentModal && (
        <PaymentModal 
          total={cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
          onConfirm={handleConfirmOrder}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {showNotifications && (
        <NotificationCenter 
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onClearAll={() => setNotifications([])}
          onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
          onAction={handleNotificationAction}
        />
      )}

      {showAdminMenu && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setShowAdminMenu(false)}>
          <div 
            style={{ 
              background: 'var(--bg-dark)', 
              width: '100%', 
              maxWidth: '420px', 
              borderRadius: '30px 30px 0 0', 
              padding: '2rem', 
              borderTop: '1px solid var(--card-border)', 
              boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Account & Settings</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>{role}</span>
                  {role === 'admin' && <ShieldAlert size={12} color="var(--primary)" />}
                </div>
              </div>
              <button 
                onClick={() => setShowAdminMenu(false)} 
                aria-label="Close settings"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={24} aria-hidden="true" />
              </button>
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
                  <div style={{ height: '1.5rem' }}></div>

                  <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>Simulation & Data</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={() => setIsSimulating(!isSimulating)}
                      style={{ width: '100%', padding: '0.8rem', background: isSimulating ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isSimulating ? '#10b981' : 'rgba(255,255,255,0.1)'}`, color: isSimulating ? '#10b981' : 'white', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      {isSimulating ? <><Square size={16} /> Stop Live Simulation</> : <><Play size={16} /> Start Live Simulation</>}
                    </button>
                    
                    <button
                      onClick={handleSeedData}
                      disabled={isSeeding || zones.length > 0}
                      style={{ width: '100%', padding: '0.8rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: zones.length > 0 ? 0.5 : 1 }}
                    >
                      {isSeeding ? <Loader2 size={16} className="spin" /> : <Database size={16} />} 
                      {zones.length > 0 ? "Data Already Seeded" : "Initial Data Seed"}
                    </button>
                  </div>
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
        {(isEmergency || sosState !== 'idle') && (
          <div style={{ padding: '1rem 1rem 0 1rem' }}>
            <div className="emergency-banner" style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', padding: '12px', borderRadius: '12px', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-main)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem' }}>🚨 <strong>{sosState === 'active' ? 'SECURITY DISPATCHED' : sosState === 'dispatching' ? 'SOS TRANSMITTING' : (activeEmergencyPayload || 'CRITICAL EMERGENCY')}</strong></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sosState !== 'idle' ? 'Personnel are tracking your location. Stay where you are.' : 'Follow safe route to Gate 2 (Pavillion)'}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(sosState === 'active' || sosState === 'dispatching') && (
                    <button
                      onClick={() => handleResolveSOS(sosState === 'active' ? 'resolved' : 'revoked')}
                      style={{ background: sosState === 'active' ? 'var(--status-clear)' : 'rgba(255,255,255,0.1)', color: 'var(--text-main)', border: '1px solid var(--card-border)', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      {sosState === 'active' ? 'Mark Resolved' : 'Revoke SOS'}
                    </button>
                  )}
                  <button
                    onClick={() => handleNavigation('Gate 2 (Pavillion)')}
                    style={{ background: '#ef4444', color: 'var(--text-inverse)', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 10px rgba(239, 68, 68, 0.4)' }}
                  >
                    {sosState !== 'idle' ? 'Your Location' : 'Evacuation Route'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'home' && (
          <>
            <section className="map-section">
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
                      <>
                        <button
                          style={{ flex: 1, padding: '10px 4px', border: 'none', borderRadius: '10px', background: homeTab === 'interact' ? 'rgba(59, 130, 246, 0.2)' : 'transparent', color: homeTab === 'interact' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: '600', transition: 'all 0.2s', cursor: 'pointer', fontSize: '0.8rem' }}
                          onClick={() => setHomeTab('interact')}
                        >
                          Interact
                        </button>
                        <button
                          style={{ flex: 1, padding: '10px 4px', border: 'none', borderRadius: '10px', background: homeTab === 'queue' ? 'rgba(59, 130, 246, 0.2)' : 'transparent', color: homeTab === 'queue' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: '600', transition: 'all 0.2s', cursor: 'pointer', fontSize: '0.8rem' }}
                          onClick={() => setHomeTab('queue')}
                        >
                          Queue
                        </button>
                      </>
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
                  {homeTab === 'queue' && (
                    <section style={{ padding: '0 1rem' }}>
                      <FacilityQueueManager stalls={stalls} onNavigate={handleNavigation} />
                    </section>
                  )}
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

        {activeTab === 'food' && (
          <section className="queue-section" style={{ padding: '1rem' }}>
            <QueueManager 
              stalls={stalls} 
              onNavigate={handleNavigation} 
              onOrder={handleStartOrder}
              onClearOrder={handleClearOrder}
              activeOrders={activeOrders}
            />
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
        <nav className="bottom-nav" aria-label="Main Navigation">
          <button 
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} 
            onClick={() => setActiveTab('home')}
            aria-label="Home Dashboard"
          >
            <Home size={22} aria-hidden="true" />
            <span>Home</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'food' ? 'active' : ''}`} 
            onClick={() => setActiveTab('food')}
            aria-label="Food Corner"
          >
            <Utensils size={22} aria-hidden="true" />
            <span>Food</span>
          </button>
          {isCheckedIn && (
            <>
              <button
                className={`nav-item ${activeTab === 'sos' ? 'active' : ''}`}
                onClick={handleSOS}
                aria-label="Trigger Emergency SOS"
                style={{ color: sosState !== 'idle' ? 'var(--status-congested)' : 'var(--text-muted)' }}
              >
                <AlertOctagon size={24} className={sosState === 'dispatching' ? 'pulse' : ''} aria-hidden="true" />
                <span style={{ fontWeight: sosState !== 'idle' ? 'bold' : 'normal' }}>SOS</span>
              </button>
            </>
          )}
          <button 
            className={`nav-item ${activeTab === 'tickets' ? 'active' : ''}`} 
            onClick={() => setActiveTab('tickets')}
            aria-label="Tickets and Check-in"
          >
            <Ticket size={22} aria-hidden="true" />
            <span>Tickets</span>
          </button>
        </nav>
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
                { id: 'fire', label: 'Fire', icon: <Flame size={20} />, color: '#ef4444' },
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
