import { useState, useEffect } from 'react';
import Logout from './auth/Logout';
import './Header.css';

const Header = () => {
  const [username, setUserName] = useState('');

  const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? match[2] : null;
  };

  const checkAuthStatus = async () => {
    try {
      const csrfToken = getCookie('csrftoken');

      const response = await fetch('http://localhost:8000/api/check_session/', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.username);
        setUserName(data.username);
      }
    } catch (err) {
      console.error('Error checking authentication status:', err);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  });

  return (
    <header>
      <h1>Notio</h1>

      <h2>Welcome back, {username}</h2>

      <Logout />
    </header>
  );
};

export default Header;
