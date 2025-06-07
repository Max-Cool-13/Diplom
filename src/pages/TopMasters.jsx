import React, { useState } from 'react';

const TopMasters = () => {
  const [masters] = useState([  // Здесь данные можно вручную задать, как пример
    { id: 1, name: 'Иван Иванов', orders_count: 25, rating: 4.9 },
    { id: 2, name: 'Мария Петрова', orders_count: 30, rating: 4.8 },
    { id: 3, name: 'Алексей Смирнов', orders_count: 22, rating: 4.7 },
    { id: 4, name: 'Елена Кузнецова', orders_count: 20, rating: 4.6 },
  ]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-[#00baff] mb-8 text-center">Лучшие мастера месяца</h1>

      <div>
        <h2 className="text-3xl font-semibold mb-4">Топ мастера по количеству заказов</h2>
        <ul>
          {masters.map((master) => (
            <li key={master.id}>
              <div className="bg-gray-800 p-4 rounded mb-2">
                <p className="text-[#00baff]">Имя: {master.name}</p>
                <p className="text-gray-400">Количество заказов: {master.orders_count}</p>
                <p className="text-gray-400">Рейтинг: {master.rating}</p> {/* Дополнительная информация */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TopMasters;
