import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aaleestudio_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);

  const fetchSettings = async () => {
    try {
      const { data } = await API.get('/admin/settings');
      setSiteSettings(data);
    } catch (err) {
      console.error('Failed to load site settings:', err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('aaleestudio_user', JSON.stringify(data));
      toast.success(`Welcome back, ${data.name}!`);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      throw new Error(msg);
    }
  };

  const register = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', { name, email, password, phone });
      setUser(data);
      localStorage.setItem('aaleestudio_user', JSON.stringify(data));
      toast.success(`Account registered successfully! Welcome ${data.name}`);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aaleestudio_user');
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        siteSettings,
        fetchSettings,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
