import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NLPTranslation = () => {
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
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [translatedText, setTranslatedText] = useState('');

  const handleFileUpload = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleTranscribe = () => {
    // Mock transcription
    setTranscription('Transcription successful. [Sample court hearing text: The judge has entered the courtroom. All rise. The case of State vs. Defendant is now in session.]');
  };

  const handleTranslate = () => {
    // Mock translation
    setTranslatedText(`(Translated to ${selectedLanguage}): न्यायालय में न्यायाधीश प्रवेश कर चुके हैं। सभी खड़े हो जाएं। राज्य बनाम प्रतिवादी का मामला अब शुरू हो रहा है।`);
  };

  const downloadText = (text, filename) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadAsTXT = () => {
    downloadText(transcription, 'transcript.txt');
  };

  const downloadTranslationAsTXT = () => {
    downloadText(translatedText, 'translation.txt');
  };

  // Placeholder for PDF download - for now, same as TXT
  const downloadAsPDF = () => {
    downloadText(transcription, 'transcript.pdf');
  };

  const downloadTranslationAsPDF = () => {
    downloadText(translatedText, 'translation.pdf');
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
          NLP Courtroom Assistant – JusticeChain AI
        </h1>

        {/* Main Container */}
        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth > 768 ? 'row' : 'column',
          gap: '20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Left Side: Upload and Transcribe */}
          <div style={{
            flex: 1,
            borderRadius: '15px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '20px'
          }}>
            <h2 style={{ color: 'white', marginBottom: '20px' }}>🎤 Upload Audio File</h2>
            <input
              type="file"
              accept=".mp3,.wav"
              onChange={handleFileUpload}
              style={{
                marginBottom: '20px',
                padding: '10px',
                border: '1px solid #bdc3c7',
                borderRadius: '5px',
                width: '100%',
                color: 'white',
                backgroundColor: 'transparent'
              }}
            />
            {audioFile && <p style={{ color: 'white' }}>Selected: {audioFile.name}</p>}
            <button
              onClick={handleTranscribe}
              style={{
                padding: '10px 20px',
                backgroundColor: '#001f3f',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginBottom: '20px',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#003366'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#001f3f'}
            >
              📝 Transcribe
            </button>
            {transcription && (
              <div>
                <h3 style={{ color: 'white' }}>Transcription Output:</h3>
                <textarea
                  value={transcription}
                  readOnly
                  rows="10"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #bdc3c7',
                    resize: 'vertical',
                    color: 'white',
                    backgroundColor: 'transparent'
                  }}
                />
                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={downloadAsTXT}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#001f3f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginRight: '10px',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#003366'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#001f3f'}
                  >
                    Download TXT
                  </button>
                  <button
                    onClick={downloadAsPDF}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#001f3f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#003366'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#001f3f'}
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Translation */}
          <div style={{
            flex: 1,
            borderRadius: '15px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '20px'
          }}>
            <h2 style={{ color: 'white', marginBottom: '20px' }}>🌐 Translation</h2>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{
                marginBottom: '20px',
                padding: '10px',
                border: '1px solid #bdc3c7',
                borderRadius: '5px',
                width: '100%',
                color: 'white',
                backgroundColor: 'transparent'
              }}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Kannada">Kannada</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
            </select>
            <button
              onClick={handleTranslate}
              style={{
                padding: '10px 20px',
                backgroundColor: '#001f3f',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginBottom: '20px',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#003366'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#001f3f'}
            >
              Translate
            </button>
            {translatedText && (
              <div>
                <h3 style={{ color: 'white' }}>Translated Text:</h3>
                <div style={{
                  padding: '10px',
                  backgroundColor: 'transparent',
                  borderRadius: '5px',
                  border: '1px solid #bdc3c7',
                  color: 'white'
                }}>
                  {translatedText}
                </div>
                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={downloadTranslationAsTXT}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#001f3f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginRight: '10px',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#003366'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#001f3f'}
                  >
                    Download TXT
                  </button>
                  <button
                    onClick={downloadTranslationAsPDF}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#001f3f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#003366'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#001f3f'}
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Support Section */}
        <div style={{
          marginTop: '40px',
          padding: '30px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '15px',
          color: 'white'
        }}>
          <h2 style={{ color: '#00d4ff', marginBottom: '20px', textAlign: 'center' }}>🆘 Support & Help</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ color: '#00d4ff', marginBottom: '15px' }}>📞 Contact Support</h3>
              <p style={{ marginBottom: '10px' }}><strong>Email:</strong> support@justicechain.ai</p>
              <p style={{ marginBottom: '10px' }}><strong>Phone:</strong> +91-9876543210</p>
              <p style={{ marginBottom: '10px' }}><strong>Hours:</strong> 24/7 Support Available</p>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ color: '#00d4ff', marginBottom: '15px' }}>❓ FAQ</h3>
              <p style={{ marginBottom: '10px' }}><strong>Q:</strong> How accurate is the AI translation?</p>
              <p style={{ marginBottom: '10px', color: '#bdc3c7' }}><strong>A:</strong> Our AI achieves 95%+ accuracy for legal terminology.</p>
              <p style={{ marginBottom: '10px' }}><strong>Q:</strong> What file formats are supported?</p>
              <p style={{ color: '#bdc3c7' }}><strong>A:</strong> We support MP3, WAV, MP4, and most audio formats.</p>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ color: '#00d4ff', marginBottom: '15px' }}>🛠️ Technical Support</h3>
              <p style={{ marginBottom: '10px' }}><strong>Documentation:</strong> docs.justicechain.ai</p>
              <p style={{ marginBottom: '10px' }}><strong>API Guide:</strong> api.justicechain.ai</p>
              <p style={{ marginBottom: '10px' }}><strong>Status:</strong> status.justicechain.ai</p>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '20px',
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(0, 212, 255, 0.3)'
          }}>
            <h3 style={{ color: '#00d4ff', marginBottom: '15px' }}>🚀 Need More Help?</h3>
            <p style={{ marginBottom: '15px' }}>Our team is here to assist you with any questions or technical issues.</p>
            <button style={{
              padding: '12px 24px',
              backgroundColor: '#00d4ff',
              color: '#1a2035',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#00b8e6'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#00d4ff'}
            >
              Contact Support Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NLPTranslation;