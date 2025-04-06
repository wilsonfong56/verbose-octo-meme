import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TextToSpeech from "./TextToSpeech.jsx";

function Summarypage() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({
    entries: [{ cue: '', content: '' }]
  });
  const [showVideo, setShowVideo] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [codeContent, setCodeContent] = useState('');
  const [activeNoteIndex, setActiveNoteIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('/lecture28-intro-to-react.pdf');
  const [currentPdfPage, setCurrentPdfPage] = useState(1); // Store current PDF page
  
  // State for the resizable panels
  const [leftPanelWidth, setLeftPanelWidth] = useState(30); // Initial percentage
  const dividerRef = useRef(null);
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Get route parameters (if available)
  const params = useParams();
  const classname = params?.classname;
  const date = params?.date;

  // Function to handle key events in the content textarea
  const handleContentKeyDown = (e, index) => {
    // If Enter key is pressed and not with shift (for new line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior
      
      const currentContent = currentNote.entries[index].content;
      const cursorPosition = e.target.selectionStart;
      
      // Create a new line with bullet point
      const newContent = 
        currentContent.substring(0, cursorPosition) + 
        '\n• ' + 
        currentContent.substring(cursorPosition);
      
      // Update the state
      const updatedEntries = [...currentNote.entries];
      updatedEntries[index] = {
        ...updatedEntries[index],
        content: newContent
      };
      
      setCurrentNote({
        ...currentNote,
        entries: updatedEntries
      });
      
      // Set cursor position after the bullet point on the next update
      setTimeout(() => {
        e.target.selectionStart = cursorPosition + 3; // Position after "• "
        e.target.selectionEnd = cursorPosition + 3;
      }, 0);
    }
  };

  useEffect(() => {
    const fetchAllNotes = async () => {
      try {

        // Fetch all notes for this lecture + date
        const notesRes = await fetch("http://localhost:5050/getSummary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            lecture: classname,
            date: date
          })
        });

        const result = await notesRes.json();

        if (!result) return;

        console.log("Result:", result)
        const notebookData = result.data.Notebooks
        const notes = notebookData.map(n => ({
          cue: n.topic,
          content: n.notes.join('\n'),
        }));

        console.log(notes);
        setCurrentNote({entries: notes})

      } catch (err) {
        console.error("Failed to load notes:", err);
      }
    };

    if (classname && date) {
      fetchAllNotes();
    }
  }, [classname, date]);

  // Helper function to handle content when displaying in textarea
  const processContentForDisplay = (content) => {
    if (!content) return '';
    
    // If the user is editing and the last character is a newline, 
    // we want to preserve that but not add a bullet to the empty line
    if (content.endsWith('\n')) {
      return content;
    }
    
    return content;
  };


  // Handle PDF file loading errors
  const handlePdfError = () => {
    console.error("Error loading PDF file. Please check the file path.");
    alert("Could not load the PDF file. Please make sure it exists in the public folder.");
  };

  const toggleVideo = (e) => {
    e.preventDefault();
    setShowVideo(!showVideo);
    if (showPdf && !showVideo) {
      setShowPdf(false);
    }
  };

  const togglePdf = (e) => {
    e.preventDefault();
    
    // If currently showing and about to hide, store the position from sessionStorage
    if (showPdf) {
      // Position is already saved in sessionStorage by the iframe event listener
      setShowPdf(false);
    } else {
      setShowPdf(true);
      if (showVideo) {
        setShowVideo(false);
      }
    }
  };
  
  // Effect to load PDF page from localStorage when component mounts
  useEffect(() => {
    const savedPage = localStorage.getItem('pdfCurrentPage');
    if (savedPage) {
      setCurrentPdfPage(parseInt(savedPage, 10));
    }
  }, []);

  // Function to handle page change in PDF
  const handlePdfPageChange = (newPage) => {
    setCurrentPdfPage(newPage);
    localStorage.setItem('pdfCurrentPage', newPage.toString());
  };

  // Effect to handle resizable panels
  useEffect(() => {
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Prevent text selection during resize
      e.preventDefault();
    };

    const handleMouseMove = (e) => {
      if (isDraggingRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newLeftPanelWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        
        // Apply constraints (minimum 20%, maximum 60%)
        const clampedWidth = Math.min(Math.max(newLeftPanelWidth, 20), 60);
        setLeftPanelWidth(clampedWidth);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    // Add event listener to the divider
    const divider = dividerRef.current;
    if (divider) {
      divider.addEventListener('mousedown', handleMouseDown);
    }

    // Cleanup function
    return () => {
      if (divider) {
        divider.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

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
        <div style={{ lineHeight: '2rem', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <a
              href="#"
              onClick={togglePdf}
              style={{ color: '#61dafb', display: 'block', marginBottom: '0.5rem' }}
            >
              lecture28: Intro to React.pdf {showPdf ? '(Hide)' : '(Show)'}
            </a>
            {showPdf && (
              <div style={{ 
                marginTop: '0.5rem', 
                marginBottom: '1.5rem',
                width: '100%',
                position: 'relative',
                zIndex: 100
              }}>
                <div style={{ 
                  position: 'relative',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <iframe
                    width="100%"
                    height="700"
                    src={`${pdfUrl}#page=${currentPdfPage}`}
                    title="Lecture Slides PDF"
                    frameBorder="0"
                    style={{ 
                      backgroundColor: '#fff',
                      borderRadius: '4px'
                    }}
                    onError={handlePdfError}
                    id="pdf-viewer"
                  />
                  <div style={{ marginTop: '5px', fontSize: '0.8rem', color: '#999' }}>
                    Note: PDF must be in the public folder to display correctly
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SWAPPED: Code section moved before video section */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (!showCode) {
                    // Fetch the code content when showing
                    fetch('/FizzBuzzSol.py')
                      .then(response => {
                        if (!response.ok) {
                          throw new Error('Failed to fetch the code file');
                        }
                        return response.text();
                      })
                      .then(data => {
                        setCodeContent(data);
                        setShowCode(true);
                      })
                      .catch(error => {
                        console.error('Error fetching code file:', error);
                        alert('Could not load the code file. Please check if it exists in the public folder.');
                      });
                  } else {
                    setShowCode(false);
                  }
                }}
                style={{ color: '#61dafb', marginRight: '0.5rem' }}
              >
                starter-code.py {showCode ? '(Hide)' : '(Show)'}
              </a>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Create a virtual anchor element for downloading
                  const link = document.createElement('a');
                  link.href = '/example_code.py'; // Path to the file in the public folder
                  link.download = 'example_code.py'; // Name of the file when downloaded
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  cursor: 'pointer',
                  padding: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Download code"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#61dafb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
            </div>
            {showCode && (
              <div style={{ 
                marginTop: '0.5rem', 
                marginBottom: '1rem',
                background: '#282c34',
                borderRadius: '6px',
                padding: '1rem',
                maxHeight: '300px',
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.6rem',
                whiteSpace: 'pre',
                color: '#abb2bf',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}>
                {codeContent}
              </div>
            )}
          </div>

          {/* SWAPPED: Video section moved after code section */}
          <div style={{ marginBottom: '1rem' }}>
            <a
              href="#"
              onClick={toggleVideo}
              style={{ color: '#61dafb', display: 'block', marginBottom: '0.5rem' }}
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
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <a href={window.location.href.replace(/\/summary$/, '')}  style={{ color: '#61dafb', display: 'block' }}>Lecture Notes</a>
          </div>
        </div>
      </div>

      {/* Right Panel - Cornell Note Taking */}
      <div style={{ 
        flex: 2, 
        backgroundColor: '#1e1e1e', 
        padding: '2rem', 
        overflowY: 'auto'
      }}>
        <h2>Lecture Summary</h2>
        
        {/* Cornell Note Layout - Aligned Entries */}
        <div style={{ marginBottom: '1rem', border: '1px solid #555', borderRadius: '8px', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'flex', background: '#444', padding: '0.5rem' }}>
            <div style={{ flex: 1, fontWeight: 'bold', padding: '0.5rem', borderRight: '1px solid #555', minWidth: '33%', maxWidth: '33%', marginRight: '4px' }}>Topic</div>
            <div style={{ flex: 2, fontWeight: 'bold', padding: '0.5rem', minWidth: '65%', maxWidth: '65%', marginLeft: '4px' }}>Notes</div>
          </div>
          
          {/* Entries */}
          {currentNote.entries.map((entry, index) => (
            <div key={index} style={{ display: 'flex', borderTop: '1px solid #555', minHeight: '100px', gap: '8px' }}>
              {/* Cue/Question Cell */}
              <div style={{ 
                flex: 1, 
                borderRight: '1px solid #555', 
                position: 'relative', 
                display: 'flex', 
                flexDirection: 'column',
                minWidth: '33%',
                maxWidth: '33%',
                marginRight: '4px'
              }}>
                <textarea
                  value={entry.cue}
                  placeholder="Topic..."
                  onFocus={(e) => e.target.style.backgroundColor = '#444'}
                  onBlur={(e) => e.target.style.backgroundColor = '#333'}
                  style={{ 
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.75rem',
                    backgroundColor: '#333',
                    color: '#fff',
                    border: 'none',
                    resize: 'none',
                    flex: '1',
                    outline: 'none',
                    transition: 'background-color 0.2s ease'
                  }}
                />
                {/* Sound icon for Text-to-Speech */}
                <div 
                  onClick={() => {
                    // Directly use the TextToSpeech component's functionality
                    const speechSynthesis = window.speechSynthesis;
                    const utterance = new SpeechSynthesisUtterance(entry.cue);
                    speechSynthesis.speak(utterance);
                  }}
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '5px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.7,
                    transition: 'opacity 0.2s ease-in-out'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                  onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}
                  title="Text to Speech"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#61dafb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                  </svg>
                </div>
              </div>
              
              {/* Content Cell */}
              <div style={{ 
                flex: 2, 
                display: 'flex', 
                flexDirection: 'column',
                minWidth: '65%',
                maxWidth: '65%',
                marginLeft: '4px',
                position: 'relative'
              }}>
                <textarea
                  value={processContentForDisplay(entry.content)}
                  onKeyDown={(e) => handleContentKeyDown(e, index)}
                  onFocus={(e) => e.target.style.backgroundColor = '#444'}
                  onBlur={(e) => e.target.style.backgroundColor = '#333'}
                  placeholder="Notes..."
                  style={{ 
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.75rem',
                    backgroundColor: '#333',
                    color: '#fff',
                    border: 'none',
                    resize: 'none',
                    flex: '1',
                    outline: 'none',
                    lineHeight: '1.5',
                    fontFamily: 'Arial, sans-serif',
                    transition: 'background-color 0.2s ease'
                  }}
                />
                {/* Sound icon for Text-to-Speech */}
                <div 
                  onClick={() => {
                    // Directly use the TextToSpeech component's functionality
                    const speechSynthesis = window.speechSynthesis;
                    const utterance = new SpeechSynthesisUtterance(entry.content);
                    speechSynthesis.speak(utterance);
                  }}
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '5px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.7,
                    transition: 'opacity 0.2s ease-in-out'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                  onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}
                  title="Text to Speech"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#61dafb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                  </svg>
                </div>
              </div>
            </div>
          ))}

        </div>

        {isEditing && (
          <button
            onClick={() => {
              setCurrentNote({
                entries: [{ cue: '', content: '' }]
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

export default Summarypage;