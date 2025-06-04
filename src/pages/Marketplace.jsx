import React from "react";

const products = [
  { name: "Шампунь Barbers Pro", price: "850₽", image: "/assets/shampoo.jpg" },
  { name: "Масло для бороды", price: "600₽", image: "/assets/oil.jpg" },
  { name: "Стайлинг-паста", price: "750₽", image: "/assets/paste.jpg" },
];

export default function Marketplace() {
  return (
    <div className="py-12 bg-gray-900 text-white max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-[#00baff]">
        Магазин
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {products.map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-800 text-white p-4 rounded-lg shadow-lg hover:scale-105 transition transform"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h2 className="text-xl font-semibold text-[#00baff]">{item.name}</h2>
            <p className="text-gray-400">{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
