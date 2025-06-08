import React, { createContext, useState, useContext } from 'react';

// Создаем контекст для темы
const ThemeContext = createContext();

// Хук для использования контекста
export const useTheme = () => useContext(ThemeContext);

// Провайдер для оборачивания приложения и предоставления глобального состояния темы
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  // Переключатель темы
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme); // Сохраняем текущую тему в localStorage
    document.body.classList.toggle('dark', !isDarkMode); // Применяем класс к body для изменения темы
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
