import React, { useState, useEffect } from 'react';
import api from '../api'; // Импортируем настроенный axios-клиент

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Функция для получения данных о пользователях и записях
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Если токен отсутствует, редирект на страницу входа
    } else {
      const fetchData = async () => {
        try {
          const userResponse = await api.get('/users/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const appointmentResponse = await api.get('/appointments/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          setUsers(userResponse.data); // Сохраняем всех пользователей
          setAppointments(appointmentResponse.data); // Сохраняем все записи
        } catch (err) {
          setError('Ошибка при загрузке данных');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, []);

  // Функция для удаления пользователя
  const deleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== userId));
      alert('Пользователь успешно удален');
    } catch (err) {
      setError('Не удалось удалить пользователя');
    }
  };

  // Функция для удаления записи
  const deleteAppointment = async (appointmentId) => {
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.filter((appointment) => appointment.id !== appointmentId));
      alert('Запись успешно удалена');
    } catch (err) {
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
    <div className="bg-gray-900 min-h-screen py-12 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center text-[#00baff] mb-8">Панель Администратора</h1>

        {/* Список пользователей */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#00baff] mb-4">Все пользователи</h2>
          <div className="flex justify-between mb-2">
            <h4 className="font-semibold">Клиенты:</h4>
          </div>
          <ul>
            {users.filter(user => user.role === 'client').map((client) => (
              <li key={client.id} className="bg-gray-700 p-2 rounded mb-2">
                {client.username} ({client.email})
                <button
                  onClick={() => deleteUser(client.id)}
                  className="ml-4 text-red-500"
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>

          <div className="flex justify-between mb-2 mt-4">
            <h4 className="font-semibold">Мастера:</h4>
          </div>
          <ul>
            {users.filter(user => user.role === 'master').map((master) => (
              <li key={master.id} className="bg-gray-700 p-2 rounded mb-2">
                {master.username} ({master.email})
                <button
                  onClick={() => deleteUser(master.id)}
                  className="ml-4 text-red-500"
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Список записей */}
        <div>
          <h2 className="text-2xl font-semibold text-[#00baff] mb-4">Все записи</h2>
          <table className="table-auto w-full bg-gray-700 text-white rounded">
            <thead>
              <tr>
                <th className="px-4 py-2">Услуга</th>
                <th className="px-4 py-2">Дата</th>
                <th className="px-4 py-2">Статус</th>
                <th className="px-4 py-2">Клиент</th>
                <th className="px-4 py-2">Мастер</th>
                <th className="px-4 py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-4 py-2">{appointment.service.name}</td>
                  <td className="px-4 py-2">{new Date(appointment.appointment_time).toLocaleString()}</td>
                  <td className="px-4 py-2">{appointment.status === 'not_completed' ? 'Не выполнен' : 'Выполнен'}</td>
                  <td className="px-4 py-2">{appointment.client_name}</td>
                  <td className="px-4 py-2">{appointment.master_name}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => deleteAppointment(appointment.id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
