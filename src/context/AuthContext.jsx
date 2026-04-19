import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch full user profile from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setProfileData(userDoc.data());
        } else {
          // Fallback for race conditions during first login
          setProfileData({ role: 'user' });
        }
      } else {
        setProfileData(null);
      }
      
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (displayName) {
        await updateProfile(user, { displayName });
    }

    const initialProfile = {
        uid: user.uid,
        email: user.email,
        displayName: displayName || '',
        role: 'user',
        createdAt: serverTimestamp()
    };

    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), initialProfile);
    setProfileData(initialProfile);

    return userCredential;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        const initialProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            role: 'user',
            createdAt: serverTimestamp()
        };
        await setDoc(userDocRef, initialProfile);
        setProfileData(initialProfile);
    } else {
        setProfileData(userDoc.data());
    }

    return result;
  };

  const updateProfileData = async (updates) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, updates);
    setProfileData(prev => ({ ...prev, ...updates }));
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    profileData,
    role: profileData?.role || 'user',
    signup,
    login,
    loginWithGoogle,
    logout,
    updateProfileData,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
