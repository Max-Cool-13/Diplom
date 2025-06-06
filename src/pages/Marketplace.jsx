import React from "react";
import shampooImage from "../assets/shampoo.jpg";
import oilImage from "../assets/oil.jpg";
import pasteImage from "../assets/paste.jpg";
import beardCamouflageImage from "../assets/beard_camouflage.jpg";
import showerGelImage from "../assets/shower_gel.jpg";
import menCreamImage from "../assets/men_cream.jpg";

const products = [
  { name: "Шампунь Barbers Pro", price: "850₽", image: shampooImage },
  { name: "Масло для бороды", price: "600₽", image: oilImage },
  { name: "Стайлинг-паста", price: "750₽", image: pasteImage },
  { name: "Камуфляж бороды", price: "700₽", image: beardCamouflageImage },
  { name: "Гель для душа", price: "500₽", image: showerGelImage },
  { name: "Мужской крем", price: "600₽", image: menCreamImage },
];

export default function Marketplace() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="py-12 max-w-full px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-white">
          Магазин
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {products.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:scale-105 transition transform"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h2 className="text-xl font-semibold text-white">{item.name}</h2>
              <p className="text-gray-400 mb-4">{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
