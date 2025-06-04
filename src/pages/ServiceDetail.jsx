import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes, isBefore, isAfter, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';

const API_URL = import.meta.env.VITE_API_URL;

const holidays = [
  { day: 1, month: 1, name: 'Новый год' },
  { day: 7, month: 1, name: 'Рождество Христово' },
  { day: 8, month: 3, name: 'Международный женский день' },
  { day: 1, month: 5, name: 'Праздник Весны и Труда' },
  { day: 9, month: 5, name: 'День Победы' },
  { day: 12, month: 6, name: 'День России' },
  { day: 4, month: 11, name: 'День народного единства' },
];

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
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

    const fetchBookedSlots = async () => {
      try {
        const response = await axios.get(`${API_URL}/appointments/`, {
          params: { service_id: serviceId }
        });
        const slots = response.data.map(appointment => appointment.appointment_time);
        setBookedSlots(slots); // Сохраняем все забронированные слоты
      } catch (err) {
        console.error('Ошибка при загрузке забронированных слотов', err);
      }
    };

    if (serviceId) {
      fetchService();
      fetchBookedSlots();
    }
  }, [serviceId]);

  const handleAppointment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Вы не авторизованы! Пожалуйста, войдите в систему.');
      navigate('/login');
      return;
    }

    // Проверка формата номера телефона (пример для формата +7 (xxx) xxx-xx-xx)
    const phoneRegex = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(clientPhone)) {
      alert('Неверный формат номера телефона. Используйте формат: +7 (xxx) xxx-xx-xx');
      return;
    }

    // Преобразуем локальное время в UTC
    const localDate = selectedDate;  // Время, выбранное на фронтенде
    const offset = localDate.getTimezoneOffset();  // Получаем смещение от UTC в минутах

    // Корректируем время, чтобы оно было в UTC
    localDate.setMinutes(localDate.getMinutes() - offset);  // Применяем смещение для перевода в UTC

    const utcDate = localDate.toISOString();  // Преобразуем в строку ISO в формате UTC

    try {
      const response = await axios.post(`${API_URL}/appointments/`, {
        service_id: service.id,
        client_name: clientName,
        client_phone: clientPhone,
        appointment_time: utcDate,  // Отправляем время в UTC
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Вы успешно записались на услугу!');
      navigate('/appointments');
    } catch (err) {
      setError('Не удалось записаться на услугу.');
    }
  };

  const timeFilter = (time) => {
    const startOfDay = setHours(setMinutes(new Date(), 0), 9); // 9:00 AM
    const endOfDay = setHours(setMinutes(new Date(), 45), 20); // 20:45 PM (8:45 PM)
    
    // Преобразуем время в строку для корректного сравнения
    const timeStr = time.toISOString();
    
    const isBooked = bookedSlots.includes(timeStr); // Проверка, забронирован ли слот

    if (isBooked) {
      return false; // Блокируем забронированные слоты
    }

    if (isToday(time)) {
      // Для сегодняшнего дня проверяем, что время попадает в рабочие часы
      return isAfter(time, startOfDay) && isBefore(time, endOfDay);
    } else {
      // Для будущих дней, проверяем рабочие часы с 9:00 до 20:45
      const futureDayStart = setHours(setMinutes(time, 0), 9); // Начало рабочего дня (9:00 AM)
      const futureDayEnd = setHours(setMinutes(time, 0), 21); // Конец рабочего дня (20:45 PM)
      return isAfter(time, futureDayStart) && isBefore(time, futureDayEnd);
    }
  };

  const highlightBookedSlots = (date) => {
    return bookedSlots.some(slot => {
      const slotDate = new Date(slot);
      // Сравниваем только дату, игнорируя время
      return slotDate.toDateString() === date.toDateString();
    });
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
            onChange={(e) => setClientName(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="+7 (xxx) xxx-xx-xx"
            className="w-full px-4 py-2 rounded border"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}  // Обработчик изменения номера телефона
            required
          />

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
              highlightDates={bookedSlots.map(slot => new Date(slot))} // Подсвечиваем забронированные слоты
              dayClassName={(date) => highlightBookedSlots(date) ? 'bg-gray-400' : undefined} // Серый фон для забронированных дней
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
