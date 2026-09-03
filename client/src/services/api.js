import axios from 'axios';

// Reads VITE_API_URL from Vercel / environment variables, defaulting to '/api' for proxy/relative routing
const backendUrl = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
  baseURL: backendUrl
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('aaleestudio_user') || 'null');
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;
