import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (phone, password) => {
    try {
      // Create simplified payload for prototype without real backend
      // In real app: const res = await axiosInstance.post('/auth/login', { phone, password });

      // MOCK LOGIC FOR PROTOTYPE
      let mockRole = 'patient';
      if (phone === '0911223344') mockRole = 'doctor'; // Mock doctor account

      const mockUser = {
        name: 'Test User',
        phone,
        role: mockRole,
        token: 'mock-jwt-token-' + Date.now()
      };

      localStorage.setItem('token', mockUser.token);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const register = async (userData) => {
    // MOCK LOGIC
    const mockUser = {
      name: userData.name,
      phone: userData.phone,
      role: 'patient',
      token: 'mock-jwt-token-' + Date.now()
    };

    localStorage.setItem('token', mockUser.token);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
