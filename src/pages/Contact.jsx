import { FaVk, FaTelegramPlane, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

export default function Contact() {
  return (
    <div className="bg-gray-900 text-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center text-[#c49b66] mb-8">Контакты</h1>

        <div className="space-y-6">
          <p className="text-lg text-gray-300">
            <span className="font-semibold">📍 Адрес:</span>  Саранск, ул. Васенко, 9
          </p>
          <p className="text-lg text-gray-300">
            <span className="font-semibold">📞 Телефон:</span> +7 (929) 749-01-01
          </p>
          <p className="text-lg text-gray-300 mb-4">
            <span className="font-semibold">📧 Email:</span> info@barbershopn1.ru
          </p>
          
          {/* Социальные сети и мессенджеры */}
          <div className="flex space-x-6 justify-center">
            <a
              href="https://vk.com/your_vk_page"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-[#c49b66] hover:text-[#a18b5d] transition duration-300"
            >
              <FaVk />
            </a>
            <a
              href="https://t.me/your_telegram"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-[#c49b66] hover:text-[#a18b5d] transition duration-300"
            >
              <FaTelegramPlane />
            </a>
            <a
              href="https://wa.me/79001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-[#c49b66] hover:text-[#a18b5d] transition duration-300"
            >
              <FaWhatsapp />
            </a>
            <a
              href="mailto:info@barbershopn1.ru"
              className="text-2xl text-[#c49b66] hover:text-[#a18b5d] transition duration-300"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>

        {/* Формы */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-center text-[#c49b66] mb-6">Напишите нам</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Ваше имя"
              className="w-full px-4 py-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#c49b66]"
            />
            <input
              type="email"
              placeholder="Ваш email"
              className="w-full px-4 py-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#c49b66]"
            />
            <textarea
              placeholder="Ваше сообщение"
              className="w-full px-4 py-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#c49b66]"
            />
            <button
              type="submit"
              className="w-full bg-[#c49b66] text-black py-2 rounded-full text-lg hover:bg-[#a18b5d] transition duration-300"
            >
              Отправить
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
