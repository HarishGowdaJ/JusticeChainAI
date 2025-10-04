import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#181818',
        color: '#ffffff',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#181818',
        color: '#ffffff',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#ff6b6b', marginBottom: '20px' }}>Authentication Required</h1>
        <p style={{ fontSize: '18px', marginBottom: '30px' }}>
          You must be logged in to access this page.
        </p>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '12px 24px',
            background: '#F8B742',
            color: '#191919',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#181818',
        color: '#ffffff',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#ff6b6b', marginBottom: '20px' }}>Access Denied</h1>
        <p style={{ fontSize: '18px', marginBottom: '10px' }}>
          You are logged in as: <strong>{user.role.toUpperCase()}</strong>
        </p>
        <p style={{ fontSize: '16px', marginBottom: '30px', color: '#888' }}>
          This page is only accessible to <strong>{requiredRole.toUpperCase()}</strong> users.
        </p>
        <p style={{ color: '#888', marginBottom: '20px' }}>
          Please logout and login with the correct credentials.
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '12px 24px',
              background: '#F8B742',
              color: '#191919',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Go to Login
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: '#ffffff',
              border: '1px solid #F8B742',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;