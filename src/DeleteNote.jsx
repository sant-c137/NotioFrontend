import { useState } from 'react';
import './DeleteNote.css';

const DeleteNote = ({ noteId, onDeleteSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

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
        onDeleteSuccess(); // Callback para actualizar la UI después de eliminar la nota
        alert(data.message); // Muestra el mensaje de éxito
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

  const handleConfirmDelete = () => {
    setShowConfirm(true); // Muestra el mensaje de confirmación
  };

  const handleCancelDelete = () => {
    setShowConfirm(false); // Cierra el mensaje de confirmación
  };

  return (
    <div className="delete-note-container">
      {showConfirm ? (
        <div className="confirm-delete">
          <p>Are you sure you want to delete this note?</p>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="confirm-button"
          >
            {isLoading ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button onClick={handleCancelDelete} className="cancel-button">
            Cancel
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      ) : (
        <button onClick={handleConfirmDelete} className="delete-button">
          Delete Note
        </button>
      )}
    </div>
  );
};

export default DeleteNote;
