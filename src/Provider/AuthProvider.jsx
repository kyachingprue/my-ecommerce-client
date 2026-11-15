import { useEffect, useState } from 'react';
import AuthContext from '../Context/AuthContext';
import auth from '../firebase/firebase.config';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();

  const createUser = async (email, password) => {
    setLoading(true);
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  }

  const userLogin = async (email, password) => {
    setLoading(true);
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  }

  const resetPassword = async (email) => {
    setLoading(true);
    try {
      return await sendPasswordResetEmail(auth, email);
    } finally {
      setLoading(false);
    }
  }

  const profileUpdate = async (profile) => {
    setLoading(true)
    try {
      return await updateProfile(auth.currentUser, profile);
    } finally {
      setLoading(false);
    }
  }

  const googleLogin = async () => {
    setLoading(true);
    try {
      return await signInWithPopup(auth, googleProvider);
    } finally {
      setLoading(false);
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      return await signOut(auth);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
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
    resetPassword,
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