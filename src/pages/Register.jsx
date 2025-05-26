import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client'); // по умолчанию client
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(
        `${API_URL}/register/`,
        {
          username: name,
          email: email,
          password: password,
          role: role,  // передаём выбранную роль
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      navigate('/login'); // Редирект после успешной регистрации
    } catch (err) {
      setError('Ошибка регистрации. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <form onSubmit={handleSubmit} className="bg-gray-100 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Регистрация</h1>

        <input
          type="text"
          placeholder="Имя"
          className="w-full mb-4 px-4 py-2 rounded border"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 rounded border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Пароль"
          className="w-full mb-4 px-4 py-2 rounded border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="mb-6">
          <label className="mr-4 font-semibold">Роль:</label>
          <label className="mr-4">
            <input
              type="radio"
              name="role"
              value="client"
              checked={role === 'client'}
              onChange={() => setRole('client')}
            />{' '}
            Клиент
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="master"
              checked={role === 'master'}
              onChange={() => setRole('master')}
            />{' '}
            Мастер
          </label>
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <button
          type="submit"
          className="w-full bg-black hover:bg-gray-900 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
}
