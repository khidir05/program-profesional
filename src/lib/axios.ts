import axios from 'axios';

// Siapkan base URL yang mudah diubah atau diambil dari environment variable
let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Bersihkan baseURL jika berakhiran /api/ atau /api agar tidak terjadi penumpukan path /api/api/ pada request
if (baseURL.endsWith('/api/')) {
  baseURL = baseURL.slice(0, -5);
} else if (baseURL.endsWith('/api')) {
  baseURL = baseURL.slice(0, -4);
}

const api = axios.create({
  baseURL: baseURL,
});

// Interceptor untuk menyisipkan Token di setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;