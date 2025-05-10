import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Проверка авторизации
  const [isOpen, setIsOpen] = useState(false); // Для мобильного меню
  const navigate = useNavigate();

  // Следим за изменениями в localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Если токен есть, то авторизован
  }, [localStorage.getItem("token")]); // Слушаем изменения токена

  const logout = () => {
    localStorage.removeItem("token"); // Удаляем токен при выходе
    setIsAuthenticated(false); // Обновляем состояние
    navigate("/login"); // Перенаправление на страницу входа
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white shadow-lg z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-[#c49b66]">Барбершоп N1</Link>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl">☰</button>
        </div>
        <ul className="hidden md:flex space-x-6 items-center">
          <li><Link to="/" className="hover:text-[#c49b66]">Главная</Link></li>
          <li><Link to="/about" className="hover:text-[#c49b66]">О нас</Link></li>
          <li><Link to="/services" className="hover:text-[#c49b66]">Услуги</Link></li>
          <li><Link to="/marketplace" className="hover:text-[#c49b66]">Магазин</Link></li>
          <li><Link to="/contact" className="hover:text-[#c49b66]">Контакты</Link></li>

          {isAuthenticated ? (
            <>
              <li><Link to="/profile" className="hover:text-[#c49b66]">Профиль</Link></li>
              <li><button onClick={logout} className="hover:text-[#c49b66]">Выйти</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="hover:text-[#c49b66]">Вход</Link></li>
              <li><Link to="/register" className="hover:text-[#c49b66]">Регистрация</Link></li>
            </>
          )}
        </ul>
      </div>

      {/* Мобильное меню */}
      {isOpen && (
        <ul className="md:hidden bg-black border-t border-gray-700 px-4 pb-4 space-y-2 text-center">
          <li><Link to="/" onClick={() => setIsOpen(false)} className="block text-white hover:text-[#c49b66]">Главная</Link></li>
          <li><Link to="/about" onClick={() => setIsOpen(false)} className="block text-white hover:text-[#c49b66]">О нас</Link></li>
          <li><Link to="/services" onClick={() => setIsOpen(false)} className="block text-white hover:text-[#c49b66]">Услуги</Link></li>
          <li><Link to="/marketplace" onClick={() => setIsOpen(false)} className="block text-white hover:text-[#c49b66]">Магазин</Link></li>
          <li><Link to="/contact" onClick={() => setIsOpen(false)} className="block text-white hover:text-[#c49b66]">Контакты</Link></li>

          {isAuthenticated ? (
            <>
              <li><Link to="/profile" onClick={() => setIsOpen(false)} className="block text-white hover:text-[#c49b66]">Профиль</Link></li>
              <li><button onClick={logout} className="block text-white hover:text-[#c49b66]">Выйти</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={() => setIsOpen(false)} className="block hover:text-[#c49b66]">Вход</Link></li>
              <li><Link to="/register" onClick={() => setIsOpen(false)} className="block hover:text-[#c49b66]">Регистрация</Link></li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
