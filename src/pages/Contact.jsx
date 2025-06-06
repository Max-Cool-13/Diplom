import { FaVk, FaTelegramPlane, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

export default function Contact() {
  return (
    <div className="bg-gray-900 text-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center text-white  mb-8">
          Контакты
        </h1>

        <div className="space-y-6">
          <p className="text-lg text-gray-300">
            <span className="font-semibold">📍 Адрес:</span> Саранск, ул. Васенко, 9
          </p>
          <p className="text-lg text-gray-300">
            <span className="font-semibold">📞 Телефон:</span> +7 (929) 749-01-01
          </p>
          <p className="text-lg text-gray-300 mb-4">
            <span className="font-semibold">📧 Email:</span> barberN1@mail.ru
          </p>

          <div className="flex space-x-6 justify-center">
            <a
              href="https://vk.com/barbershopnumberone"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-[#00baff] hover:text-[#8a2be2] transition duration-300"
            >
              <FaVk />
            </a>
            <a
              href="https://t.me/mashunstrik"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-[#00baff] hover:text-[#8a2be2] transition duration-300"
            >
              <FaTelegramPlane />
            </a>
            <a
              href="https://wa.me/79297490101"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-[#00baff] hover:text-[#8a2be2] transition duration-300"
            >
              <FaWhatsapp />
            </a>
            <a
              href="mailto:barberN1@mail.ru"
              className="text-2xl text-[#00baff] hover:text-[#8a2be2] transition duration-300"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-center text-white  mb-6">
            Напишите нам
          </h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Ваше имя"
              className="w-full px-4 py-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#00baff]"
            />
            <input
              type="email"
              placeholder="Ваш email"
              className="w-full px-4 py-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#00baff]"
            />
            <textarea
              placeholder="Ваше сообщение"
              className="w-full px-4 py-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-[#00baff]"
            />
            <button
              type="submit"
              className="w-full bg-[#00baff] text-white py-2 rounded-full text-lg hover:bg-[#8a2be2] transition duration-300"
            >
              Отправить
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
