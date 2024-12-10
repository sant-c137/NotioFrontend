import { useState, useEffect } from 'react';
import './GetSharedNotes.css';

function GetSharedNotes() {
  const [sharedNotes, setSharedNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? match[2] : null;
  };

  const fetchSharedNotes = async () => {
    setLoading(true);
    setError('');

    try {
      const csrfToken = getCookie('csrftoken');
      const response = await fetch(
        'http://localhost:8000/api/get_shared_notes/',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSharedNotes(data.shared_notes);
    } catch (err) {
      console.error('Error:', err);
      setError(`Failed to load shared notes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedNotes();
  }, []);

  return (
    <div>
      <h1>Shared Notes</h1>
      <button onClick={fetchSharedNotes}>Fetch Shared Notes</button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {sharedNotes.length === 0 && !loading && (
        <p>No shared notes available.</p>
      )}

      {sharedNotes.map((sharedNote) => (
        <div
          key={sharedNote.note_id}
          style={{
            border: '1px solid #ddd',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          <h3>{sharedNote.title}</h3>
          <p>{sharedNote.content}</p>
          <p>
            <strong>Status:</strong> {sharedNote.status}
          </p>
          <p>
            <strong>Shared By:</strong> {sharedNote.shared_by}
          </p>
          <p>
            <strong>Permission:</strong> {sharedNote.permission}
          </p>
          <p>
            <strong>Last Modified:</strong>{' '}
            {new Date(sharedNote.last_modification).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default GetSharedNotes;
