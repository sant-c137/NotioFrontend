import './Layout.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Layout = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handleNotes = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.get(
        'http://localhost:8000/api/get_user_notes/',
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
          },
        }
      );

      setNotes(data.notes);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleNotes();
  }, []);

  return (
    <div className="layout-container">
      <h2>Notes</h2>
      <button onClick={handleNotes}>Refresh Notes</button>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && notes.length === 0 && <p>No notes available</p>}

      {notes.length > 0 && (
        <ul className="notes-list">
          {notes.map((note) => (
            <li key={note.note_id} className="note-item">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <small>
                Created: {new Date(note.creation_date).toLocaleString()}
              </small>
              <br />
              <small>
                Last modified:{' '}
                {new Date(note.last_modification).toLocaleString()}
              </small>
              <br />
              <span>Status: {note.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Layout;
