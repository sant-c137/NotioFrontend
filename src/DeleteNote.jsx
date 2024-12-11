import { useState } from 'react';
import Button from './components/Button';
import './DeleteNote.css';

const DeleteNote = ({ noteId, onDeleteSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? match[2] : null;
  };

  const handleDelete = async () => {
    const csrfToken = getCookie('csrftoken');

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `http://localhost:8000/api/delete_note/${noteId}/`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        onDeleteSuccess(); // Actualiza la UI y cierra la modal tras eliminar la nota
        alert(data.message); // Mensaje de éxito
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete the note.');
      }
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('An error occurred while deleting the note.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="delete-note-container">
      <div className="confirm-delete">
        <p>Are you sure you want to delete this note?</p>

        <Button
          onClick={handleDelete}
          disabled={isLoading}
          Text={isLoading ? 'Deleting...' : 'Yes, Delete'}
          className="confirm-btn"
        />

        <Button
          onClick={onCancel} // Llamamos a `onCancel` para cerrar sin eliminar
          className="cancel-btn"
          Text="Cancel"
        />

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default DeleteNote;
