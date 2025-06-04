import React, { useEffect } from 'react';
import background1 from "../assets/Fon.jpeg";
import background2 from "../assets/bg2.jpg";
import background3 from "../assets/bg3.jpg";
import { motion } from 'framer-motion';

const Home = () => {
  useEffect(() => {
    // Добавляем скрипт для подключения к API Яндекса
    const script = document.createElement('script');
    script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=ВАШ_API_КЛЮЧ"; // Замените на ваш ключ API
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.ymaps.ready(initMap);
    };

    const initMap = () => {
      // Инициализация карты с координатами
      const myMap = new window.ymaps.Map('map', {
        center: [54.195207, 45.172975], // координаты для центра карты
        zoom: 14,
        controls: ['zoomControl', 'searchControl']
      });

      // Создаем геообъект с типом "Точка"
      const myGeoObject = new window.ymaps.GeoObject({
        geometry: {
          type: "Point",
          coordinates: [54.195207, 45.172975]
        },
        properties: {
          iconContent: 'Барбершоп N1',
          hintContent: 'ул. Васенко, 9'
        }
      }, {
        preset: 'islands#blackStretchyIcon',
        draggable: true
      });

      // Добавляем метку на карту
      myMap.geoObjects.add(myGeoObject);

      // Добавляем несколько меток с разными стилями
      myMap.geoObjects
        .add(new window.ymaps.Placemark([55.684758, 37.738521], {
          balloonContent: 'Цвет <strong>воды пляжа Бонди</strong>'
        }, {
          preset: 'islands#icon',
          iconColor: '#0095b6'
        }))
        .add(new window.ymaps.Placemark([55.833436, 37.715175], {
          balloonContent: '<strong>серобуромалиновый</strong> цвет'
        }, {
          preset: 'islands#dotIcon',
          iconColor: '#735184'
        }))
        .add(new window.ymaps.Placemark([55.687086, 37.529789], {
          balloonContent: 'Цвет <strong>влюбленной жабы</strong>'
        }, {
          preset: 'islands#circleIcon',
          iconColor: '#3caa3c'
        }))
        .add(new window.ymaps.Placemark([55.642063, 37.656123], {
          balloonContent: 'Цвет <strong>красный</strong>'
        }, {
          preset: 'islands#redSportIcon'
        }))
        .add(new window.ymaps.Placemark([55.694843, 37.435023], {
          balloonContent: 'Цвет <strong>носика Гены</strong>',
          iconCaption: 'Очень длинный, но невероятно интересный текст'
        }, {
          preset: 'islands#greenDotIconWithCaption'
        }));
    };

    return () => {
      document.body.removeChild(script); // Убираем скрипт при размонтировании компонента
    };
  }, []);

  return (
    <div className="text-white bg-gray-900 min-h-screen"> {/* Изменен фон на темный серый (#2d2d2d) */}
      {/* Главный экран с фоном */}
      <div className="relative h-screen overflow-hidden">
        <img
          src={background1}
          alt="bg"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <motion.h1
            className="text-5xl md:text-6xl font-bold drop-shadow-lg text-gradient"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Барбершоп N1
          </motion.h1>
          <motion.p
            className="mt-4 text-xl md:text-2xl drop-shadow text-gradient"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Стиль на любой вкус
          </motion.p>
          <motion.a
            href="/services" // Изменено на /services
            className="mt-6 bg-[#00baff] hover:bg-[#8a2be2] text-white px-6 py-3 rounded-full transition shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Записаться
          </motion.a>
        </div>
      </div>

      {/* Яндекс Карта с метками */}
      <div className="my-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gradient">Наша локация</h2>
        <div className="w-full max-w-4xl mx-auto h-96 border-4 border-[#00baff] rounded-lg shadow-lg overflow-hidden">
          <div id="map" style={{ width: '100%', height: '100%' }}></div> {/* Контейнер для карты */}
        </div>
      </div>
    </div>
  );
};

export default Home;
