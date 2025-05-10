import React from "react";
import background1 from "../assets/bg1.jpg";
import background2 from "../assets/bg2.jpg";
import background3 from "../assets/bg3.jpg";

export default function About() {
  return (
    <div className="bg-gray-900 min-h-screen py-12 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <h1 className="text-4xl font-extrabold text-center text-[#c49b66] mb-8">
          О нас
        </h1>
        
        {/* Описание */}
        <div className="relative overflow-hidden rounded-lg shadow-lg">
          <img
            src="https://static.tildacdn.com/tild6635-3265-4265-b831-396331396134/barbershopn1.jpg" // Замените на изображение для фона
            alt="Barbershop background"
            className="w-full h-72 object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative z-10 p-6">
            <p className="text-lg text-gray-300 leading-relaxed">
              Добро пожаловать в наш Барбершоп №1!
              Мы являемся одним из лучших мест в городе, 
              где можно получить идеальную стрижку и бритье. 
              Наша команда состоит из профессиональных барберов,
              которые готовы предложить вам лучший сервис
              и качество обслуживания. 
              Не упустите возможность посетить наш барбершоп
              и получить незабываемый опыт стрижки!

            </p>
          </div>
        </div>

        {/* Блок с мастерами */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Карточка мастера 1 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-all duration-300">
            <img
              src={background1}
              alt="Master 1"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-[#c49b66] mb-2 hover:text-[#c49b66]">
              Иван Иванов
            </h3>
            <p className="text-gray-300 mb-4">Мастер по стрижкам и укладкам</p>
            <p className="text-sm text-gray-400">
              Иван — опытный мастер, специализирующийся на мужских стрижках
              и укладках. Он всегда в поиске новых трендов и стилей.
            </p>
          </div>
          
          {/* Карточка мастера 2 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-all duration-300">
            <img
              src={background2}
              alt="Master 2"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-[#c49b66] mb-2 hover:text-[#c49b66]">
              Мария Петрова
            </h3>
            <p className="text-gray-300 mb-4">Барбер и стилист</p>
            <p className="text-sm text-gray-400">
              Мария занимается не только стрижками, но и предложит вам стиль
              и укладку, которые идеально подойдут под вашу форму лица и стиль.
            </p>
          </div>

          {/* Карточка мастера 3 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-all duration-300">
            <img
              src={background3}
              alt="Master 3"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-[#c49b66] mb-2 hover:text-[#c49b66]">
              Алексей Смирнов
            </h3>
            <p className="text-gray-300 mb-4">Барбер и визажист</p>
            <p className="text-sm text-gray-400">
              Алексей — специалист по классическим и современным стрижкам.
              Он также предлагает услуги по уходу за бородой.
            </p>
          </div>
        </div>

        {/* Блок услуг */}
        <div className="mt-12 bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-extrabold text-[#c49b66] text-center mb-6">
            Наши услуги
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg text-center transform hover:scale-105 transition-all duration-300">
              <h3 className="text-xl font-semibold text-[#c49b66] mb-2 hover:text-[#c49b66]">
                Стрижки
              </h3>
              <p className="text-gray-300 mb-4">
                Стрижки любой сложности. Мужские, подростковые и классические.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg text-center transform hover:scale-105 transition-all duration-300">
              <h3 className="text-xl font-semibold text-[#c49b66] mb-2 hover:text-[#c49b66]">
                Укладки
              </h3>
              <p className="text-gray-300 mb-4">
                Укладки и стайлинг для любого типа волос.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg text-center transform hover:scale-105 transition-all duration-300">
              <h3 className="text-xl font-semibold text-[#c49b66] mb-2 hover:text-[#c49b66]">
                Бритье
              </h3>
              <p className="text-gray-300 mb-4">
                Классическое бритье с использованием высококачественных средств.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg text-center transform hover:scale-105 transition-all duration-300">
              <h3 className="text-xl font-semibold text-[#c49b66] mb-2 hover:text-[#c49b66]">
                Уход за бородой
              </h3>
              <p className="text-gray-300 mb-4">
                Услуги по уходу и оформлению бороды и усов.
              </p>
            </div>
          </div>
        </div>

        {/* Призыв к действию */}
        <div className="mt-12 text-center">
          <a
            href="/services"
            className="text-xl font-semibold text-[#c49b66] hover:text-[#c49b66] transition"
          >
            Записаться на услугу
          </a>
        </div>
      </div>
    </div>
  );
}
