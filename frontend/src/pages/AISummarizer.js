import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AISummarizer = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Determine back link based on user role and current path
  const getBackLink = () => {
    if (location.pathname.includes('/citizen/')) {
      return '/citizen/track-case';
    } else if (location.pathname.includes('/police/')) {
      return '/police/dashboard';
    } else if (location.pathname.includes('/court/')) {
      return '/court/portal';
    }
    // Public access - go to home
    return '/';
  };

  const getBackText = () => {
    if (location.pathname.includes('/citizen/')) {
      return 'Back to Citizen Portal';
    } else if (location.pathname.includes('/police/')) {
      return 'Back to Police Dashboard';
    } else if (location.pathname.includes('/court/')) {
      return 'Back to Court Portal';
    }
    // Public access
    return 'Back to Home';
  };
  const submitForm = async () => {
    const formData = new FormData();
    const fileInput = document.querySelector('#judgment-file');
    const textInput = document.querySelector('#judgment-text');
    let url = "http://127.0.0.1:8000/summarize";

    if (fileInput && fileInput.files.length > 0) {
      formData.append('file', fileInput.files[0]);
      url = "http://127.0.0.1:8000/summarize-file";
    } else if (textInput && textInput.value.trim() !== "") {
      formData.append('text', textInput.value.trim());
    } else {
      alert("Please enter judgment text or upload a file.");
      return;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.summary) {
        document.querySelector('#summary-output').innerText = result.summary;
      } else {
        document.querySelector('#summary-output').innerText = "Error: " + result.error;
      }
    } catch (error) {
      document.querySelector('#summary-output').innerText = "Error: " + error.message;
    }
  };


  return (
    <div style={{
      padding: '20px',
      backgroundImage: 'url(/images/citizen-bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      position: 'relative',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Back Navigation */}
        <div style={{ marginBottom: '20px' }}>
          <Link 
            to={getBackLink()} 
            style={{ 
              color: 'white', 
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            ← {getBackText()}
          </Link>
        </div>
        
        {/* Top Banner */}
        <h1 style={{
          textAlign: 'center',
          color: 'white',
          marginBottom: '20px',
          fontSize: '2.5em'
        }}>
          AI Judgment Summarizer – JusticeChain AI
        </h1>

        {/* Main Card */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          display: 'flex',
          flexDirection: window.innerWidth > 768 ? 'row' : 'column',
          gap: '20px'
        }}>
          {/* Input Section */}
          <div style={{
            flex: 1,
            padding: '20px'
          }}>
            <h2 style={{ color: '#001f3f', marginBottom: '20px' }}>📝 Input Judgment</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: '#001f3f', fontWeight: 'bold' }}>
                Paste Judgment Text
              </label>
              <textarea
                id="judgment-text"
                placeholder="Paste the full judgment text here..."
                rows="10"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #bdc3c7',
                  resize: 'vertical',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: '#001f3f', fontWeight: 'bold' }}>
                Or Upload Judgment File
              </label>
              <input
                id="judgment-file"
                type="file"
                accept=".pdf,.doc,.docx"
                style={{
                  marginBottom: '10px',
                  padding: '10px',
                  border: '1px solid #bdc3c7',
                  borderRadius: '5px',
                  width: '100%'
                }}
              />
            </div>

            <button
              onClick={submitForm}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              🚀 Generate Summary
            </button>
          </div>

          {/* Output Section */}
          <div style={{
            flex: 1,
            padding: '20px'
          }}>
            <h2 style={{ color: '#001f3f', marginBottom: '20px' }}>📋 AI Summary Output</h2>

            <div id="summary-output">
              Ready to Generate Summary
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISummarizer;
