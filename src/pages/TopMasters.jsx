import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';  // Импортируем DatePicker
import "react-datepicker/dist/react-datepicker.css";  // Стили для DatePicker
import { setYear, setMonth } from 'date-fns';  // Для работы с датами
import { useTheme } from '../context/ThemeContext'; // Для работы с темой

const TopMasters = () => {
  const { isDarkMode } = useTheme(); // Получаем состояние темы
  const [masters, setMasters] = useState([]);  // Состояние для списка мастеров
  const [error, setError] = useState('');  // Для ошибок
  const [loading, setLoading] = useState(true);  // Для индикатора загрузки
  const [selectedDate, setSelectedDate] = useState(new Date());  // Дата для выбора месяца и года
  const [selectedMonth, setSelectedMonth] = useState(null);  // Состояние для выбранного месяца

  // Маппинг месяцев на числовое значение
  const monthMapping = {
    Январь: 1,
    Февраль: 2,
    Март: 3,
    Апрель: 4,
    Май: 5,
    Июнь: 6,
    Июль: 7,
    Август: 8,
    Сентябрь: 9,
    Октябрь: 10,
    Ноябрь: 11,
    Декабрь: 12
  };

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const year = selectedDate.getFullYear();
        const month = selectedMonth || selectedDate.getMonth() + 1;  // Месяц в числовом формате

        console.log(`Запрос к API: год - ${year}, месяц - ${month}`);  // Логируем запрос

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/appointments/top-masters/${year}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Если нужно авторизоваться
          },
          params: {
            month: month,  // Отправляем месяц в числовом формате
          },
        });

        console.log('Ответ от API:', response.data);  // Логируем ответ от API

        setMasters(response.data);  // Сохраняем данные о мастерах
      } catch (err) {
        setError('Ошибка при получении данных о мастерах.');
        console.error('Ошибка API:', err);  // Логируем ошибку
      } finally {
        setLoading(false);  // Останавливаем индикатор загрузки
      }
    };

    fetchMasters();  // Загружаем данные о мастерах при изменении даты или месяца
  }, [selectedDate, selectedMonth]);

  const handleDateChange = (date) => {
    setSelectedDate(date);  // Обновляем выбранную дату при изменении пользователем
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(monthMapping[month]);  // Преобразуем месяц в числовое значение
  };

  if (loading) {
    return <div>Загрузка...</div>;  // Пока данные загружаются
  }

  if (error) {
    return <div className="text-red-500 text-sm mb-4">{error}</div>;  // Если ошибка при загрузке данных
  }

  // Фильтруем мастеров по выбранному месяцу
  const filteredMasters = masters.filter((masterData) => {
    const masterMonth = masterData.month;  // Месяц мастера
    return selectedMonth ? masterMonth === selectedMonth : true;  // Фильтруем по месяцу
  });

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-[#050272]'} min-h-screen p-6`}>
      <h1 className={`text-4xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-[#050272]'} mb-8`}>
        Лучшие мастера месяца
      </h1>

      <div>
        <h2 className={`text-3xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-[#050272]'}`}>
          Топ мастера по количеству заказов
        </h2>

        <div className="mb-6">
          <label htmlFor="year-picker" className={`text-lg ${isDarkMode ? 'text-[#00baff]' : 'text-[#050272]'}`}>Выберите год:</label>
          <DatePicker
            id="year-picker"
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy"  // Формат только для года
            showYearPicker  // Показываем только год
            className={`w-full px-4 py-2 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-[#050272]'} focus:ring-2 focus:ring-[#00baff]`}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="month-select" className={`text-lg ${isDarkMode ? 'text-[#00baff]' : 'text-[#050272]'}`}>Выберите месяц:</label>
          <select
            id="month-select"
            value={selectedMonth || ''}
            onChange={(e) => handleMonthChange(e.target.value)}
            className={`w-full px-4 py-2 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-[#050272]'} focus:ring-2 focus:ring-[#00baff]`}
          >
            <option value="">Все месяцы</option>
            <option value="Январь">Январь</option>
            <option value="Февраль">Февраль</option>
            <option value="Март">Март</option>
            <option value="Апрель">Апрель</option>
            <option value="Май">Май</option>
            <option value="Июнь">Июнь</option>
            <option value="Июль">Июль</option>
            <option value="Август">Август</option>
            <option value="Сентябрь">Сентябрь</option>
            <option value="Октябрь">Октябрь</option>
            <option value="Ноябрь">Ноябрь</option>
            <option value="Декабрь">Декабрь</option>
          </select>
        </div>

        {filteredMasters && filteredMasters.length > 0 ? (
          filteredMasters.map((masterData, index) => (
            <div key={index} className="mb-6">
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-[#00baff]' : 'text-[#050272]'} mb-2`}>
                {masterData.month} месяц {masterData.year}
              </h3>
              <ul>
                {masterData.topMasters.map((item, index) => (
                  <li key={index}>
                    <div className={`bg-gray-800 p-4 rounded mb-2 ${isDarkMode ? 'text-white' : 'text-[#050272]'}`}>
                      <p className={isDarkMode ? 'text-[#00baff]' : 'text-[#050272]'}>Имя: {item.master_name}</p>
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-800'}>Количество заказов: {item.completed_orders}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>Нет данных о мастерах за этот месяц.</p>
        )}
      </div>
    </div>
  );
};

export default TopMasters;
