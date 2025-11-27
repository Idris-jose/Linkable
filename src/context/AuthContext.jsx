import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Generate a base username from email
function generateUsernameFromEmail(email) {
  return email.split("@")[0].toLowerCase();
}

// Create a unique username and save in Firestore
async function createUniqueUsername(userId, email) {
  let base = generateUsernameFromEmail(email);
  let username = base;
  let i = 1;

  while (true) {
    const ref = doc(db, "usernames", username);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      // Save in usernames collection
      await setDoc(ref, { userId });

      // Save in user's profile
      await setDoc(
        doc(db, "users", userId, "profile", "data"),
        { username },
        { merge: true }
      );

      return username;
    }

    // Append number if taken
    username = `${base}${i}`;
    i++;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // -------------------------
  // Google Sign-In
  // -------------------------
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Generate or fetch unique username
      const username = await createUniqueUsername(user.uid, user.email);

      return { user, username }; // Return both for immediate use
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  // -------------------------
  // Email / Password Sign-In
  // -------------------------
  const signInWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      const username = await createUniqueUsername(user.uid, user.email);

      return { user, username };
    } catch (error) {
      console.error("Error signing in with email:", error);
      throw error;
    }
  };

  // -------------------------
  // Email / Password Sign-Up
  // -------------------------
  const signUpWithEmail = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      const username = await createUniqueUsername(user.uid, user.email);

      return { user, username };
    } catch (error) {
      console.error("Error signing up with email:", error);
      throw error;
    }
  };

  // -------------------------
  // Logout
  // -------------------------
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
