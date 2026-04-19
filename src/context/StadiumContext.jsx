import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const StadiumContext = createContext();

export const useStadium = () => useContext(StadiumContext);

export const StadiumProvider = ({ children }) => {
  const [zones, setZones] = useState([]);
  const [stalls, setStalls] = useState([]);
  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Zones
    const unsubscribeZones = onSnapshot(query(collection(db, 'zones')), {
      next: (snapshot) => {
        const zonesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setZones(zonesData);
      },
      error: (err) => console.error("Zones listener error:", err)
    });

    // Listen for Stalls
    const unsubscribeStalls = onSnapshot(query(collection(db, 'stalls')), {
      next: (snapshot) => {
        const stallsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStalls(stallsData);
      },
      error: (err) => console.error("Stalls listener error:", err)
    });

    // Listen for Parking Lots
    const unsubscribeParking = onSnapshot(query(collection(db, 'parking_lots')), {
      next: (snapshot) => {
        const parkingData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setParkingLots(parkingData);
        setLoading(false);
      },
      error: (err) => {
        console.error("Parking listener error:", err);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeZones();
      unsubscribeStalls();
      unsubscribeParking();
    };
  }, []);

  const value = {
    zones,
    stalls,
    parkingLots,
    loading
  };

  return (
    <StadiumContext.Provider value={value}>
      {children}
    </StadiumContext.Provider>
  );
};
