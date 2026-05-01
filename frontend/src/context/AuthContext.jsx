import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    try {
      const response = await axios.get(`${apiUrl}/api/auth/me`, { withCredentials: true });
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      // Logout both just in case, or detect role
      const endpoint = user?.role === 'foodPartner' ? '/api/auth/food-partner/logout' : '/api/auth/user/logout';
      await axios.get(`${apiUrl}${endpoint}`, { withCredentials: true });
      setUser(null);
      window.location.reload(); // Hard refresh to clear all states
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
