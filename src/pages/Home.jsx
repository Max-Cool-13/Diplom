import React, { useEffect, useState } from "react";

const Home = () => {
  const [message, setMessage] = useState("Загрузка...");

  useEffect(() => {
    fetch("http://localhost:8000/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Ошибка запроса к backend"));
  }, []);

  return (
    <div className="text-white bg-black min-h-screen flex items-center justify-center">
      <h1 className="text-3xl">{message}</h1>
    </div>
  );
};

export default Home;