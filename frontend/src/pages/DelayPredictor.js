import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DelayPredictor = () => {
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

  return (
    <div style={{ padding: '20px', backgroundImage: 'url(/images/background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}></div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ color: '#27ae60' }}>⏱️ Delay Predictor</h1>
        <p>ML predicts resolution time & bottlenecks.</p>
        <div style={{ backgroundColor: '#27ae60', padding: '20px', borderRadius: '10px', color: 'white', marginTop: '20px' }}>
          <h3>Predicted Timeline</h3>
          <p>Case resolution expected in 3-6 months.</p>
          <p>Bottlenecks: Evidence verification delay.</p>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Link to={getBackLink()} style={{ color: '#27ae60', textDecoration: 'none' }}>{getBackText()}</Link>
        </div>
      </div>
    </div>
  );
};

export default DelayPredictor;