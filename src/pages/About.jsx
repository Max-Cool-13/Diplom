import React from "react";
import background1 from "../assets/Fon.jpeg";
import background2 from "../assets/bg2.jpg";
import background3 from "../assets/bg3.jpg";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="bg-gray-900 min-h-screen py-12 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <motion.h1
          className="text-4xl font-extrabold text-center text-[#00baff] mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          О нас
        </motion.h1>
        
        {/* Блок с изображением */}
        <div className="relative overflow-hidden rounded-lg shadow-lg">
          <img
            src="https://static.tildacdn.com/tild6635-3265-4265-b831-396331396134/barbershopn1.jpg"
            alt="Barbershop background"
            className="w-full h-72 object-cover opacity-50"
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
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {[{ name: "Иван Иванов", role: "Мастер по стрижкам", img: background1 },
            { name: "Мария Петрова", role: "Барбер и стилист", img: background2 },
            { name: "Алексей Смирнов", role: "Барбер и визажист", img: background3 },
          ].map((master, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <img src={master.img} alt={master.name} className="w-32 h-32 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#00baff] mb-2">{master.name}</h3>
              <p className="text-gray-300 mb-4">{master.role}</p>
            </div>
          ))}
        </motion.div>

        {/* Блок услуг */}
        <motion.div
          className="mt-12 bg-gray-800 p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <h2 className="text-3xl font-extrabold text-[#00baff] text-center mb-6">
            Наши услуги
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[{ title: "Стрижки", description: "Стрижки любой сложности." },
              { title: "Укладки", description: "Укладки и стайлинг для любого типа волос." },
              { title: "Бритье", description: "Классическое бритье с использованием высококачественных средств." },
              { title: "Уход за бородой", description: "Услуги по уходу за бородой и усами." },
            ].map((service, index) => (
              <div key={index} className="bg-gray-700 p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold text-[#00baff] mb-2">{service.title}</h3>
                <p className="text-gray-300 mb-4">{service.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Кнопка для записи на услугу */}
        <div className="mt-12 text-center">
          <motion.a
            href="/services"
            className="text-xl font-semibold text-[#00baff] hover:text-[#00baff] transition duration-300"
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
