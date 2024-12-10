import { useAuth } from '../auth/AuthProvider';
import './Logout.css';

const Logout = () => {
  const { updateAuthStatus } = useAuth();

  const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? match[2] : null;
  };

  const handleLogout = async () => {
    const csrfToken = getCookie('csrftoken');
    try {
      const response = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
      });

      if (response.ok) {
        updateAuthStatus(false);
      } else {
        console.error('Failed to log out');
        alert('Logout failed. Please try again.');
      }
    } catch (err) {
      console.error('Logout error:', err);
      alert('An error occurred during logout.');
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default Logout;
