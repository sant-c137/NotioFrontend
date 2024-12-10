import { useState, useEffect } from 'react';
import DeleteNote from './DeleteNote';
import EditNote from './EditNote';
import ShareNote from './ShareNote';
import './App.css';

function GetNote() {
  const [notes, setNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]); // Added shared notes state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState(null); // Track the note being edited
  const [username, setUserName] = useState('');

  const fetchNotes = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        'http://localhost:8000/api/get_user_notes/',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNotes(data.notes);
    } catch (err) {
      console.error('Error:', err);
      setError(`Failed to load notes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchSharedNotes = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        'http://localhost:8000/api/get_shared_notes/',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
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

  const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? match[2] : null;
  };

  const csrfToken = getCookie('csrftoken');

  const checkAuthStatus = async () => {
    try {
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
    fetchNotes();
    fetchSharedNotes();
    checkAuthStatus();
  }, []);

  const handleEditClick = (note) => {
    setEditingNote(note);
  };

  const handleEditSuccess = () => {
    setEditingNote(null); // Close the edit form
    fetchNotes(); // Refresh the notes list
  };

  return (
    <div>
      <h1>Notio</h1>

      <h3>Welcome back, {username}</h3>
      <button onClick={fetchNotes}>Fetch My Notes</button>
      <button onClick={fetchSharedNotes}>Fetch Shared Notes</button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {notes.length === 0 && sharedNotes.length === 0 && !loading && (
        <p>No notes available.</p>
      )}

      <h2>My Notes</h2>
      {editingNote ? (
        <EditNote note={editingNote} onEditSuccess={handleEditSuccess} />
      ) : (
        notes.map((note) => (
          <div
            key={note.note_id}
            style={{
              border: '1px solid #ddd',
              padding: '10px',
              marginBottom: '10px',
            }}
          >
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <p>
              <strong>Status:</strong> {note.status}
            </p>
            <p>
              <strong>Created:</strong>{' '}
              {new Date(note.creation_date).toLocaleString()}
            </p>
            <p>
              <strong>Last Modified:</strong>{' '}
              {new Date(note.last_modification).toLocaleString()}
            </p>
            <button
              onClick={() => handleEditClick(note)}
              style={{ marginRight: '10px' }}
            >
              Edit
            </button>
            <DeleteNote noteId={note.note_id} onDeleteSuccess={fetchNotes} />
            <ShareNote
              noteId={note.note_id}
              onShareSuccess={fetchSharedNotes}
            />
          </div>
        ))
      )}
    </div>
  );
}

export default GetNote;
