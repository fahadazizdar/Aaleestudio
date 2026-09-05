import axios from 'axios';

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

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('aaleestudio_user');
    }
    return Promise.reject(error);
  }
);

export default API;
