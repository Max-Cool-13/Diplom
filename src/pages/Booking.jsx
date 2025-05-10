import React from "react";

const Booking = () => {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 drop-shadow">Онлайн-запись</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Ваше имя"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 placeholder-gray-400"
          />
          <select className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700">
            <option>Выберите услугу</option>
            <option>Стрижка</option>
            <option>Бритьё</option>
          </select>
          <select className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700">
            <option>Выберите мастера</option>
            <option>Алексей</option>
            <option>Иван</option>
          </select>
          <input
            type="datetime-local"
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <button
            type="submit"
            className="w-full py-2 bg-red-600 hover:bg-red-700 rounded transition shadow"
          >
            Подтвердить запись
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
