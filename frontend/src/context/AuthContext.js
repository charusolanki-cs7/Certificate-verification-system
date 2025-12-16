import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedAdmin = localStorage.getItem('admin');

      if (storedToken && storedAdmin) {
        try {
          setToken(storedToken);
          setAdmin(JSON.parse(storedAdmin));
        } catch (error) {
          console.error('Error parsing stored admin data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('admin');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, data } = response.data;
      
      setToken(token);
      setAdmin(data.admin);
      
      localStorage.setItem('token', token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
      
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, data } = response.data;
      
      setToken(token);
      setAdmin(data.admin);
      
      localStorage.setItem('token', token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
      
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  };

  const value = {
    admin,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
