import React, { useState, useEffect, createContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config'; 

export const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, userAuth => {
      setUser(userAuth);
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
