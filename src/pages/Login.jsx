import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Импортируем useTheme для работы с темой

const API_URL = import.meta.env.VITE_API_URL;

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Только для регистрации
  const [role, setRole] = useState('client'); // Роль для регистрации
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Состояние для переключения между входом и регистрацией
  const navigate = useNavigate();
  const { isDarkMode } = useTheme(); // Получаем текущую тему

  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы
    setError(''); // Очищаем возможные ошибки
    setLoading(true); // Устанавливаем флаг загрузки

    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      let response;
      if (isLogin) {
        // Логика для входа
        response = await axios.post(
          `${API_URL}/login/`,
          formData,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
      } else {
        // Логика для регистрации
        response = await axios.post(
          `${API_URL}/register/`,
          {
            username: name,
            email: email,
            password: password,
            role: role, // передаём выбранную роль
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }

      // Сохраняем токен и роль в localStorage
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('role', response.data.role); // Сохраняем роль пользователя

      // Перенаправляем на страницу профиля
      navigate('/profile'); // После успешного входа или регистрации, перенаправляем на страницу профиля

      window.location.reload(); // Редирект после успешной регистрации/входа
    } catch (err) {
      setError(isLogin ? 'Неверный логин или пароль' : 'Ошибка регистрации');
    } finally {
      setLoading(false); // Снимаем флаг загрузки
    }
  };

  const handleLoginSwitch = () => {
    setIsLogin(true);
    setName(''); // Сбрасываем имя, если пользователь был на форме регистрации
    setRole('client'); // Сбрасываем роль
  };

  const handleRegisterSwitch = () => {
    setIsLogin(false);
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'} ${isDarkMode ? 'text-white' : 'text-[#050272]'} px-4`}>
      <form
        onSubmit={handleSubmit}
        className={`p-8 rounded shadow-md w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
      >
        <h1 className={`text-3xl font-bold mb-6 text-center ${isDarkMode ? 'text-[#00baff]' : 'text-[#050272]'}`}>
          {isLogin ? 'Вход' : 'Регистрация'}
        </h1>

        {!isLogin && (
          <input
            type="text"
            placeholder="Имя"
            className={`w-full mb-4 px-4 py-2 rounded border ${isDarkMode ? 'bg-gray-700 text-white border-[#00baff] focus:ring-[#00baff]' : 'bg-white text-[#050272] border-[#8a2be2] focus:ring-[#8a2be2]'}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className={`w-full mb-4 px-4 py-2 rounded border ${isDarkMode ? 'bg-gray-700 text-white border-[#00baff] focus:ring-[#00baff]' : 'bg-white text-[#050272] border-[#8a2be2] focus:ring-[#8a2be2]'}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Пароль"
          className={`w-full mb-4 px-4 py-2 rounded border ${isDarkMode ? 'bg-gray-700 text-white border-[#00baff] focus:ring-[#00baff]' : 'bg-white text-[#050272] border-[#8a2be2] focus:ring-[#8a2be2]'}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {!isLogin && (
          <div className="mb-6">
            <label className={`mr-4 font-semibold ${isDarkMode ? 'text-[#00baff]' : 'text-[#050272]'}`}>Роль:</label>
            <label className={`${isDarkMode ? 'text-[#00baff]' : 'text-[#050272]'}`}>
              <input
                type="radio"
                name="role"
                value="client"
                checked={role === 'client'}
                onChange={() => setRole('client')}
                className="mr-2"
              />{' '}
              Клиент
            </label>
            <label className={`${isDarkMode ? 'text-[#00baff]' : 'text-[#050272]'}`}>
              <input
                type="radio"
                name="role"
                value="master"
                checked={role === 'master'}
                onChange={() => setRole('master')}
                className="mr-2"
              />{' '}
              Мастер
            </label>
          </div>
        )}

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <button
          type="submit"
          className={`w-full ${isDarkMode ? 'bg-[#00baff] hover:bg-[#00bbffcf] text-white' : 'bg-[#8a2be2] hover:bg-[#892be2d8] text-white'} py-2 rounded-full`}
          disabled={loading}
        >
          {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>

        <div className="mt-4 text-center">
          <span className={`text-gray-400 ${isDarkMode ? 'text-gray-300' : 'text-[#050272]'}`}>
            {isLogin ? 'Нет аккаунта? ' : 'Есть аккаунт? '}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault(); // Предотвращаем отправку формы
              if (isLogin) {
                handleRegisterSwitch();
              } else {
                handleLoginSwitch();
              }
            }}
            className={`font-semibold ${isDarkMode ? "text-[#00baff] hover:text-[#8a2be2] " : "text-[#8a2be2] hover:text-[#00baff] "}`}
          >
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </div>
      </form>
    </div>
  );
}

