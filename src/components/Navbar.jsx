import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Проверка авторизации
  const [isAdmin, setIsAdmin] = useState(false); // Проверка, является ли пользователь администратором
  const [isOpen, setIsOpen] = useState(false); // Для мобильного меню
  const [isModalOpen, setIsModalOpen] = useState(false); // Для модального окна
  const [isDarkMode, setIsDarkMode] = useState(true); // Состояние для тёмной/светлой темы
  const navigate = useNavigate();

  const textShadowStyle = isDarkMode
    ? "0 0 15px rgba(0, 186, 255, 0.8), 0 0 30px rgba(0, 186, 255, 0.6)" // для тёмной темы
    : "0 0 15px rgba(138, 43, 226, 0.8), 0 0 30px rgba(138, 43, 226, 0.6)"; // для светлой темы

  // Следим за изменениями в localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Если токен есть, то авторизован

    // Проверка роли администратора
    const checkAdminStatus = async () => {
      if (token) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.role === "admin") {
            setIsAdmin(true); // Если роль администратора, показываем панель
          }
        } catch (err) {
          console.error("Ошибка при проверке роли администратора", err);
        }
      }
    };

    // Добавляем событие для прослушивания изменений в localStorage
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("token");
      setIsAuthenticated(!!updatedToken); // Обновляем состояние авторизации
    };

    checkAdminStatus();
    window.addEventListener("storage", handleStorageChange);

    // Убираем слушатель при размонтировании компонента
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Функция для показа модального окна
  const handleLogoutClick = () => {
    setIsModalOpen(true); // Открываем модальное окно
  };

  // Функция для выхода
  const logout = () => {
    localStorage.removeItem("token"); // Удаляем токен при выходе
    setIsAuthenticated(false); // Обновляем состояние
    navigate("/login"); // Перенаправление на страницу входа
    setIsModalOpen(false); // Закрываем модальное окно
  };

  // Функция для отмены выхода
  const cancelLogout = () => {
    setIsModalOpen(false); // Закрытие модального окна
  };

  // Функция переключения темы
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode); // Переключаем состояние темы
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full ${isDarkMode ? "bg-gray-950/85" : "bg-white/85"} text-white shadow-lg z-50`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Текст "Барбершоп N1" с градиентом */}
        <Link
          to="/"
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-600"} barbershop-text text-shadow transition duration-300 ${isDarkMode ? "text-shadow-lg" : "text-shadow-md"}`}
        >
          Барбершоп N1
        </Link>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`text-2xl ${isDarkMode ? "text-white" : "text-gray-600"} hover:text-[#00B9FF]`}
          >
            ☰
          </button>
        </div>

        <ul className="hidden md:flex space-x-6 items-center ml-auto">
          <li>
            <Link
              to="/"
              className={`text-xl ${isDarkMode ? "text-white hover:text-[#00B9FF]" : "text-gray-600 hover:text-[#8a2be2]"} text-shadow transition duration-300`}
              style={{ textShadow: textShadowStyle }}
            >
              Главная
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`text-xl ${isDarkMode ? "text-white hover:text-[#00B9FF]" : "text-gray-600 hover:text-[#8a2be2]"} text-shadow transition duration-300`}
              style={{ textShadow: textShadowStyle }}
            >
              О нас
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              className={`text-xl ${isDarkMode ? "text-white hover:text-[#00B9FF]" : "text-gray-600 hover:text-[#8a2be2]"} text-shadow transition duration-300`}
              style={{ textShadow: textShadowStyle }}
            >
              Услуги
            </Link>
          </li>
          <li>
            <Link
              to="/marketplace"
              className={`text-xl ${isDarkMode ? "text-white hover:text-[#00B9FF]" : "text-gray-600 hover:text-[#8a2be2]"} text-shadow transition duration-300`}
              style={{ textShadow: textShadowStyle }}
            >
              Магазин
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={`text-xl ${isDarkMode ? "text-white hover:text-[#00B9FF]" : "text-gray-600 hover:text-[#8a2be2]"} text-shadow transition duration-300`}
              style={{ textShadow: textShadowStyle }}
            >
              Контакты
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/profile"
                  className={`text-xl ${isDarkMode ? "text-white hover:text-[#00B9FF]" : "text-gray-600 hover:text-[#8a2be2]"} text-shadow transition duration-300`}
                  style={{ textShadow: textShadowStyle }}
                >
                  Профиль
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    className={`text-xl ${isDarkMode ? "text-white hover:text-[#00B9FF]" : "text-gray-600 hover:text-[#8a2be2]"} text-shadow transition duration-300`}
                    style={{ textShadow: textShadowStyle }}
                  >
                    Панель администратора
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={handleLogoutClick} // Открываем модальное окно
                  className={`text-xl ${isDarkMode ? "text-white hover:text-[#ff0000]" : "text-gray-600 hover:text-[#ff0000]"} text-shadow transition duration-300`}
                  style={{ textShadow: textShadowStyle }}
                >
                  Выйти
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className={`text-xl ${isDarkMode ? "text-white hover:text-[#00B9FF]" : "text-gray-600 hover:text-[#8a2be2]"} text-shadow transition duration-300`}
                style={{ textShadow: textShadowStyle }}
              >
                Авторизация
              </Link>
            </li>
          )}
        </ul>

        {/* Кнопка для переключения темы */}
        <button
          onClick={toggleTheme}
          className={`text-white px-6 py-2 rounded-full focus:outline-none ${isDarkMode ? "bg-[#00baff]" : "bg-[#8a2be2]"} ml-4`}
        >
          {isDarkMode ? "☾" : "☼"}
        </button>
      </div>

      {/* Мобильное меню */}
      {isOpen && (
        <ul className={isDarkMode ? "bg-gray-950/20 px-4 pb-4 space-y-2 text-center transform translate-y-0 transition-all duration-500" : "bg-white/20 px-4 pb-4 space-y-2 text-center transform translate-y-0 transition-all duration-500"}>
          <li>
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`block ${isDarkMode ? "text-white hover:text-[#00B9FF]" : "text-gray-600 hover:text-[#8a2be2]"} text-shadow transition duration-300`}
              style={{ textShadow: textShadowStyle }}
            >
              Главная
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className={`block ${isDarkMode ? "text-white hover:text-[#00B9FF]" : "text-gray-600 hover:text-[#8a2be2]"} text-shadow transition duration-300`}
              style={{ textShadow: textShadowStyle }}
            >
              О нас
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              onClick={() => setIsOpen(false)}
              className={`block ${isDarkMode ? "text-white hover:text-[#00B9FF]" : "text-gray-600 hover:text-[#8a2be2]"} text-shadow transition duration-300`}
              style={{ textShadow: textShadowStyle }}
            >
              Услуги
            </Link>
          </li>
          <li>
            <Link
              to="/marketplace"
              onClick={() => setIsOpen(false)}
              className={`block ${isDarkMode ? "text-white hover:text-[#00B9FF]" : "text-gray-600 hover:text-[#8a2be2]"} text-shadow transition duration-300`}
              style={{ textShadow: textShadowStyle }}
            >
              Магазин
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className={`block ${isDarkMode ? "text-white hover:text-[#00B9FF]" : "text-gray-600 hover:text-[#8a2be2]"} text-shadow transition duration-300`}
              style={{ textShadow: textShadowStyle }}
            >
              Контакты
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className={`block ${isDarkMode ? "text-white hover:text-[#00B9FF]" : "text-gray-600 hover:text-[#8a2be2]"} text-shadow transition duration-300`}
                  style={{ textShadow: textShadowStyle }}
                >
                  Профиль
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className={`block ${isDarkMode ? "text-white hover:text-[#00B9FF]" : "text-gray-600 hover:text-[#8a2be2]"} text-shadow transition duration-300`}
                    style={{ textShadow: textShadowStyle }}
                  >
                    Панель администратора
                  </Link>
                </li>
              )}
              <li className="flex justify-center">
                <button
                  onClick={handleLogoutClick} // Открываем модальное окно
                  className={`block ${isDarkMode ? "text-white hover:text-[#ff0000]" : "text-gray-600 hover:text-[#ff0000]"} text-shadow transition duration-300`}
                  style={{ textShadow: textShadowStyle }}
                >
                  Выйти
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className={`block ${isDarkMode ? "text-white hover:text-[#00B9FF]" : "text-gray-600 hover:text-[#8a2be2]"} text-shadow transition duration-300`}
                style={{ textShadow: textShadowStyle }}
              >
                Авторизация
              </Link>
            </li>
          )}
        </ul>
      )}

      {/* Модальное окно для подтверждения выхода */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} p-6 rounded-lg shadow-lg max-w-sm w-full`}>
            <p className="text-lg mb-4 text-center">Вы уверены, что хотите выйти?</p>
            <div className="flex justify-between space-x-2">
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded w-full"
              >
                Да
              </button>
              <button
                onClick={cancelLogout}
                className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded w-full"
              >
                Нет
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
