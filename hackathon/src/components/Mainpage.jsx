import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function CornellNotesApp() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({
    title: '',
    cues: '',
    content: '',
    summary: ''
  });
  const [showVideo, setShowVideo] = useState(false);
  const [activeNoteIndex, setActiveNoteIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Get route parameters (if available)
  const params = useParams();
  const classname = params?.classname;
  const date = params?.date;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentNote({
      ...currentNote,
      [name]: value
    });
  };

  const saveNote = () => {
    if (currentNote.title && (currentNote.cues || currentNote.content)) {
      if (isEditing && activeNoteIndex !== null) {
        // Update existing note
        const updatedNotes = [...notes];
        updatedNotes[activeNoteIndex] = currentNote;
        setNotes(updatedNotes);
        setIsEditing(false);
      } else {
        // Add new note
        setNotes([...notes, currentNote]);
      }
      
      // Reset form
      setCurrentNote({
        title: '',
        cues: '',
        content: '',
        summary: ''
      });
      setActiveNoteIndex(null);
    }
  };

  const editNote = (index) => {
    setCurrentNote(notes[index]);
    setActiveNoteIndex(index);
    setIsEditing(true);
  };

  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  const toggleVideo = (e) => {
    e.preventDefault();
    setShowVideo(!showVideo);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial', color: '#fff' }}>
      {/* Left Panel - Resources */}
      <div style={{ flex: 1, backgroundColor: '#2d2d2d', padding: '2rem', overflowY: 'auto' }}>
        {classname && date && (
          <div style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
            {classname} - {date}
          </div>
        )}
        <h2>Resources</h2>
        <ul style={{ lineHeight: '2rem', marginBottom: '2rem' }}>
          <li><a href="#" style={{ color: '#61dafb' }}>Lecture Slides (PDF)</a></li>
          <li>
            <a
              href="#"
              onClick={toggleVideo}
              style={{ color: '#61dafb' }}
            >
              YouTube Video {showVideo ? '(Hide)' : '(Show)'}
            </a>
            {showVideo && (
              <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
                <iframe
                  width="100%"
                  height="200"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="YouTube Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </li>
          <li><a href="#" style={{ color: '#61dafb' }}>Code Example (.py)</a></li>
          <li><a href="#" style={{ color: '#61dafb' }}>Summary Document</a></li>
        </ul>

        <h2>Your Notes</h2>
        {notes.length === 0 ? (
          <p style={{ color: '#999' }}>No notes yet. Create your first Cornell note!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {notes.map((note, idx) => (
              <li 
                key={idx} 
                style={{ 
                  backgroundColor: activeNoteIndex === idx ? '#444' : '#333', 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  marginBottom: '1rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0 }} onClick={() => editNote(idx)}>{note.title}</h3>
                  <button 
                    onClick={() => deleteNote(idx)}
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      color: '#ff6b6b', 
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    ×
                  </button>
                </div>
                <p style={{ margin: '0.5rem 0 0', color: '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {note.cues && note.cues.split('\n')[0]}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right Panel - Cornell Note Taking */}
      <div style={{ flex: 2, backgroundColor: '#1e1e1e', padding: '2rem', overflowY: 'auto' }}>
        <h2>{isEditing ? 'Edit Note' : 'Create Cornell Note'}</h2>
        
        {/* Note Title */}
        <input
          type="text"
          name="title"
          placeholder="Note Title..."
          value={currentNote.title}
          onChange={handleInputChange}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            borderRadius: '8px', 
            border: 'none',
            marginBottom: '1rem',
            fontSize: '1.1rem',
            backgroundColor: '#333',
            color: '#fff'
          }}
        />

        {/* Cornell Note Layout */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          {/* Cues/Questions Column */}
          <textarea
            name="cues"
            placeholder="Cues/Questions..."
            value={currentNote.cues}
            onChange={handleInputChange}
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              height: '300px', 
              borderRadius: '8px', 
              border: 'none',
              backgroundColor: '#333',
              color: '#fff',
              resize: 'none'
            }}
          />
          
          {/* Notes Column */}
          <textarea
            name="content"
            placeholder="Notes..."
            value={currentNote.content}
            onChange={handleInputChange}
            style={{ 
              flex: 2, 
              padding: '0.75rem', 
              height: '300px', 
              borderRadius: '8px', 
              border: 'none',
              backgroundColor: '#333',
              color: '#fff',
              resize: 'none'
            }}
          />
        </div>
        
        {/* Summary Section */}
        <textarea
          name="summary"
          placeholder="Summary..."
          value={currentNote.summary}
          onChange={handleInputChange}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            height: '100px', 
            borderRadius: '8px', 
            border: 'none',
            marginBottom: '1rem',
            backgroundColor: '#333',
            color: '#fff',
            resize: 'none'
          }}
        />
        
        {/* Save Button */}
        <button
          onClick={saveNote}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#61dafb', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: '#000'
          }}
        >
          {isEditing ? 'Update Note' : 'Save Note'}
        </button>
        
        {isEditing && (
          <button
            onClick={() => {
              setCurrentNote({
                title: '',
                cues: '',
                content: '',
                summary: ''
              });
              setIsEditing(false);
              setActiveNoteIndex(null);
            }}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: 'transparent', 
              border: '1px solid #61dafb', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              color: '#61dafb',
              marginLeft: '1rem'
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export default CornellNotesApp;