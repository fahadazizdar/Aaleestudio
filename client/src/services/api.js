import axios from 'axios';

const backendUrl = import.meta.env.VITE_API_URL || 'https://aaleestudio.vercel.app/api';

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
