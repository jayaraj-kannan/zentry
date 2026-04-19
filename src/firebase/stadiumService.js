import { db } from './firebaseConfig';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDocs,
  query,
  limit 
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
    timestamp: new Date().toISOString()
  });
  return alertRef.id;
};
