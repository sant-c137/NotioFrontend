import { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/api/login/',
        {
          username,
          password,
        },
        {
          withCredentials: true, // This is crucial for handling cookies
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        alert('Login successful');
        // You might want to redirect or update app state here
      }
    } catch (err) {
      setError('Invalid username or password');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
