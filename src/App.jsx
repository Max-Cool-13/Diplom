import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Marketplace from './pages/Marketplace';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import TopMasters from './pages/TopMasters';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark'); // Изменение темы

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Функция для переключения темы
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme); // Сохраняем текущую тему в localStorage
    document.body.classList.toggle('dark', !isDarkMode); // Применяем класс к body для изменения темы
  };

  const ProtectedRoute = ({ element }) => {
    return token ? element : <Navigate to="/login" />;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} text-white`}>
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <div className={`mt-16 px-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:serviceId" element={<ServiceDetail />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/top_masters" element={<TopMasters />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
