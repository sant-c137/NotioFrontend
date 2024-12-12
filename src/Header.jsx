import { useState, useEffect } from 'react';
import Logout from './auth/Logout';
import './Header.css';

const Header = () => {
  const [username, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');

  const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? match[2] : null;
  };

  const determineGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good morning';
    } else if (currentHour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
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
        setUserName(data.username);
      }
    } catch (err) {
      console.error('Error checking authentication status:', err);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    setGreeting(determineGreeting());
  }, []);

  return (
    <header>
      <h1>Notio</h1>

      <h2>
        {greeting}, {username.toUpperCase()}
      </h2>

      <Logout />
    </header>
  );
};

export default Header;
