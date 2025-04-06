import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EnrolledClass() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const classes = [
    { name: 'CS601', link: '/mainpage' },
    { name: 'CS686', link: '/cs686' },
    { name: 'Math301', link: '/math301' },
  ];

  const dummyDates = [
    '2025-01-15', '2025-01-22', '2025-02-05', '2025-02-19', '2025-03-01',
    '2025-03-15', '2025-03-29', '2025-04-05', '2025-04-12', '2025-04-19'
  ];

  const [openClass, setOpenClass] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/classlists", {
      method: "GET",
      credentials: "include", // important for sending cookies
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.warn("Unauthorized or no session");
        } else {
          setEmail(data.email);
          setRole(data.role);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch session info:", err);
      });
  }, []);

  
  const toggleClass = (name) => {
    setOpenClass(prev => (prev === name ? null : name));
  };

  const handleDateClick = (className, date) => {
    navigate(`/mainpage/${className}/${date}`);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/signin";
    } catch (err) {
      alert("Failed to logout");
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1e1e1e', color: '#fff', fontFamily: 'Arial', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Email: {email}</h1>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Role: {role}</h2>

      <div className="flex justify-between items-center mb-4">
            <button
            onClick={handleLogout}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
            Logout
            </button>
      </div>
      
      <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Class Enrolled</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {classes.map((cls, idx) => (
          <li key={idx} style={{ marginBottom: '1.5rem' }}>
            <div>
              <button
                onClick={() => toggleClass(cls.name)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#61dafb',
                  fontSize: '1.75rem',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  paddingLeft: '1rem',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => e.target.style.color = '#90e0ff'}
                onMouseLeave={(e) => e.target.style.color = '#61dafb'}
              >
                {cls.name}
              </button>
              {openClass === cls.name && (
                <ul style={{ marginTop: '0.75rem', paddingLeft: '2rem' }}>
                  {dummyDates.map((date, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleDateClick(cls.name, date)}
                      style={{ color: '#ccc', fontSize: '1.1rem', padding: '0.25rem 0', cursor: 'pointer' }}
                    >
                      {date}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EnrolledClass;