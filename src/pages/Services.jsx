import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
  });

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
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="bg-gray-100 p-8 rounded shadow-md w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Услуги</h1>

        {loading ? (
          <div>Загрузка...</div>
        ) : error ? (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        ) : (
          <div>
            {services.length === 0 ? (
              <div>Услуги не найдены</div>
            ) : (
              <ul className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="flex justify-between items-center bg-white p-4 rounded shadow hover:bg-gray-200">
                    <Link to={`/service/${service.id}`} className="w-full">
                      <h2 className="text-xl font-semibold">{service.name}</h2>
                      <p className="text-gray-700">{service.description}</p>
                      <p className="text-gray-500">Цена: {service.price} ₽</p>
                    </Link>

                    {/* Кнопка удаления для админа */}
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-500 hover:text-red-700 ml-4"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Панель добавления услуги для администратора */}
        {isAdmin && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Добавить услугу</h2>
            <form onSubmit={handleAddService} className="space-y-4">
              <input
                type="text"
                placeholder="Название услуги"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                className="w-full px-4 py-2 rounded border"
                required
              />
              <input
                type="text"
                placeholder="Описание услуги"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                className="w-full px-4 py-2 rounded border"
                required
              />
              <input
                type="number"
                placeholder="Цена"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                className="w-full px-4 py-2 rounded border"
                required
              />
              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-900 text-white py-2 rounded"
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
