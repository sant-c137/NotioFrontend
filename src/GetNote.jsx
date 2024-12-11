import { useState, useEffect } from 'react';
import DeleteNote from './DeleteNote';
import EditNote from './EditNote';
import ShareNote from './ShareNote';
import CreateNote from './CreateNote';

import './GetNote.css';

function GetNote() {
  const [notes, setNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

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

  useEffect(() => {
    fetchNotes();
    fetchSharedNotes();
  }, []);

  const handleEditClick = (note) => {
    setEditingNote(note);
  };

  const handleEditSuccess = () => {
    setEditingNote(null);
    fetchNotes();
  };

  const openModal = (action, note) => {
    setModalAction(action);
    setSelectedNote(note);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalAction(null);
    setSelectedNote(null);
  };

  const Modal = ({ action, note, onClose }) => {
    useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, []);

    const handleOverlayClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };
    return (
      <div className="modal" onClick={handleOverlayClick}>
        <div className="modal-content">
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
          {action === 'edit' && (
            <EditNote note={note} onEditSuccess={handleEditSuccess} />
          )}
          {action === 'delete' && (
            <DeleteNote
              noteId={note.note_id}
              onDeleteSuccess={() => {
                fetchNotes(); // Refresca las notas
                setModalVisible(false); // Cierra la modal
              }}
              onCancel={() => setModalVisible(false)} // Cierra la modal sin hacer nada
            />
          )}
          {action === 'send' && <ShareNote noteId={note.note_id} />}
          {action === 'details' && (
            <div className="details-container">
              <p>
                <strong>Created:</strong>{' '}
                {new Date(note.creation_date).toLocaleString()}
              </p>
              <p>
                <strong>Last Modified:</strong>{' '}
                {new Date(note.last_modification).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="note-container">
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {notes.length === 0 && sharedNotes.length === 0 && !loading && (
        <p>No notes available.</p>
      )}
      <div className="title-reload">
        <h2>My Notes</h2>
        <img src="reload.svg" alt="reload icon" onClick={fetchNotes} />
      </div>
      <br />
      <br />
      <div className="notes">
        {editingNote ? (
          <EditNote note={editingNote} onEditSuccess={handleEditSuccess} />
        ) : (
          notes.map((note) => (
            <div className="note" key={note.note_id}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>

              <div className="options">
                <img
                  src="delete.svg"
                  alt="Delete icon"
                  title="Delete"
                  onClick={() => openModal('delete', note)}
                />
                <img
                  src="edit.svg"
                  alt="Edit icon"
                  title="Edit"
                  onClick={() => openModal('edit', note)}
                />
                <img
                  src="send.svg"
                  alt="Send icon"
                  title="Send"
                  onClick={() => openModal('send', note)}
                />
                <img
                  src="details.svg"
                  alt="Details icon"
                  title="Details"
                  onClick={() => openModal('details', note)}
                />
              </div>
            </div>
          ))
        )}
        <CreateNote />
      </div>
      {modalVisible && (
        <Modal action={modalAction} note={selectedNote} onClose={closeModal} />
      )}
    </div>
  );
}

export default GetNote;
