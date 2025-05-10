import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавление токена в заголовки запросов, если он есть в localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // Получаем токен из localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;  // Добавляем токен в заголовок
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
