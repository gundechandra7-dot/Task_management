// src/AuthContext.js
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login - in real app, validate against backend
    if (email && password) {
      const user = { email, id: Date.now().toString() };
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return Promise.resolve();
    }
    return Promise.reject(new Error('Invalid credentials'));
  };

  const signup = async (email, password) => {
    // Mock signup
    if (email && password) {
      const user = { email, id: Date.now().toString() };
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return Promise.resolve();
    }
    return Promise.reject(new Error('Signup failed'));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = useMemo(() => ({ currentUser, login, signup, logout }), [currentUser]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};