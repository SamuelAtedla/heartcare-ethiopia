import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axiosConfig'; // Your pre-configured axios instance

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check if user is logged in on page load/refresh
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Backend should verify the JWT cookie and return user data
        const response = await axios.get('/auth/me');
        setUser(response.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  // 2. Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      setUser(response.data.user); // Contains { id, role, name }
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  // 3. Logout function
  const logout = async () => {
    try {
      await axios.post('/auth/logout');
      setUser(null);
      window.location.href = '/login';
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // 4. Role-based access helper
  const isDoctor = () => user?.role === 'doctor';
  const isPatient = () => user?.role === 'patient';

  return (
    <AuthContext.Provider value={{ user, login, logout, isDoctor, isPatient, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

