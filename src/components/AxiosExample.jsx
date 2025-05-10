import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AxiosExample = () => {
  const [data, setData] = useState(null); // Состояние для данных
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние ошибки

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts/1')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Ошибка при загрузке данных');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>{data.title}</h2>
      <p>{data.body}</p>
    </div>
  );
};

export default AxiosExample;
