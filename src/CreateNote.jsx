import { useState, useEffect } from 'react';
import Button from './components/Button';
import './CreateNote.css';

const CreateNote = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? match[2] : null;
  };

  const Modal = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!title || !content) {
        setError('Title and content are required.');
        return;
      }

      try {
        const tagsArray = tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag !== '');

        const csrfToken = getCookie('csrftoken');

        const xmlDoc = new XMLSerializer().serializeToString(
          new DOMParser().parseFromString(
            `<?xml version="1.0" encoding="UTF-8"?>
          <note>
            <title>${title}</title>
            <content>${content}</content>
            <tags>
              ${tagsArray.map((tag) => `<tag>${tag}</tag>`).join('')}
            </tags>
          </note>`,
            'application/xml'
          )
        );

        const response = await fetch('http://localhost:8000/api/create_note/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/xml',
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
          body: xmlDoc,
        });

        if (response.ok) {
          const responseText = await response.text();

          const parser = new DOMParser();
          const xmlResponse = parser.parseFromString(
            responseText,
            'application/xml'
          );
          const noteId = xmlResponse.querySelector('note_id')?.textContent;

          setMessage(`Note created successfully! ID: ${noteId}`);
          setTitle('');
          setContent('');
          setTags('');
          setError('');
          onClose();
          window.location.reload();
        } else {
          const errorText = await response.text();

          const parser = new DOMParser();
          const xmlError = parser.parseFromString(errorText, 'application/xml');
          const errorMessage =
            xmlError.querySelector('error')?.textContent ||
            'Failed to create note.';

          setError(errorMessage);
        }
      } catch (err) {
        console.error('Error creating note:', err);
        setError('An error occurred while creating the note.');
      }
    };

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
          <form onSubmit={handleSubmit} className="edit-note-form">
            <div>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags separated by commas"
              />
            </div>

            <Button type="submit" Text="Create Note" className="cancel-btn" />
          </form>
          {message && <p style={{ color: 'green' }}>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="note create-note">
      <h2>Create Note</h2>
      <img
        src="plus.svg"
        alt="Create note icon"
        title="Create note"
        onClick={() => setModalVisible(true)}
        style={{ cursor: 'pointer' }}
      />
      {modalVisible && <Modal onClose={() => setModalVisible(false)} />}
    </div>
  );
};

export default CreateNote;
