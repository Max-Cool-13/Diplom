import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Импортируем настроенный axios-клиент

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна
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

  const handleLogoutClick = () => {
    setIsModalOpen(true); // Открытие модального окна
  };

  const logout = () => {
    localStorage.removeItem('token'); // Удаляем токен при выходе
    setIsModalOpen(false); // Закрытие модального окна
    window.location.reload(); // Полная перезагрузка страницы для обновления состояния
  };

  const cancelLogout = () => {
    setIsModalOpen(false); // Закрытие модального окна
  };

  if (loading) {
    return <div>Загрузка...</div>; // Пока загружаются данные
  }

  if (error) {
    return <div>{error}</div>; // Если ошибка при получении данных
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#00baff]">Профиль</h2>
        {user ? (
          <div>
            <p><strong>Имя:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button
              onClick={handleLogoutClick} // Открытие модального окна
              className="mt-4 w-full py-2 bg-red-500 hover:bg-red-700 rounded text-white font-semibold"
            >
              Выйти
            </button>
          </div>
        ) : (
          <p>Пользователь не найден</p>
        )}
      </div>

      {/* Модальное окно для подтверждения выхода */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <p className="text-lg mb-4 text-center">Вы уверены, что хотите выйти?</p>
            <div className="flex justify-between space-x-2">
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded w-full"
              >
                Да
              </button>
              <button
                onClick={cancelLogout}
                className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded w-full"
              >
                Нет
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
