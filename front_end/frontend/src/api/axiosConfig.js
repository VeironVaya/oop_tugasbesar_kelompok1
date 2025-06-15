// File BARU: src/api/axiosConfig.js

import axios from 'axios';

// Buat instance axios baru
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

// Tambahkan interceptor (penadang) untuk request
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage sebelum setiap request dikirim
    const token = localStorage.getItem('authToken');
    if (token) {
      // Jika token ada, tambahkan ke header Authorization
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; // Lanjutkan request
  },
  (error) => {
    // Lakukan sesuatu jika ada error pada request
    return Promise.reject(error);
  }
);

export default api;