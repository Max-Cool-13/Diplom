import React, { useState, useEffect } from 'react';
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

          // Если это клиент, показываем его собственные записи
          if (response.data.role === 'client') {
            const appointmentResponse = await api.get('/appointments/history/', {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            setAppointments(appointmentResponse.data); // Сохраняем историю записей для клиента
          }

          // Если это мастер, показываем записи, где он указан как мастер
          if (response.data.role === 'master') {
            const appointmentResponse = await api.get(`/appointments/master/${response.data.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            setAppointments(appointmentResponse.data); // Сохраняем записи мастера
          }

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

  const handleStatusChange = async (appointmentId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      // Статус должен быть строкой: 'not_completed' или 'completed'
      if (!['not_completed', 'completed'].includes(newStatus)) {
        throw new Error('Неверное значение статуса');
      }

      await api.patch(`/appointments/${appointmentId}/status`, {
        status: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Обновляем статус записи в состоянии
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
      alert('Статус записи успешно обновлен');
    } catch (err) {
      console.error('Ошибка при обновлении статуса записи', err);  // Логируем подробности ошибки
      // Обрабатываем ошибку и выводим текстовое сообщение
      const errorMessage = err.response?.data?.detail || err.message || 'Неизвестная ошибка';
      setError(`Не удалось обновить статус записи: ${errorMessage}`);
    }
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
                    className="w-full px-4 py-2 rounded border text-black"
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
                    className="w-full px-4 py-2 rounded border text-black"
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
                    className="w-full px-4 py-2 rounded border text-black"
                    value={updatedPassword}
                    onChange={(e) => setUpdatedPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#00baff] hover:bg-[#8a2be2] text-white py-2 rounded"
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
                  className="mt-4 w-full py-2 bg-[#00baff] hover:bg-[#8a2be2] text-white rounded"
                >
                  Редактировать профиль
                </button>
              </div>
            )}

            <h3 className="text-2xl mt-6 mb-4 text-[#00baff]">История записей</h3>
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

                    {/* Кнопка для изменения статуса */}
                    {user.role === 'master' && (
                      <div className="mt-2">
                        <label htmlFor={`status-${appointment.id}`} className="mr-2">Изменить статус:</label>
                        <select
                          id={`status-${appointment.id}`}
                          value={appointment.status}
                          onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                          className="px-2 py-1 rounded border"
                        >
                          <option value="not_completed">Не выполнен</option>
                          <option value="completed">Выполнен</option>
                        </select>
                      </div>
                    )}

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
