import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useTheme } from '../context/ThemeContext'; // Импортируем useTheme для работы с темой

const API_URL = import.meta.env.VITE_API_URL;

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // Проверка, является ли пользователь администратором
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration: '' // добавляем поле для времени выполнения
  });

  // Получаем текущую тему через useTheme
  const { isDarkMode } = useTheme(); // Использование глобальной темы

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_URL}/services/`);
        setServices(response.data);
      } catch (err) {
        setError('Не удалось загрузить услуги. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    const checkAdminStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.role === 'admin') {
            setIsAdmin(true); // Если роль администратора, показываем панель
          }
        } catch (err) {
          setError('Ошибка при проверке прав администратора.');
        }
      }
    };

    fetchServices();
    checkAdminStatus(); // Проверяем статус администратора при загрузке страницы
  }, []);

  const handleAddService = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/services/`,
        newService,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setServices([...services, response.data]); // Обновляем список услуг с добавленной
      setNewService({
        name: '',
        description: '',
        price: '',
        duration: '' // сбрасываем поле времени
      });
    } catch (err) {
      setError('Ошибка при добавлении услуги.');
    }
  };

  const handleDeleteService = async (serviceId) => {
    const confirmDelete = window.confirm("Вы уверены, что хотите удалить эту услугу?");
    if (confirmDelete) {
      try {
        await axios.delete(`${API_URL}/services/${serviceId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        // После успешного удаления удаляем услугу из списка на клиенте
        setServices(services.filter(service => service.id !== serviceId));
      } catch (err) {
        setError('Ошибка при удалении услуги.');
      }
    }
  };

  return (
    <div className={`min-h-screen py-12 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} ${isDarkMode ? 'text-white' : 'text-[#050272]'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          className={`text-4xl font-extrabold text-center mb-8 ${isDarkMode ? 'text-white' : 'text-[#050272]'}`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Услуги
        </motion.h1>

        {loading ? (
          <div>Загрузка...</div>
        ) : error ? (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {services.length === 0 ? (
              <div>Услуги не найдены</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {services.map((service) => (
                  <motion.div
                    key={service.id}
                    className={`p-6 rounded-lg shadow-lg text-center h-80 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} transition-all duration-300`}
                    whileHover={{ scale: 1.05 }}  // При наведении карточка увеличивается
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link to={`/service/${service.id}`} className="w-full">
                      <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-[#00baff]' : 'text-[#050372]'} mb-2`}>
                        {service.name}
                      </h2>
                      <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{service.description}</p>
                      <p className={`text-xl font-semibold mt-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        Цена: {service.price} ₽
                      </p>
                      {/* Отображаем время выполнения услуги */}
                      <p className={`text-lg mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                        Время выполнения: {service.duration} мин
                      </p>
                    </Link>

                    {/* Кнопка удаления для админа */}
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded mt-4"
                      >
                        Удалить услугу
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Панель добавления услуги для администратора */}
        {isAdmin && (
          <div className={`mt-12 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'} p-8 rounded-lg shadow-lg`}>
            <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-[#050272]'}`}>Добавить услугу</h2>
            <form onSubmit={handleAddService} className="space-y-4">
              <input
                type="text"
                placeholder="Название услуги"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                className={`w-full px-4 py-2 rounded focus:outline-none focus:ring-2  ${isDarkMode ? 'border-[#00baff] bg-gray-700 text-white focus:ring-[#00baff]' : 'border-[#8a2be2] bg-white text-gray-700 focus:ring-[#8a2be2]'}`}
                required
              />
              <input
                type="text"
                placeholder="Описание услуги"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                className={`w-full px-4 py-2 rounded focus:outline-none focus:ring-2  ${isDarkMode ? 'border-[#00baff] bg-gray-700 text-white focus:ring-[#00baff]' : 'border-[#8a2be2] bg-white text-gray-700 focus:ring-[#8a2be2]'}`}
                required
              />
              <input
                type="number"
                placeholder="Цена"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                className={`w-full px-4 py-2 rounded focus:outline-none focus:ring-2  ${isDarkMode ? 'border-[#00baff] bg-gray-700 text-white focus:ring-[#00baff]' : 'border-[#8a2be2] bg-white text-gray-700 focus:ring-[#8a2be2]'}`}
                required
              />
              <input
                type="number"
                placeholder="Время выполнения (в минутах)"
                value={newService.duration}
                onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                className={`w-full px-4 py-2 rounded focus:outline-none focus:ring-2  ${isDarkMode ? 'border-[#00baff] bg-gray-700 text-white focus:ring-[#00baff]' : 'border-[#8a2be2] bg-white text-gray-700 focus:ring-[#8a2be2]'}`}
                required
              />
              <button
                type="submit"
                className={`w-full py-2 rounded ${isDarkMode ? "border-[#00baff] bg-[#00baff] hover:bg-[#00bbffcf] text-white" : "border-[#8a2be2] bg-[#8a2be2] hover:bg-[#892be2d8] text-white"}`}
              >
                Добавить услугу
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
