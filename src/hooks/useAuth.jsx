import { useState, useEffect, createContext, useContext } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserInfo(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserInfo(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email, password, userData) => {
    try {
      console.log("Starting signup...", { email, userData });
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User created successfully", user);
      
      // If we have display name data
      if (userData.firstName && userData.lastName) {
        await updateProfile(user, {
          displayName: `${userData.firstName} ${userData.lastName}`
        });
      }
      
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        gender: userData.gender || '',
        age: userData.age || '',
        email: user.email,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      
      return user;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logIn = async (email, password) => {
    try {
      console.log("Starting login...", { email });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful", userCredential.user);
      
      // Update last login timestamp
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          lastLogin: serverTimestamp()
        }, { merge: true });
      } catch (error) {
        console.error("Error updating last login:", error);
      }
      
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logOut = () => {
    return signOut(auth);
  };

  const signInWithGoogle = async () => {
    try {
      console.log("Starting Google sign in...");
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      console.log("Google sign in successful", user);
      
      // Check if the user document exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create a new user document for Google sign-ins
        await setDoc(doc(db, 'users', user.uid), {
          firstName: user.displayName ? user.displayName.split(' ')[0] : '',
          lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : '',
          email: user.email,
          photoURL: user.photoURL || '',
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          authProvider: 'google'
        });
      } else {
        // Update last login timestamp
        await setDoc(doc(db, 'users', user.uid), {
          lastLogin: serverTimestamp()
        }, { merge: true });
      }
      
      return user;
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  };

  // New methods for user profile management
  const reauthenticateUser = async (currentPassword) => {
    if (!user) throw new Error('No user is logged in.');
    
    try {
      console.log("Attempting to reauthenticate user...");
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      console.log("User reauthenticated successfully");
      return true;
    } catch (error) {
      console.error("Reauthentication error:", error);
      throw error;
    }
  };

  const updateUserEmailInAuth = async (newEmail) => {
    if (!user) throw new Error('No user is logged in.');
    
    try {
      console.log("Attempting to update user email...");
      await updateEmail(user, newEmail);
      
      // Update the email in Firestore too
      await setDoc(doc(db, 'users', user.uid), {
        email: newEmail
      }, { merge: true });
      
      console.log("User email updated successfully");
      return true;
    } catch (error) {
      console.error("Email update error:", error);
      throw error;
    }
  };

  const updateUserPasswordInAuth = async (newPassword) => {
    if (!user) throw new Error('No user is logged in.');
    
    try {
      console.log("Attempting to update user password...");
      await updatePassword(user, newPassword);
      console.log("User password updated successfully");
      return true;
    } catch (error) {
      console.error("Password update error:", error);
      throw error;
    }
  };

  const value = {
    user,
    userInfo,
    loading,
    signUp,
    logIn,
    logOut,
    signInWithGoogle,
    reauthenticateUser,
    updateUserEmailInAuth,
    updateUserPasswordInAuth
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
} 