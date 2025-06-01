import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker'; // Импортируем компонент для выбора даты
import "react-datepicker/dist/react-datepicker.css"; // Стиль для календаря
import { setHours, setMinutes, isBefore, isAfter, isToday } from 'date-fns'; // Для установки времени и фильтрации
import { ru } from 'date-fns/locale'; // Импортируем русскую локаль

const API_URL = import.meta.env.VITE_API_URL;

// Массив с фиксированными праздничными днями (можно добавить больше праздников)
const holidays = [
  { day: 1, month: 1, name: 'Новый год' }, // Новый год
  { day: 7, month: 1, name: 'Рождество Христово' }, // Рождество
  { day: 8, month: 3, name: 'Международный женский день' }, // 8 марта
  { day: 1, month: 5, name: 'Праздник Весны и Труда' }, // 1 мая
  { day: 9, month: 5, name: 'День Победы' }, // 9 мая
  { day: 12, month: 6, name: 'День России' }, // 12 июня
  { day: 4, month: 11, name: 'День народного единства' }, // 4 ноября
  // Добавьте сюда остальные праздники
];

export default function ServiceDetail() {
  const { serviceId } = useParams(); // Получаем ID услуги из параметров URL
  const [service, setService] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Состояние для хранения выбранной даты
  const [clientName, setClientName] = useState(''); // Состояние для имени клиента
  const [clientPhone, setClientPhone] = useState(''); // Состояние для телефона клиента
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`${API_URL}/services/${serviceId}`);
        setService(response.data);
      } catch (err) {
        setError('Не удалось загрузить услугу. Проверьте API или ID услуги.');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

 const handleAppointment = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  
  if (!token) {
    alert('Вы не авторизованы! Пожалуйста, войдите в систему.');
    navigate('/login'); // Перенаправляем пользователя на страницу входа
    return;
  }

  try {
    const response = await axios.post(`${API_URL}/appointments/`, {
      service_id: service.id,
      client_name: clientName,
      client_phone: clientPhone,
      appointment_time: selectedDate.toISOString(),
    }, {
      headers: {
        Authorization: `Bearer ${token}` // Передаем токен в заголовке запроса
      }
    });
    alert('Вы успешно записались на услугу!');
    navigate('/appointments'); // Перенаправляем на страницу записей
  } catch (err) {
    setError('Не удалось записаться на услугу.');
  }
};



  // Проверка, является ли день понедельником
  const isMonday = (date) => {
    const day = date.getDay();
    return day === 1; // 1 — это понедельник
  };

  // Проверка на праздничные дни
  const isHoliday = (date) => {
    const month = date.getMonth() + 1; // Месяцы в JavaScript начинаются с 0
    const day = date.getDate();
    return holidays.some(holiday => holiday.month === month && holiday.day === day);
  };

  // Фильтрация времени для текущего дня с 9:00 до 20:45
  const timeFilter = (time) => {
    const startOfDay = setHours(setMinutes(new Date(), 0), 9); // 9:00 AM
    const endOfDay = setHours(setMinutes(new Date(), 45), 20); // 20:45 PM (8:45 PM)

    if (isToday(time)) {
      // Для сегодняшнего дня, фильтруем только с 9:00 до 20:45
      return isAfter(time, startOfDay) && isBefore(time, endOfDay);
    } else {
      // Для будущих дней (например, 11 мая) разрешаем выбор времени только с 9:00 до 20:45
      const futureDayStart = setHours(setMinutes(time, 0), 9); // Начало дня (9:00 AM)
      const futureDayEnd = setHours(setMinutes(time, 45), 20); // Конец дня (20:45 PM)
      return isAfter(time, futureDayStart) && isBefore(time, futureDayEnd);
    }
  };

  // Функция фильтрации на основе рабочего дня и понедельников
  const filterDate = (date) => {
    if (isMonday(date) || isHoliday(date)) {
      return false; // Понедельники и праздничные дни — выходные
    }
    return true; // Все остальные дни доступны
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="bg-gray-100 p-8 rounded shadow-md w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">{service?.name}</h1>
        <p className="text-gray-700">{service?.description}</p>
        <p className="text-gray-500 mt-4">Цена: {service?.price} ₽</p>

        <h2 className="text-2xl mt-6 mb-4">Записаться на услугу</h2>
        <form onSubmit={handleAppointment} className="space-y-4">
          <input
            type="text"
            placeholder="Ваше имя"
            className="w-full px-4 py-2 rounded border"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)} // Обработчик изменения имени
            required
          />
          <input
            type="tel"
            placeholder="Ваш телефон"
            className="w-full px-4 py-2 rounded border"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)} // Обработчик изменения телефона
            required
          />

          {/* Календарь для выбора даты и времени */}
          <div className="mb-4">
            <label htmlFor="appointment-time" className="block text-lg">Выберите дату и время:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)} // Обработчик изменения даты
              showTimeSelect
              timeIntervals={15} // Шаг времени (по 15 минут)
              timeCaption="Время"
              dateFormat="Pp" // Формат отображаемой даты и времени
              minDate={new Date()} // Минимальная дата - текущая
              className="w-full px-4 py-2 rounded border" // Стиль для календаря
              timeFormat="HH:mm" // 24-часовой формат
              locale={ru} // Устанавливаем русский локаль для отображения
              filterTime={timeFilter} // Применяем фильтр времени
              filterDate={filterDate} // Применяем фильтр рабочих дней (понедельники — выходные)
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-900 text-white py-2 rounded"
          >
            Записаться
          </button>
        </form>
      </div>
    </div>
  );
}
