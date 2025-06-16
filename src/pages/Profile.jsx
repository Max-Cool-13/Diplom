import React, { useState, useEffect } from 'react';
import api from '../api'; // Импортируем настроенный axios-клиент
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Импортируем useTheme для работы с темой

const Profile = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]); // Для хранения истории записей
  const [users, setUsers] = useState([]); // Для хранения списка пользователей
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Состояние для редактирования профиля
  const [updatedName, setUpdatedName] = useState(''); // Для редактируемого имени
  const [updatedEmail, setUpdatedEmail] = useState(''); // Для редактируемого email
  const [updatedPassword, setUpdatedPassword] = useState(''); // Для редактируемого пароля
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Для выбранной записи
  const [modalOpen, setModalOpen] = useState(false); // Состояние для открытия модального окна
  const [masterName, setMasterName] = useState(''); // Для имени мастера
  const navigate = useNavigate();
  const { isDarkMode } = useTheme(); // Получаем текущую тему

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login'); // Если токен отсутствует, редирект на страницу входа
    } else {
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

          if (response.data.role === 'client') {
            const appointmentResponse = await api.get('/appointments/history/', {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            setAppointments(appointmentResponse.data); // Сохраняем историю записей для клиента
          }

          if (response.data.role === 'master') {
            const appointmentResponse = await api.get(`/appointments/master/${response.data.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            setAppointments(appointmentResponse.data); // Сохраняем записи мастера
          }

          // Загружаем список всех пользователей только для админа
          if (response.data.role === 'admin') {
            const userResponse = await api.get('/users/', {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            setUsers(userResponse.data); // Сохраняем всех пользователей
          }
        } catch (err) {
          setError('Ошибка получения данных пользователя или истории записей');
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, []);

  // Получение имени мастера по ID
  const fetchMasterName = async (masterId) => {
    try {
      const response = await api.get(`/users/${masterId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMasterName(response.data.username); // Устанавливаем имя мастера
    } catch (err) {
      console.error('Ошибка при получении данных мастера', err);
    }
  };

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
        if (!['not_completed', 'completed'].includes(newStatus)) {
            throw new Error('Неверное значение статуса');
        }

        await api.patch(`/appointments/${appointmentId}/status`, {
            status: newStatus  // Отправляем статус в теле запроса
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'  // Убедитесь, что тип контента правильный
            },
        });

        setAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
                appointment.id === appointmentId
                    ? { ...appointment, status: newStatus }
                    : appointment
            )
        );

        alert('Статус записи успешно обновлен');
    } catch (err) {
        const errorMessage = err.response?.data ? JSON.stringify(err.response.data) : err.message || 'Неизвестная ошибка';
        setError(`Не удалось обновить статус записи: ${errorMessage}`);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/appointments/${appointmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setAppointments(appointments.filter((appointment) => appointment.id !== appointmentId));
      alert('Запись успешно удалена');
    } catch (err) {
      setError('Не удалось удалить запись');
    }
  };

  const openModal = (appointment) => {
    setSelectedAppointment(appointment); // Устанавливаем выбранную запись
    setModalOpen(true); // Открываем модальное окно
    if (appointment.master_id) {
      fetchMasterName(appointment.master_id); // Если у записи есть master_id, получаем имя мастера
    }
  };

  const closeModal = () => {
    setModalOpen(false); // Закрываем модальное окно
    setSelectedAppointment(null); // Очищаем выбранную запись
    setMasterName(''); // Сбрасываем имя мастера
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

  const handleEditUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get(`/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      // Можно добавить логику для редактирования пользователей здесь
      // Открытие формы с данными пользователя для редактирования
    } catch (err) {
      setError('Ошибка при получении данных пользователя');
    }
  };

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.id !== userId));
      alert('Пользователь успешно удален');
    } catch (err) {
      setError('Не удалось удалить пользователя');
    }
  };

  if (loading) {
    return <div>Загрузка...</div>; // Пока загружаются данные
  }

  if (error) {
    return <div>{error}</div>; // Если ошибка при получении данных
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} text-white flex items-center justify-center p-6`}>
      <div className={`p-8 rounded shadow-lg w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <h2 className={`text-3xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-[#050272]'}`}>Профиль</h2>
        
        {user ? (
          <div>
             {(user.role === 'master' || user.role === 'admin') && (
              <Link
                to="/top_masters"  // Ссылка для перехода на страницу "top_masters"
                className={`w-full py-2 ${isDarkMode ? 'bg-[#00baff] hover:bg-[#8a2be2]' : 'bg-[#8a2be2] hover:bg-[#892be2d8]'} text-white rounded mt-4 block text-center`}
              >
                Перейти к топ-мастерам
              </Link>
                )}
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="username" className={`${isDarkMode ? 'text-gray-300 mb-1' : 'text-[#050272] mb-1'}`}>Имя</label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Имя"
                    className={`w-full px-4 py-2 rounded border ${isDarkMode ? 'border-[#00baff] bg-gray-700 text-white focus:ring-[#00baff]' : 'border-[#8a2be2] bg-white text-gray-700 focus:ring-[#8a2be2]'}`}
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="email" className={`${isDarkMode ? 'text-gray-300 mb-1' : 'text-[#050272] mb-1'}`}>Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    className={`w-full px-4 py-2 rounded border ${isDarkMode ? 'border-[#00baff] bg-gray-700 text-white focus:ring-[#00baff]' : 'border-[#8a2be2] bg-white text-gray-700 focus:ring-[#8a2be2]'}`}
                    value={updatedEmail}
                    onChange={(e) => setUpdatedEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="password" className={`${isDarkMode ? 'text-gray-300 mb-1' : 'text-[#050272] mb-1'}`}>Новый пароль</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Новый пароль"
                    className={`w-full px-4 py-2 rounded border ${isDarkMode ? 'border-[#00baff] bg-gray-700 text-white focus:ring-[#00baff]' : 'border-[#8a2be2] bg-white text-gray-700 focus:ring-[#8a2be2]'}`}
                    value={updatedPassword}
                    onChange={(e) => setUpdatedPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-2 rounded ${isDarkMode ? 'bg-[#00baff] hover:bg-[#00bbffcf] text-white' : 'bg-[#8a2be2] hover:bg-[#892be2d8] text-white'} text-lg`}
                >
                  Сохранить изменения
                </button>
              </form>
            ) : (
              <div>
                <p className={`${isDarkMode ? 'text-white' : 'text-[#050272]'}`}><strong>Имя:</strong> {user.username}</p>
                <p className={`${isDarkMode ? 'text-white' : 'text-[#050272]'}`}><strong>Email:</strong> {user.email}</p>

                <button
                  onClick={() => setIsEditing(true)}
                  className={`mt-4 w-full py-2 ${isDarkMode ? 'bg-[#00baff] hover:bg-[#8a2be2]' : 'bg-[#8a2be2] hover:bg-[#892be2d8]'} text-white rounded`}
                >
                  Редактировать профиль
                </button>
              </div>
            )}

            <h3 className={`text-2xl mt-6 mb-4 ${isDarkMode ? 'text-[#00baff]' : 'text-[#050372]'}`}>История записей</h3>
            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div key={appointment.id} className={`bg-gray-700 p-4 rounded ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    <p className={`${isDarkMode ? 'text-white' : 'text-[#050272]'}`}><strong>Услуга:</strong> {appointment.service.name}</p>
                    <p className={`${isDarkMode ? 'text-white' : 'text-[#050272]'}`}><strong>Дата:</strong> {new Date(appointment.appointment_time).toLocaleString()}</p>
                    <p className={`${isDarkMode ? 'text-white' : 'text-[#050272]'}`}>
                      <strong>Статус:</strong>
                      <span className={getStatusClass(appointment.status)}>
                        {appointment.status === 'not_completed' ? 'не выполнен' : 'выполнен'}
                      </span>
                    </p>

                    {/* Кнопка "Подробнее" для отображения подробностей */}
                    <button
                      onClick={() => openModal(appointment)} // Открыть модальное окно с деталями
                      className={`mt-2 py-2 px-4 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded`}
                    >
                      Подробнее
                    </button>

                    {user.role === 'client' && appointment.status !== 'completed' && (
                      <button
                        onClick={() => handleDeleteAppointment(appointment.id)} // Теперь передаем корректный id
                        className={`mt-2 py-2 px-4 ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white rounded`}
                      >
                        Удалить запись
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className={`${isDarkMode ? 'text-white' : 'text-[#050272]'}`}>У вас нет записей.</p>
              )}
            </div>
           
          </div>
        ) : (
          <p className={`${isDarkMode ? 'text-white' : 'text-[#050272]'}`}>Пользователь не найден</p>
        )}
      </div>

      {/* Модальное окно с деталями записи */}
      {modalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className={`bg-white p-6 rounded w-96 ${isDarkMode ? 'text-black' : 'text-black'}`}>
            <h3 className="text-2xl mb-4">Детали записи</h3>
            <p className={`${isDarkMode ? 'text-white' : 'text-[#050272]'}`}><strong>Услуга:</strong> {selectedAppointment.service.name}</p>
            <p className={`${isDarkMode ? 'text-white' : 'text-[#050272]'}`}><strong>Дата:</strong> {new Date(selectedAppointment.appointment_time).toLocaleString()}</p>
            <p className={`${isDarkMode ? 'text-white' : 'text-[#050272]'}`}><strong>Статус:</strong> {selectedAppointment.status === 'not_completed' ? 'Не выполнен' : 'Выполнен'}</p>
            <p className={`${isDarkMode ? 'text-white' : 'text-[#050272]'}`}><strong>Комментарий:</strong> {selectedAppointment.comment || 'Нет комментариев'}</p>
            <p className={`${isDarkMode ? 'text-white' : 'text-[#050272]'}`}><strong>Мастер:</strong> {masterName || 'Не указан'}</p> {/* Мастер */}
            <p className={`${isDarkMode ? 'text-white' : 'text-[#050272]'}`}><strong>Цена:</strong> {selectedAppointment.service.price} ₽</p>
            <p className={`${isDarkMode ? 'text-white' : 'text-[#050272]'}`}><strong>Клиент:</strong> {selectedAppointment.client_name}</p>
            <p className={`${isDarkMode ? 'text-white' : 'text-[#050272]'}`}><strong>Телефон:</strong> {selectedAppointment.client_phone}</p>
            <p className={`${isDarkMode ? 'text-white' : 'text-[#050272]'}`}><strong>Длительность:</strong> {selectedAppointment.service.duration} <strong>мин</strong></p>
            {/* Кнопка для изменения статуса */}
            {user.role === 'master' && (
              <div className="mt-4">
                <label htmlFor={`status-${selectedAppointment.id}`} className="mr-2">Изменить статус:</label>
                <select
                  id={`status-${selectedAppointment.id}`}
                  value={selectedAppointment.status}
                  onChange={(e) => handleStatusChange(selectedAppointment.id, e.target.value)}
                  className="px-2 py-1 rounded border"
                >
                  <option value="not_completed">Не выполнен</option>
                  <option value="completed">Выполнен</option>
                </select>
              </div>
            )}

            {/* Кнопка для закрытия модального окна */}
            <div className="mt-4 flex justify-between">
              <button
                onClick={closeModal}
                className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
