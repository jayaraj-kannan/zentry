import { db } from './firebaseConfig';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  addDoc,
  getDocs,
  query,
  limit,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';

/**
 * Seed initial stadium data into Firestore
 */
export const seedInitialData = async (initialZones, initialStalls, parkingLots) => {
  console.log('Seeding stadium data...');
  
  // Seed Zones
  for (const zone of initialZones) {
    await setDoc(doc(db, 'zones', zone.id.toString()), zone);
  }

  // Seed Stalls
  for (const stall of initialStalls) {
    await setDoc(doc(db, 'stalls', stall.id.toString()), stall);
  }

  // Seed Parking Lots
  for (const lot of parkingLots) {
    await setDoc(doc(db, 'parking_lots', lot.id.toString()), lot);
  }
  
  console.log('Seeding complete!');
};

/**
 * Simulate live crowd dynamics by randomly updating densities and wait times
 */
export const simulateCrowdDynamics = async () => {
  // Randomly update 2 zones
  const zonesSnapshot = await getDocs(collection(db, 'zones'));
  const zones = zonesSnapshot.docs;
  for (let i = 0; i < 2; i++) {
    const randomZone = zones[Math.floor(Math.random() * zones.length)];
    const newDensity = Math.max(10, Math.min(95, randomZone.data().density + (Math.random() > 0.5 ? 5 : -5)));
    const status = newDensity > 80 ? 'congested' : newDensity > 40 ? 'moderate' : 'clear';
    await updateDoc(randomZone.ref, { density: newDensity, status });
  }

  // Randomly update 2 stalls wait times
  const stallsSnapshot = await getDocs(collection(db, 'stalls'));
  const stalls = stallsSnapshot.docs;
  for (let i = 0; i < 2; i++) {
    const randomStall = stalls[Math.floor(Math.random() * stalls.length)];
    const currentWait = randomStall.data().waitTime || 5;
    const newWait = Math.max(2, Math.min(30, currentWait + (Math.random() > 0.5 ? 2 : -2)));
    await updateDoc(randomStall.ref, { waitTime: newWait });
  }

  // Randomly update 1 parking lot occupancy
  const parkingSnapshot = await getDocs(collection(db, 'parking_lots'));
  const lots = parkingSnapshot.docs;
  if (lots.length > 0) {
    const randomLot = lots[Math.floor(Math.random() * lots.length)];
    const currentOcc = randomLot.data().occupancy || 50;
    const newOcc = Math.max(10, Math.min(99, currentOcc + (Math.random() > 0.5 ? 3 : -3)));
    await updateDoc(randomLot.ref, { occupancy: newOcc });
  }
};

/**
 * Report a new SOS alert from the user
 */
export const reportSosAlert = async (userId, userEmail, reason) => {
  const alertRef = doc(collection(db, 'sos_alerts'));
  await setDoc(alertRef, {
    userId,
    userEmail,
    reason,
    status: 'active',
    timestamp: new Date().toISOString()
  });
  return alertRef.id;
};

/**
 * Mark an SOS alert as resolved
 */
export const resolveSosAlert = async (alertId, status = 'resolved') => {
  if (!alertId) return;
  const alertRef = doc(db, 'sos_alerts', alertId);
  await updateDoc(alertRef, {
    status: status,
    resolvedAt: new Date().toISOString()
  });
};

/**
 * Fetch the most recent active SOS alert for a user
 */
export const getActiveUserSos = async (userId) => {
  if (!userId) return null;
  // Use a simpler query that doesn't require composite indexes
  const q = query(
    collection(db, 'sos_alerts'),
    where('userId', '==', userId)
  );
  
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;

  // Filter and sort in memory to avoid index requirements
  const activeAlerts = querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(alert => alert.status === 'active')
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return activeAlerts.length > 0 ? activeAlerts[0] : null;
};

/**
 * Place a new food order
 */
export const placeFoodOrder = async (orderData) => {
  const orderRef = collection(db, 'food_orders');
  const newOrder = {
    ...orderData,
    status: 'pending', // pending, ready, picked_up
    timestamp: serverTimestamp()
  };
  const docRef = await addDoc(orderRef, newOrder);
  return docRef.id;
};

/**
 * Subscribe to a user's active food orders
 */
export const subscribeToUserOrders = (userId, callback) => {
  if (!userId) return () => {};
  
  // Basic query to avoid composite index requirements
  const q = query(
    collection(db, 'food_orders'),
    where('userId', '==', userId)
  );

  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      // Filter 'pending' and 'ready' in memory
      .filter(order => ['pending', 'ready'].includes(order.status))
      // Sort by timestamp desc in memory
      .sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeB - timeA;
      });
      
    callback(orders);
  });
};

/**
 * Update a food order status (e.g., to 'ready')
 */
export const updateFoodOrderStatus = async (orderId, status) => {
  if (!orderId) return;
  const orderRef = doc(db, 'food_orders', orderId);
  await updateDoc(orderRef, { status });
};
