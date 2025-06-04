import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [masters, setMasters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(`${API_URL}/users`);
        const mastersResponse = await axios.get(`${API_URL}/masters`);
        setUsers(usersResponse.data);
        setMasters(mastersResponse.data);
      } catch (error) {
        console.error("Ошибка при загрузке данных", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${API_URL}/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Ошибка при удалении пользователя", error);
    }
  };

  const handleDeleteMaster = async (masterId) => {
    try {
      await axios.delete(`${API_URL}/masters/${masterId}`);
      setMasters(masters.filter(master => master.id !== masterId));
    } catch (error) {
      console.error("Ошибка при удалении мастера", error);
    }
  };

  return (
    <div>
      <h1>Администрирование</h1>
      <div>
        <h2>Пользователи</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.username} <button onClick={() => handleDeleteUser(user.id)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Мастера</h2>
        <ul>
          {masters.map((master) => (
            <li key={master.id}>
              {master.name} <button onClick={() => handleDeleteMaster(master.id)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
