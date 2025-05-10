import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Импортируем настроенный axios-клиент

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login'); // Если токен отсутствует, редирект на страницу входа
    } else {
      // Если токен есть, получаем информацию о пользователе с бэкенда
      const fetchUserData = async () => {
        try {
          const response = await api.get('/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          setUser(response.data); // Сохраняем данные пользователя
        } catch (err) {
          setError('Ошибка получения данных пользователя');
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [navigate]);

  if (loading) {
    return <div>Загрузка...</div>; // Пока загружаются данные
  }

  if (error) {
    return <div>{error}</div>; // Если ошибка при получении данных
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Профиль</h2>
        {user ? (
          <div>
            <p><strong>Имя:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button
              onClick={() => {
                localStorage.removeItem('token'); // Удаляем токен при выходе
                navigate('/login'); // Редирект на страницу входа
              }}
              className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold"
            >
              Выйти
            </button>
          </div>
        ) : (
          <p>Пользователь не найден</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
