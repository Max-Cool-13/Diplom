import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Импортируем настроенный axios-клиент

const Profile = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]); // Для хранения истории записей
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Состояние для редактирования профиля
  const [updatedName, setUpdatedName] = useState(''); // Для редактируемого имени
  const [updatedEmail, setUpdatedEmail] = useState(''); // Для редактируемого email
  const [updatedPassword, setUpdatedPassword] = useState(''); // Для редактируемого пароля
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
          setUpdatedName(response.data.username); // Инициализируем редактируемое имя
          setUpdatedEmail(response.data.email); // Инициализируем редактируемый email

          // Получаем историю записей пользователя
          const appointmentResponse = await api.get('/appointments/history/', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          setAppointments(appointmentResponse.data); // Сохраняем историю записей
        } catch (err) {
          setError('Ошибка получения данных пользователя или истории записей');
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [navigate]);

  const getStatusClass = (status) => {
    if (status === 'not_completed') {
      return 'status-not-completed'; // Применяем класс для "не выполнен"
    } else if (status === 'completed') {
      return 'status-completed'; // Применяем класс для "выполнен"
    }
    return ''; // Если статус не "not_completed" и не "completed", возвращаем пустой класс
  };

  // Функция для обновления профиля
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await api.patch('/users/me', {
        username: updatedName,
        email: updatedEmail,
        password: updatedPassword,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setUser(response.data); // Обновляем информацию о пользователе
      setIsEditing(false); // Закрываем форму редактирования
      alert('Профиль успешно обновлен!');
    } catch (err) {
      setError('Ошибка при обновлении профиля');
    }
  };

  // Функция для удаления записи
  const deleteAppointment = async (appointmentId) => {
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/appointments/${appointmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      // После удаления обновляем список записей
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment.id !== appointmentId)
      );
      alert('Запись успешно удалена');
    } catch (err) {
      console.error('Ошибка при удалении записи', err);
      setError('Не удалось удалить запись');
    }
  };

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
            {/* Если редактируем профиль, показываем форму редактирования */}
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {/* Поле для имени */}
                <div className="flex flex-col">
                  <label htmlFor="username" className="text-gray-300 mb-1">Имя</label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Имя"
                    className="w-full px-4 py-2 rounded border text-black"  // Цвет шрифта черный
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    required
                  />
                </div>

                {/* Поле для email */}
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 rounded border text-black"  // Цвет шрифта черный
                    value={updatedEmail}
                    onChange={(e) => setUpdatedEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Поле для пароля */}
                <div className="flex flex-col">
                  <label htmlFor="password" className="text-gray-300 mb-1">Новый пароль</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Новый пароль"
                    className="w-full px-4 py-2 rounded border text-black"  // Цвет шрифта черный
                    value={updatedPassword}
                    onChange={(e) => setUpdatedPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-900 text-white py-2 rounded"
                >
                  Сохранить изменения
                </button>
              </form>
            ) : (
              <div>
                <p><strong>Имя:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>

                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Редактировать профиль
                </button>
              </div>
            )}

            <h3 className="text-2xl mt-6 mb-4">История записей</h3>
            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div key={appointment.id} className="bg-gray-700 p-4 rounded">
                    <p><strong>Услуга:</strong> {appointment.service.name}</p>
                    <p><strong>Дата:</strong> {new Date(appointment.appointment_time).toLocaleString()}</p>
                    <p>
                      <strong>Статус:</strong>
                      <span className={getStatusClass(appointment.status)}>
                        {appointment.status === 'not_completed' ? 'не выполнен' : 'выполнен'}
                      </span>
                    </p>

                    {/* Кнопка удаления записи */}
                    <button
                      onClick={() => deleteAppointment(appointment.id)}
                      className="mt-2 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Удалить запись
                    </button>
                  </div>
                ))
              ) : (
                <p>У вас нет записей.</p>
              )}
            </div>

            <button
              onClick={handleLogoutClick} // Открытие модального окна
              className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold"
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
