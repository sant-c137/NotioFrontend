import React, { useState } from 'react';
import Button from './components/Button';
import './ShareNote.css';

function ShareNote({ noteId, onShareSuccess = () => {} }) {
  const [email, setEmail] = useState('');
  const [permissionType, setPermissionType] = useState('view');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? match[2] : null;
  };

  const handleShare = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const csrfToken = getCookie('csrftoken');

      const response = await fetch('http://localhost:8000/api/share_note/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          note_id: noteId,
          shared_user_email: email,
          permission: permissionType,
        }),
      });

      if (response.ok) {
        setMessage('Note shared successfully!');
        onShareSuccess();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to share note.');
      }
    } catch (err) {
      console.error('Error sharing note:', err);
      setError('An error occurred while sharing the note.');
    }
  };

  return (
    <div className="share-container">
      <h4>Share Note</h4>
      <form onSubmit={handleShare} className="share-container">
        <input
          type="email"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <select
          value={permissionType}
          onChange={(e) => setPermissionType(e.target.value)}
        >
          <option value="view">View</option>
          <option value="edit">Edit</option>
        </select>
        <Button type="submit" Text="Share" className="cancel-btn" />
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ShareNote;
