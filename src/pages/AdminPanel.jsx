import React from 'react';

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-[#00baff] mb-8 text-center">Панель Администратора</h1>

      <div className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Все пользователи</h2>
        {/* Пример списка пользователей */}
        <ul>
          <li>
            <div className="bg-gray-800 p-4 rounded mb-2">
              <p className="text-[#00baff]">Имя: Иван Иванов</p>
              <p className="text-gray-400">Email: ivan@example.com</p>
              <p className="text-gray-400">Роль: Клиент</p>
            </div>
          </li>
          <li>
            <div className="bg-gray-800 p-4 rounded mb-2">
              <p className="text-[#00baff]">Имя: Мария Петрова</p>
              <p className="text-gray-400">Email: maria@example.com</p>
              <p className="text-gray-400">Роль: Мастер</p>
            </div>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="text-3xl font-semibold mb-4">Все записи</h2>
        {/* Пример списка записей */}
        <ul>
          <li>
            <div className="bg-gray-800 p-4 rounded mb-2">
              <p className="text-[#00baff]">Услуга: Стрижка</p>
              <p className="text-gray-400">Дата: 01.01.2023, 12:00</p>
              <p className="text-gray-400">Клиент: Иван Иванов</p>
              <p className="text-gray-400">Статус: Завершено</p>
            </div>
          </li>
          <li>
            <div className="bg-gray-800 p-4 rounded mb-2">
              <p className="text-[#00baff]">Услуга: Бритье</p>
              <p className="text-gray-400">Дата: 02.01.2023, 14:00</p>
              <p className="text-gray-400">Клиент: Мария Петрова</p>
              <p className="text-gray-400">Статус: Не завершено</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
