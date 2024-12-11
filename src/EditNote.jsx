import { useState } from 'react';
import Button from './components/Button';
import './EditNote.css';

const EditNote = ({ note, onEditSuccess }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [status, setStatus] = useState(note.status);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? match[2] : null;
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const csrfToken = getCookie('csrftoken');
      const response = await fetch(
        `http://localhost:8000/api/edit_note/${note.note_id}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
          body: JSON.stringify({ title, content, status }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        onEditSuccess(); // Llama al callback para recargar la lista de notas
        alert(data.message); // Muestra el mensaje de éxito
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update the note.');
      }
    } catch (err) {
      console.error('Error updating note:', err);
      setError('An error occurred while updating the note.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleEdit} className="edit-note-form">
      <h3>Edit Note</h3>
      <div>
        <label htmlFor="edit-title">Title</label>
        <input
          type="text"
          id="edit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="edit-content">Content</label>
        <textarea
          id="edit-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="edit-status">Status</label>
        <input
          type="text"
          id="edit-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        Text={isLoading ? 'Saving...' : 'Save Changes'}
        className="cancel-btn"
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default EditNote;
