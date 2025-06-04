import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Импортируем настроенный axios-клиент

const Profile = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]); // Для хранения истории записей
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
        <h2 className="text-3xl font-bold mb-6 text-center">Профиль</h2>
        {user ? (
          <div>
            <p><strong>Имя:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>

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
