import React from "react";
import background from "../assets/brand.jpeg";  // Дополнительная картинка для 4-го мастера
import barber1 from "../assets/Mary.jpeg";
import barber2 from "../assets/Lili.jpeg";
import barber3 from "../assets/Nadya.jpeg";
import barber4 from "../assets/Lisa.jpeg";

import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="bg-gray-900 min-h-screen py-12 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <motion.h1
          className="text-4xl font-extrabold text-center text-white mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          О нас
        </motion.h1>
        
        {/* Блок с изображением */}
        <div className="relative overflow-hidden rounded-lg shadow-lg">
          <img
            src={background}  // Загружаем фоновое изображение
            alt="Barbershop background"
            className="w-full h-96 object-cover opacity-150"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative z-10 p-6">
            <motion.p
              className="text-lg text-gray-300 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Добро пожаловать в наш Барбершоп №1! Мы являемся одним из лучших мест в городе, где можно получить идеальную стрижку и бритье.
            </motion.p>
          </div>
        </div>

        {/* Блок с мастерами */}
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {[{ name: "Мэри", role: "Топ Барбер", img: barber1 },
            { name: "Лили", role: "Топ Барбер", img: barber2 },
            { name: "Надя", role: "Клубный Барбер", img: barber3 },
            { name: "Лиза", role: "Клубный Барбер", img: barber4 },  // Новый мастер
          ].map((master, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg text-center h-80"  // Установлен фиксированный размер карточки
              whileHover={{ scale: 1.1 }}  // Увеличение карточки при наведении
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img src={master.img} alt={master.name} className="w-32 h-32 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{master.name}</h3>
              <p className="text-gray-300 mb-4">{master.role}</p>
            </motion.div>
          ))}
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
                className="bg-gray-700 p-6 rounded-lg text-center"
                whileHover={{ scale: 1.05 }}  // Увеличение карточки при наведении
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-gray-300 mb-4">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Кнопка для записи на услугу */}
        <div className="mt-12 text-center">
          <motion.a
            href="/services"
            className="text-xl font-semibold text-[#00baff] hover:text-[#00baff] transition duration-300 py-2 px-6 rounded-full border-2 border-[#00baff] bg-transparent hover:bg-[#00baff] hover:text-white"
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
