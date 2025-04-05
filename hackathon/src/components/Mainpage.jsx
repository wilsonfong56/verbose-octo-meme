import React, { useState } from 'react';

function Mainpage() {
  const [notes, setNotes] = useState([]);
  const [theme, setTheme] = useState('');
  const [answer, setAnswer] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  
  const handleSubmit = () => {
    if (theme && answer) {
      const newNote = { theme, answer };
      console.log('Submitting note:', newNote);
      setNotes([...notes, newNote]);
      setTheme('');
      setAnswer('');
    }
  };
  
  const toggleVideo = (e) => {
    e.preventDefault();
    setShowVideo(!showVideo);
  };
  
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial', color: '#fff' }}>
      {/* Left Panel - Resources */}
      <div style={{ flex: 1, backgroundColor: '#2d2d2d', padding: '2rem' }}>
        <h2>Resources</h2>
        <ul style={{ lineHeight: '2rem' }}>
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
      </div>
      
      {/* Right Panel - Cornell Note Taking */}
      <div style={{ flex: 1.5, backgroundColor: '#1e1e1e', padding: '2rem', overflowY: 'auto' }}>
        <h2>Cornell Notes</h2>
        
        {/* Note Input */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Enter question or theme..."
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none' }}
          />
          <textarea
            placeholder="Write your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{ flex: 2, padding: '0.75rem', height: '150px', borderRadius: '8px', border: 'none' }}
          />
        </div>
        
        <button
          onClick={handleSubmit}
          style={{ marginBottom: '2rem', padding: '0.5rem 1rem', backgroundColor: '#61dafb', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Submit Note
        </button>
        
        {/* Display Submitted Notes */}
        <div>
          <h3>Submitted Notes</h3>
          {notes.map((note, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '1rem', backgroundColor: '#333', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <div style={{ flex: 1, borderRight: '2px solid #444', paddingRight: '1rem' }}>
                <strong>Questions:</strong><br />{note.theme}
              </div>
              <div style={{ flex: 2, paddingLeft: '1rem' }}>
                <strong>Answer:</strong><br />{note.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Mainpage;