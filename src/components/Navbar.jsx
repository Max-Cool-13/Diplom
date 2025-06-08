import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import classNames from "classnames"; // Импортируем библиотеку
import { useTheme } from '../context/ThemeContext'; // Импортируем useTheme для работы с темой

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme(); // Получаем глобальное состояние темы и функцию переключения
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const commonLinkClasses = classNames(
    "text-xl text-shadow transition duration-300",
    {
      "text-white hover:text-[#00B9FF]": isDarkMode,
      "text-black hover:text-[#8a2be2]": !isDarkMode,
    }
  );

  const textShadowStyle = isDarkMode
    ? "0 0 15px rgba(0, 186, 255, 0.8), 0 0 30px rgba(0, 186, 255, 0.6)"
    : "0 0 15px rgba(138, 43, 226, 0.8), 0 0 30px rgba(138, 43, 226, 0.6)";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    const checkAdminStatus = async () => {
      if (token) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.role === "admin") setIsAdmin(true);
        } catch (err) {
          console.error("Ошибка при проверке роли администратора", err);
        }
      }
    };

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("token");
      setIsAuthenticated(!!updatedToken);
    };

    checkAdminStatus();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogoutClick = () => setIsModalOpen(true);
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
    setIsModalOpen(false);
  };

  const cancelLogout = () => setIsModalOpen(false);

  useEffect(() => {
    // Добавляем или удаляем класс на body в зависимости от темы
    if (isDarkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <nav
      className={classNames(
        "fixed top-0 left-0 w-full text-white shadow-lg z-50",
        isDarkMode ? "bg-gray-900/95" : "bg-white/95"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Текст "Барбершоп N1" с разделением тени на левую и правую часть */}
        <Link
          to="/"
          className={`text-3xl font-bold  ${isDarkMode ? "text-white" : "text-[#050372]"} barbershop-text text-shadow transition duration-300 ${isDarkMode ? "text-shadow-lg" : "text-shadow-md"}`}
        >
          Барбершоп N1
        </Link>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={classNames("text-2xl", {
              "text-white hover:text-[#00B9FF]": isDarkMode,
              "text-[#050372] hover:text-[#8a2be2]": !isDarkMode,
            })}
          >
            ☰
          </button>
        </div>

        <ul className="hidden md:flex space-x-6 items-center ml-auto">
          <li>
            <Link to="/" className={commonLinkClasses} style={{ textShadow: textShadowStyle }}>
              Главная
            </Link>
          </li>
          <li>
            <Link to="/about" className={commonLinkClasses} style={{ textShadow: textShadowStyle }}>
              О нас
            </Link>
          </li>
          <li>
            <Link to="/services" className={commonLinkClasses} style={{ textShadow: textShadowStyle }}>
              Услуги
            </Link>
          </li>
          <li>
            <Link to="/marketplace" className={commonLinkClasses} style={{ textShadow: textShadowStyle }}>
              Магазин
            </Link>
          </li>
          <li>
            <Link to="/contact" className={commonLinkClasses} style={{ textShadow: textShadowStyle }}>
              Контакты
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link to="/profile" className={commonLinkClasses} style={{ textShadow: textShadowStyle }}>
                  Профиль
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin" className={commonLinkClasses} style={{ textShadow: textShadowStyle }}>
                    Панель администратора
                  </Link>
                </li>
              )}
              <li>
                <button onClick={handleLogoutClick} className={commonLinkClasses} style={{ textShadow: textShadowStyle }}>
                  Выйти
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" onClick={() => setIsOpen(false)} className={commonLinkClasses} style={{ textShadow: textShadowStyle }}>
                Авторизация
              </Link>
            </li>
          )}
        </ul>

        {/* Переключатель темы */}
        <button
          onClick={toggleTheme} // Используем глобальный toggleTheme для переключения темы
          className={classNames("text-white px-6 py-2 rounded-full focus:outline-none ml-4", {
            "bg-[#00baff]": isDarkMode,
            "bg-[#8a2be2]": !isDarkMode,
          })}
        >
          {isDarkMode ? "☾" : "☼"}
        </button>
      </div>

      {isOpen && (
        <ul
          className={classNames("px-4 pb-4 space-y-2 text-center mobile-menu transition-all duration-500", {
            "bg-gray-950/20": isDarkMode,
            "bg-white/20": !isDarkMode,
            open: isOpen,
          })}
          style={{
            transform: isOpen ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 0.5s ease-in-out",
          }}
        >
          <li>
            <Link to="/" onClick={() => setIsOpen(false)} className={commonLinkClasses} style={{ textShadow: textShadowStyle }}>
              Главная
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setIsOpen(false)} className={commonLinkClasses} style={{ textShadow: textShadowStyle }}>
              О нас
            </Link>
          </li>
          <li>
            <Link to="/services" onClick={() => setIsOpen(false)} className={commonLinkClasses} style={{ textShadow: textShadowStyle }}>
              Услуги
            </Link>
          </li>
          <li>
            <Link to="/marketplace" onClick={() => setIsOpen(false)} className={commonLinkClasses} style={{ textShadow: textShadowStyle }}>
              Магазин
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setIsOpen(false)} className={commonLinkClasses} style={{ textShadow: textShadowStyle }}>
              Контакты
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link to="/profile" onClick={() => setIsOpen(false)} className={commonLinkClasses} style={{ textShadow: textShadowStyle }}>
                  Профиль
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin" onClick={() => setIsOpen(false)} className={commonLinkClasses} style={{ textShadow: textShadowStyle }}>
                    Панель администратора
                  </Link>
                </li>
              )}
              <li className="flex justify-center">
                <button onClick={handleLogoutClick} className={commonLinkClasses} style={{ textShadow: textShadowStyle }}>
                  Выйти
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" onClick={() => setIsOpen(false)} className={commonLinkClasses} style={{ textShadow: textShadowStyle }}>
                Авторизация
              </Link>
            </li>
          )}
        </ul>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} p-6 rounded-lg shadow-lg max-w-sm w-full`}>
            <p className="text-lg mb-4 text-center">Вы уверены, что хотите выйти?</p>
            <div className="flex justify-between space-x-2">
              <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded w-full">
                Да
              </button>
              <button onClick={cancelLogout} className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded w-full">
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
