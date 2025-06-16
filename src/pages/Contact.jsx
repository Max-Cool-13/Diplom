import { FaVk, FaTelegramPlane, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext'; // Импортируем useTheme для работы с темой

export default function Contact() {
  const { isDarkMode } = useTheme(); // Получаем текущую тему

  return (
    <div className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-[#050272]"} py-12`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className={`text-4xl font-extrabold text-center mb-8 ${isDarkMode ? "text-white" : "text-[#050272]"}`}>
          Контакты
        </h1>

        <div className="space-y-6">
          <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-[#050272]"}`}>
            <span className="font-semibold">📍 Адрес:</span> Саранск, ул. Васенко, 9
          </p>
          <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-[#050272]"}`}>
            <span className="font-semibold">📞 Телефон:</span> +7 (929) 749-01-01
          </p>
          <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-[#050272]"}`}>
            <span className="font-semibold">📧 Email:</span> barberN1@mail.ru
          </p>

          <div className="flex space-x-6 justify-center">
            <a
              href="https://vk.com/barbershopnumberone"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-2xl ${isDarkMode ? "text-[#00baff] hover:text-[#8a2be2]" : "text-[#8a2be2] hover:text-[#00baff]"}  transition duration-300`}
            >
              <FaVk />
            </a>
            <a
              href="https://t.me/mashunstrik"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-2xl ${isDarkMode ? "text-[#00baff] hover:text-[#8a2be2]" : "text-[#8a2be2] hover:text-[#00baff]"}  transition duration-300`}
            >
              <FaTelegramPlane />
            </a>
            <a
              href="https://wa.me/79297490101"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-2xl ${isDarkMode ? "text-[#00baff] hover:text-[#8a2be2]" : "text-[#8a2be2] hover:text-[#00baff]"}  transition duration-300`}
            >
              <FaWhatsapp />
            </a>
            <a
              href="mailto:barberN1@mail.ru"
              className={`text-2xl ${isDarkMode ? "text-[#00baff] hover:text-[#8a2be2]" : "text-[#8a2be2] hover:text-[#00baff]"}  transition duration-300`}
            >
              <FaEnvelope />
            </a>
          </div>
        </div>

        <div className="mt-8">
          <h2 className={`text-2xl font-semibold text-center mb-6 ${isDarkMode ? "text-white" : "text-[#050272]"}`}>
            Напишите нам
          </h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Ваше имя"
              className={`w-full px-4 py-2 rounded border ${isDarkMode ? 'border-[#00baff] bg-gray-700 text-white focus:ring-[#00baff]' : 'border-[#8a2be2] bg-white text-gray-700 focus:ring-[#8a2be2]'}`}
            />
            <input
              type="email"
              placeholder="Ваш email"
              className={`w-full px-4 py-2 rounded border ${isDarkMode ? 'border-[#00baff] bg-gray-700 text-white focus:ring-[#00baff]' : 'border-[#8a2be2] bg-white text-gray-700 focus:ring-[#8a2be2]'}`}
            />
            <textarea
              placeholder="Ваше сообщение"
              className={`w-full px-4 py-2 rounded border ${isDarkMode ? 'border-[#00baff] bg-gray-700 text-white focus:ring-[#00baff]' : 'border-[#8a2be2] bg-white text-gray-700 focus:ring-[#8a2be2]'}`}
            />
            <button
              type="submit"
              className={`w-full py-2 rounded-full text-lg ${isDarkMode ? "bg-[#00baff] hover:bg-[#00bbffcf] text-white" : "bg-[#8a2be2] hover:bg-[#892be2d8] text-white"} transition duration-300`}
            >
              Отправить
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
