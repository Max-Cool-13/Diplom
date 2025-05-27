import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Создаем объект для отправки данных в формате x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('username', email);  // Используем 'username', хотя это email
    formData.append('password', password);

    try {
      // Отправляем данные с правильным заголовком
      const response = await axios.post(
        `${API_URL}/login/`,
        formData,  // передаем formData
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // указываем правильный тип контента
          },
        }
      );

      // Сохраняем токен в localStorage
      localStorage.setItem('token', response.data.access_token);

      // Редиректим на страницу профиля
      navigate('/profile');
      
      // Перезагружаем страницу после успешного входа
      window.location.reload();
    } catch (err) {
      setError('Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Удаляем токен при выходе
    localStorage.removeItem('token');
    // Редирект на страницу входа
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Вход</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 rounded text-white font-semibold"
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Войти'}
          </button>
        </form>
        {localStorage.getItem('token') && (
          <div className="mt-4">
            <p className="text-green-400 text-sm">Успешный вход! Токен сохранён.</p>
            <button
              onClick={handleLogout}
              className="mt-2 w-full py-3 bg-gray-600 hover:bg-gray-700 rounded text-white font-semibold"
            >
              Выйти
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
