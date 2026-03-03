import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient, { setAuthTokens, clearAuthTokens } from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await apiClient.get('/users/profile');
        setUser(response.data.data);
      } catch (error) {
        // No user logged in
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const signup = async (name, email, password) => {
    const response = await apiClient.post('/auth/register', { name, email, password });
    const { accessToken, refreshToken, user } = response.data.data;
    setAuthTokens(accessToken, refreshToken);
    setUser(user);
  };

  const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user } = response.data.data;
    setAuthTokens(accessToken, refreshToken);
    setUser(user);
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // ignore
    }
    clearAuthTokens();
    setUser(null);
  };

  const value = { user, loading, signup, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }