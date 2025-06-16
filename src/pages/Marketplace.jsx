import React from "react";
import shampooImage from "../assets/shampoo.jpg";
import oilImage from "../assets/oil.jpg";
import pasteImage from "../assets/paste.jpg";
import beardCamouflageImage from "../assets/beard_camouflage.jpg";
import showerGelImage from "../assets/shower_gel.jpg";
import menCreamImage from "../assets/men_cream.jpg";
import { useTheme } from '../context/ThemeContext'; // Импортируем useTheme для работы с темой

const products = [
  { name: "Шампунь Barbers Pro", price: "850₽", image: shampooImage },
  { name: "Масло для бороды", price: "600₽", image: oilImage },
  { name: "Стайлинг-паста", price: "750₽", image: pasteImage },
  { name: "Камуфляж бороды", price: "700₽", image: beardCamouflageImage },
  { name: "Гель для душа", price: "500₽", image: showerGelImage },
  { name: "Мужской крем", price: "600₽", image: menCreamImage },
];

export default function Marketplace() {
  const { isDarkMode } = useTheme(); // Получаем текущую тему

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} ${isDarkMode ? 'text-white' : 'text-[#050272]'}`}>
      <div className="py-12 max-w-full px-4 sm:px-6 lg:px-8">
        <h1 className={`text-4xl font-extrabold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-[#050272]'}`}>
          Магазин
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
          {products.map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-lg shadow-lg text-center h-80 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-all duration-300`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-[#00baff]' : 'text-[#8a2be2]'} mb-2`}>
                {item.name}
              </h2>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
