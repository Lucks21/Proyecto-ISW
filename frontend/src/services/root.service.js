import axios from 'axios';

const API_URL = 'http://localhost:3200/api';

const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Asegúrate de que la clave coincida con la utilizada en auth.service.js
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
