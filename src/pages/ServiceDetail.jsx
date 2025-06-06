import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes, isBefore, isAfter, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';

const API_URL = import.meta.env.VITE_API_URL;

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]); // Занятые слоты
  const [comment, setComment] = useState('');
  const [masterId, setMasterId] = useState(null);  // Поле для выбора мастера
  const [masters, setMasters] = useState([]);  // Список мастеров
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
        setBookedSlots(slots); // Сохраняем занятые слоты
      } catch (err) {
        console.error('Ошибка при загрузке забронированных слотов', err);
      }
    };

    const fetchMasters = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/masters/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMasters(response.data);
      } catch (err) {
        console.error('Ошибка при загрузке мастеров', err);
      }
    };

    if (serviceId) {
      fetchService();
      fetchBookedSlots();
      fetchMasters();  // Загрузка мастеров
    }
  }, [serviceId]);

  // Проверка доступности времени
  const checkAvailability = async (serviceId, selectedDate) => {
    try {
      const response = await axios.get(`${API_URL}/appointments/check`, {
        params: {
          service_id: serviceId,
          appointment_time: selectedDate.toISOString(),
        },
      });

      return response.data;  // Если true, время доступно
    } catch (err) {
      console.error('Ошибка при проверке занятости времени', err);
      return false;  // Если произошла ошибка, предполагаем, что время занято
    }
  };

  // Обработчик изменения времени
  const handleDateChange = async (date) => {
    setSelectedDate(date);  // Устанавливаем выбранную дату

    const isAvailable = await checkAvailability(serviceId, date);
    if (!isAvailable) {
      alert('Это время уже занято. Пожалуйста, выберите другое.');
    }
  };

  // Фильтрация времени для блокировки забронированных слотов
  const timeFilter = (time) => {
    const startOfDay = setHours(setMinutes(new Date(), 0), 9); // 9:00 AM
    const endOfDay = setHours(setMinutes(new Date(), 45), 20); // 20:45 PM (8:45 PM)
    const timeStr = time.toISOString();
    const isBooked = bookedSlots.includes(timeStr); // Проверка, забронирован ли слот

    if (isBooked) {
      return false; // Блокируем забронированные слоты
    }

    if (isToday(time)) {
      return isAfter(time, startOfDay) && isBefore(time, endOfDay);
    } else {
      const futureDayStart = setHours(setMinutes(time, 0), 9); // Начало рабочего дня (9:00 AM)
      const futureDayEnd = setHours(setMinutes(time, 0), 21); // Конец рабочего дня (20:45 PM)
      return isAfter(time, futureDayStart) && isBefore(time, futureDayEnd);
    }
  };

  // Подсвечиваем забронированные дни
  const highlightBookedSlots = (date) => {
    return bookedSlots.some(slot => {
      const slotDate = new Date(slot);
      return slotDate.toDateString() === date.toDateString();
    });
  };

  // Обработчик изменения номера телефона
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Убираем все нецифровые символы
    if (value.length > 11) {
      value = value.slice(0, 11);  // Ограничиваем максимальное количество цифр (11 символов)
    }

    // Форматируем номер как +7 (xxx) xxx-xx-xx
    const formattedValue = value.length > 1 
      ? `+7(${value.slice(1, 4)})${value.slice(4, 7)}-${value.slice(7, 9)}-${value.slice(9, 11)}`
      : `+7(${value.slice(1)}`;

    setClientPhone(formattedValue); // Обновляем значение
  };

  // Обработчик отправки формы для записи
  const handleAppointment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Вы не авторизованы! Пожалуйста, войдите в систему.');
      navigate('/login');
      return;
    }

    const phoneRegex = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(clientPhone)) {
      alert('Неверный формат номера телефона. Используйте формат: +7 (xxx) xxx-xx-xx');
      return;
    }

    const localDate = selectedDate;  // Время, выбранное на фронтенде
    const offset = localDate.getTimezoneOffset();  // Получаем смещение от UTC в минутах
    localDate.setMinutes(localDate.getMinutes() - offset);  // Применяем смещение для перевода в UTC
    const utcDate = localDate.toISOString();  // Преобразуем в строку ISO в формате UTC

    try {
      const response = await axios.post(`${API_URL}/appointments/`, {
        service_id: service.id,
        client_name: clientName,
        client_phone: clientPhone,
        appointment_time: utcDate,  // Отправляем время в UTC
        comment: comment,  // Отправляем комментарий
        master_id: masterId,  // Отправляем ID мастера
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

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">{service?.name}</h1>
        <p className="text-gray-300">{service?.description}</p>
        <p className="text-[#00baff] text-xl font-semibold mt-4">Цена: {service?.price} ₽</p> {/* Выделение цены */}

        <h2 className="text-2xl mt-6 mb-4 text-white">Записаться на услугу</h2> {/* Выделение заголовка */}
        <form onSubmit={handleAppointment} className="space-y-4">
          <input
            type="text"
            placeholder="Ваше имя"
            className="w-full px-4 py-2 rounded border-[#8a2be2] bg-gray-700 text-white focus:ring-2 focus:ring-[#8a2be2]"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="+7 (xxx) xxx-xx-xx"
            className="w-full px-4 py-2 rounded border-[#8a2be2] bg-gray-700 text-white focus:ring-2 focus:ring-[#8a2be2]"
            value={clientPhone}
            onChange={handlePhoneChange}  // Обработчик изменения номера телефона
            required
          />

          <div className="mb-4">
            <label htmlFor="appointment-time" className="block text-lg text-white">Выберите дату и время:</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange} // Обработчик изменения даты
              showTimeSelect
              timeIntervals={15} // Шаг времени (по 15 минут)
              timeCaption="Время"
              dateFormat="Pp" // Формат отображаемой даты и времени
              minDate={new Date()} // Минимальная дата - текущая
              className="w-full px-4 py-2 rounded border-[#8a2be2] bg-gray-700 text-white"
              timeFormat="HH:mm" // 24-часовой формат
              locale={ru} // Устанавливаем русский локаль для отображения
              filterTime={timeFilter} // Применяем фильтр времени
              highlightDates={bookedSlots.map(slot => new Date(slot))} // Подсвечиваем забронированные слоты
              dayClassName={(date) => highlightBookedSlots(date) ? 'bg-gray-400' : undefined} // Серый фон для забронированных дней
            />
          </div>

          <div className="mb-4">
            <label htmlFor="master" className="block text-lg text-white">Выберите мастера:</label>
            <select
              value={masterId}
              onChange={(e) => setMasterId(e.target.value)}
              className="w-full px-4 py-2 rounded border-[#8a2be2] bg-gray-700 text-white"
              required
            >
              <option value="">Выберите мастера</option>
              {masters.map((master) => (
                <option key={master.id} value={master.id}>
                  {master.username}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="comment" className="block text-lg text-white">Комментарий (необязательно):</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-2 rounded border-[#8a2be2] bg-gray-700 text-white"
              placeholder="Ваш комментарий"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#00baff] hover:bg-[#8a2be2] text-white py-2 rounded"
          >
            Записаться
          </button>
        </form>
      </div>
    </div>
  );
}
