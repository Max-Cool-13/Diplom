import React, { useEffect } from 'react';
import background from "../assets/brand.jpeg";  // Дополнительная картинка для 4-го мастера
import barber1 from "../assets/Mary.jpeg";
import barber2 from "../assets/Lili.jpeg";
import barber3 from "../assets/Nadya.jpeg";
import barber4 from "../assets/Lisa.jpeg";

import { motion } from "framer-motion";
import { useTheme } from '../context/ThemeContext'; // Импортируем useTheme для работы с темой

export default function About() {
  const { isDarkMode } = useTheme(); // Получаем состояние темы

  // Эффект для изменения темы на body при загрузке страницы
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={isDarkMode ? "bg-gray-900 text-white min-h-screen py-12" : "bg-white text-black min-h-screen py-12"}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <motion.h1
          className="text-4xl font-extrabold text-center mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          О нас
        </motion.h1>
        
        {/* Блок с изображением */}
<div className="relative mb-12">
  {/* Фотография остается неизменной, без изменения яркости */}
  <img
    src={background}  // Загружаем фоновое изображение
    alt="Barbershop background"
    className="w-full h-96 object-cover"  // Фотография остается без изменений
  />
  {/* Блок текста, который меняет свой фон в зависимости от темы */}
  <div className={`absolute inset-0 ${isDarkMode ? "bg-gray-800 opacity-80" : "bg-gray-100 opacity-80"}`}></div>
  <div className="relative z-10 p-6">
    <motion.p
      className={`text-lg leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-800"}`} // Цвет текста меняется в зависимости от темы
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      Добро пожаловать в наш Барбершоп №1! Мы являемся одним из лучших мест в городе, где можно получить идеальную стрижку и бритье.
    </motion.p>
  </div>
</div>







<motion.div
  className="mt-12 bg-gray-800 p-8 rounded-lg shadow-lg"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1, delay: 1.5 }}
>
  <h2 className="text-3xl text-white font-extrabold text-center mb-6">
    Наши специалисты
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8"> {/* Изменено на 4 колонки для более широкой сетки */}
    {[{ name: "Мэри", role: "Топ Барбер", img: barber1 },
      { name: "Лили", role: "Топ Барбер", img: barber2 },
      { name: "Надя", role: "Клубный Барбер", img: barber3 },
      { name: "Лиза", role: "Клубный Барбер", img: barber4 },  // Новый мастер
    ].map((master, index) => (
      <motion.div
        key={index}
        className={`p-6 rounded-lg shadow-lg text-center h-80 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}  // Фон карточки теперь меняется в зависимости от темы
        whileHover={{ scale: 1.1 }}  // Увеличение карточки при наведении
        transition={{ type: "spring", stiffness: 300 }}
      >
        <img src={master.img} alt={master.name} className="w-32 h-32 rounded-full mx-auto mb-4" />
        <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-black"}`}>{master.name}</h3> {/* Цвет текста теперь меняется в зависимости от темы */}
        <p className={`mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-800"}`}>{master.role}</p> {/* Цвет текста теперь меняется в зависимости от темы */}
      </motion.div>
    ))}
  </div>
</motion.div>




        {/* Блок услуг */}
        <motion.div
          className="mt-12 bg-gray-800 p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <h2 className="text-3xl font-extrabold text-white text-center mb-6">
            Наши услуги
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{ title: "Стрижки", description: "Стрижки любой сложности." },
              { title: "Укладки", description: "Укладки и стайлинг для любого типа волос." },
              { title: "Бритье", description: "Классическое бритье с использованием высококачественных средств." },
              { title: "Окантовка бороды", description: "Подходит для тех, кто хочет подчеркнуть форму бороды." },
              { title: "Оформление бороды", description: "Идеальная форма и аккуратный вид бороды." },
              { title: "Уход за бородой", description: "Специальный уход для поддержания здоровья бороды." },
            ].map((service, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-lg text-center ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`} // Фон карточки меняется в зависимости от темы
                whileHover={{ scale: 1.05 }}  // Увеличение карточки при наведении
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-black"}`}>{service.title}</h3> {/* Цвет текста в зависимости от темы */}
                <p className={`mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-800"}`}>{service.description}</p> {/* Цвет текста в зависимости от темы */}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Кнопка для записи на услугу */}
        <div className="mt-12 text-center">
          <motion.a
            href="/services"
            className={`text-xl font-semibold transition duration-300 py-2 px-6 rounded-full border-2 ${isDarkMode ? "border-[#00baff] bg-[#00baff] hover:bg-[#00bbffcf] text-white" : "border-[#8a2be2] bg-[#8a2be2] hover:bg-[#892be2d8] text-white"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            Записаться на услугу
          </motion.a>
        </div>
      </div>
    </div>
  );
}
