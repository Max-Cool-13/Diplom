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
import { ThemeProvider } from './context/ThemeContext'; // Импортируем ThemeProvider

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Защищенный маршрут для авторизации
  const ProtectedRoute = ({ element }) => {
    return token ? element : <Navigate to="/login" />;
  };

  return (
    <ThemeProvider> {/* Оборачиваем все приложение в ThemeProvider */}
      <div className="min-h-screen">
        <Navbar />
        <div className="mt-16 px-4">
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
    </ThemeProvider>
  );
}

export default App;