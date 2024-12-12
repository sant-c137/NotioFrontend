import React, { useState, useEffect } from 'react';
import './GetSharedNotes.css';
import EditSharedNote from './EditSharedNote';

function GetSharedNotes() {
  const [sharedNotes, setSharedNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

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

  const handleEditSuccess = () => {
    fetchSharedNotes();
    closeModal();
  };

  const Modal = ({ action, sharedNote, onClose }) => {
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
          {action === 'edit' && sharedNote && (
            <EditSharedNote
              note={sharedNote}
              onEditSuccess={handleEditSuccess}
            />
          )}
          {action === 'details' && sharedNote && (
            <div className="details-container">
              <h3>Note Details</h3>
              <div className="detail-item">
                <strong>Title:</strong> {sharedNote.title}
              </div>
              <div className="detail-item">
                <strong>Content:</strong> {sharedNote.content}
              </div>
              <div className="detail-item">
                <strong>Shared By:</strong> {sharedNote.shared_by}
              </div>
              <div className="detail-item">
                <strong>Permission:</strong> {sharedNote.permission}
              </div>
              <div className="detail-item">
                <strong>Tags:</strong>{' '}
                {sharedNote.tags ? sharedNote.tags.join(', ') : 'No tags'}
              </div>
              <div className="detail-item">
                <strong>Last Modified:</strong>{' '}
                {new Date(sharedNote.last_modification).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const NoteCard = ({ sharedNote }) => {
    return (
      <div key={sharedNote.shared_note_id} className="note">
        <h3>{sharedNote.title}</h3>
        <p>{sharedNote.content}</p>

        {sharedNote.tags && sharedNote.tags.length > 0 && (
          <div className="tags">
            {sharedNote.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="options">
          {sharedNote.permission === 'edit' && (
            <img
              src="edit.svg"
              alt="Edit icon"
              title="Edit"
              onClick={() => openModal('edit', sharedNote)}
            />
          )}
          {(sharedNote.permission === 'edit' ||
            sharedNote.permission === 'view') && (
            <img
              src="details.svg"
              alt="Details icon"
              title="Details"
              onClick={() => openModal('details', sharedNote)}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="shared-note-container">
      <div className="title-reload">
        <h2>Shared Notes</h2>
        <img
          src="reload.svg"
          alt="reload icon"
          onClick={fetchSharedNotes}
          title="Reload Notes"
        />
      </div>

      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {sharedNotes.length === 0 && !loading && (
        <p className="no-notes-message">No shared notes available.</p>
      )}

      <div className="notes">
        {sharedNotes.map((sharedNote) => (
          <NoteCard key={sharedNote.shared_note_id} sharedNote={sharedNote} />
        ))}
      </div>

      {modalVisible && (
        <Modal
          action={modalAction}
          sharedNote={selectedNote}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default GetSharedNotes;
