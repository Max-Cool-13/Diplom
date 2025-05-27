
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail'; // Новый импорт для страницы с деталями услуги
import Marketplace from './pages/Marketplace';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Navbar from './components/Navbar'; // Импортируем Navbar вместо Header

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Хук для отслеживания изменений в localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token')); // Обновляем состояние при изменении localStorage
    };

    window.addEventListener('storage', handleStorageChange); // Слушаем изменения в localStorage

    return () => {
      window.removeEventListener('storage', handleStorageChange); // Убираем слушатель при размонтировании
    };
  }, []);

  // Защищенные маршруты: только для авторизованных пользователей
  const ProtectedRoute = ({ element }) => {
    return token ? element : <Navigate to="/login" />; // Если токен есть, показываем элемент, иначе редиректим на /login
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="mt-16 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          
          {/* Новый маршрут для страницы с деталями услуги */}
          <Route path="/service/:serviceId" element={<ServiceDetail />} /> 

          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Защищенный маршрут для профиля */}
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
