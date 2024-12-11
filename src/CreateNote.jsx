import './CreateNote.css';

import { useState } from 'react';
const CreateNote = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Función para obtener el token CSRF desde las cookies
  const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? match[2] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos
    if (!title || !content) {
      setError('Title and content are required.');
      return;
    }

    try {
      const csrfToken = getCookie('csrftoken'); // Obtén el CSRF token

      const response = await fetch('http://localhost:8000/api/create_note/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken, // Agrega el CSRF token al encabezado
        },
        credentials: 'include', // Incluye cookies
        body: JSON.stringify({
          title,
          content,
          status,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Note created successfully! ID: ${data.note_id}`);
        setTitle(''); // Limpia el formulario
        setContent('');
        setStatus('');
        setError('');
        window.location.reload();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create note.');
      }
    } catch (err) {
      console.error('Error creating note:', err);
      setError('An error occurred while creating the note.');
    }
  };

  return (
    <div className="create-note-container">
      <h2>Create Note</h2>
      <form onSubmit={handleSubmit} className="create-note-form">
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
          <label htmlFor="status">Status</label>
          <input
            type="text"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <button type="submit">Create Note</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateNote;
