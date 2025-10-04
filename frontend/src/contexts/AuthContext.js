import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // API Base URL
  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Verify token with backend
      verifyToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Verify token with backend
  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token is invalid, clear storage
        logout();
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Login function that connects to backend
  const login = async (loginData, password) => {
    try {
      // Handle both object and separate parameters for backward compatibility
      let email, userPassword, role;
      
      if (typeof loginData === 'object' && loginData.email) {
        // Called with object: login({email, password, role})
        email = loginData.email;
        userPassword = loginData.password;
        role = loginData.role;
      } else {
        // Called with separate parameters: login(email, password)
        email = loginData;
        userPassword = password;
        role = 'citizen'; // Default role for backward compatibility
      }
      
      console.log('Login attempt:', { email, role });
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password: userPassword, role })
      });

      const data = await response.json();
      console.log('Login response:', { status: response.status, data });

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.msg || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Register function that connects to backend
  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.msg || data.errors?.[0]?.msg || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAuthenticated = (userRole = null) => {
    if (!user) return false;
    if (userRole) return user.role === userRole;
    return true;
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    isLoading,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};