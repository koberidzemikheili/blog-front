import axios from 'axios';
import { useRouter } from 'vue-router';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

const router = useRouter();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response.status === 401) {
    localStorage.removeItem('token');
    router.push('/login');
  }
  return Promise.reject(error);
});

export default api;