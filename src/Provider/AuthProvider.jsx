import React, { useEffect, useState } from 'react';
import AuthContext from '../Context/AuthContext';
import auth from '../firebase/firebase.config';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const userLogin = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  }

  const profileUpdate = (profile) => {
    setLoading(true)
    return updateProfile(auth.currentUser, profile);
  }

  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider)
  }

  const logout = () => {
    setLoading(true)
    return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      console.log('user data-->', currentUser);
      setUser(currentUser);
      setLoading(false);
    })
    return () => {
      unsubscribe();
    }

  }, []);


  const userInfo = {
    user,
    loading,
    setLoading,
    createUser,
    userLogin,
    profileUpdate,
    logout,
    googleLogin
  }
  return (
    <AuthContext.Provider value={userInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;