import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Проверка авторизации
  const [isAdmin, setIsAdmin] = useState(false); // Проверка, является ли пользователь администратором
  const [isOpen, setIsOpen] = useState(false); // Для мобильного меню
  const [isModalOpen, setIsModalOpen] = useState(false); // Для модального окна
  const navigate = useNavigate();

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

  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white shadow-lg z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Текст "Барбершоп N1" с градиентом */}
        <Link
          to="/"
          className="text-2xl font-bold barbershop-text text-shadow transition duration-300"
        >
          Барбершоп N1
        </Link>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white text-2xl hover:text-[#00B9FF]"
          >
            ☰
          </button>
        </div>

        <ul className="hidden md:flex space-x-6 items-center ml-auto">
          <li>
            <Link
              to="/"
              className="text-white hover:text-[#00baff] text-shadow transition duration-300"
            >
              Главная
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-white hover:text-[#00baff] text-shadow transition duration-300"
            >
              О нас
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              className="text-white hover:text-[#00baff] text-shadow transition duration-300"
            >
              Услуги
            </Link>
          </li>
          <li>
            <Link
              to="/marketplace"
              className="text-white hover:text-[#00baff] text-shadow transition duration-300"
            >
              Магазин
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="text-white hover:text-[#00baff] text-shadow transition duration-300"
            >
              Контакты
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/profile"
                  className="text-white hover:text-[#00baff] text-shadow transition duration-300"
                >
                  Профиль
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    className="text-white hover:text-[#00baff] text-shadow transition duration-300"
                  >
                    Панель администратора
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={handleLogoutClick} // Открываем модальное окно
                  className="text-white hover:text-[#ff0000] text-shadow transition duration-300"
                >
                  Выйти
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/login"
                className="text-white hover:text-[#8a2be299] text-shadow transition duration-300"
              >
                Авторизация
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Мобильное меню */}
      {isOpen && (
        <ul className="md:hidden bg-black border-t border-gray-700 px-4 pb-4 space-y-2 text-center">
          <li>
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block text-white hover:text-[#00baff] text-shadow transition duration-300"
            >
              Главная
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className="block text-white hover:text-[#00baff] text-shadow transition duration-300"
            >
              О нас
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              onClick={() => setIsOpen(false)}
              className="block text-white hover:text-[#00baff] text-shadow transition duration-300"
            >
              Услуги
            </Link>
          </li>
          <li>
            <Link
              to="/marketplace"
              onClick={() => setIsOpen(false)}
              className="block text-white hover:text-[#00baff] text-shadow transition duration-300"
            >
              Магазин
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="block text-white hover:text-[#00baff] text-shadow transition duration-300"
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
                  className="block text-white hover:text-[#00baff] text-shadow transition duration-300"
                >
                  Профиль
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block text-white hover:text-[#00baff] text-shadow transition duration-300"
                  >
                    Панель администратора
                  </Link>
                </li>
              )}
              <li className="flex justify-center">
                <button
                  onClick={handleLogoutClick} // Открываем модальное окно
                  className="block text-white hover:text-[#ff0000] text-shadow transition duration-300"
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
                className="block text-white hover:text-[#00baff] text-shadow transition duration-300"
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
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-sm w-full">
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
