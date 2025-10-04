import React from 'react';
import { Link } from 'react-router-dom';

const EvidenceLocker = () => {
  const evidence = [
    { id: 1, name: 'Photo1.jpg', verified: true },
    { id: 2, name: 'Video.mp4', verified: false }
  ];

  return (
    <div style={{ padding: '20px', backgroundImage: 'url(/images/police-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
      <h1 style={{ color: '#e74c3c' }}>🔒 Evidence Locker</h1>
      <p>AI-verified evidence storage with tampering detection.</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {evidence.map(item => (
          <li key={item.id} style={{ padding: '10px', margin: '10px 0', backgroundColor: 'white', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            {item.name} - {item.verified ? '✅ Verified' : '❌ Not Verified'}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '20px' }}>
        <Link to="/police/dashboard" style={{ color: '#e74c3c', textDecoration: 'none' }}>Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default EvidenceLocker;