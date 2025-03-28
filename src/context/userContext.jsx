import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const backendUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://your-production-url.com'
    : 'http://localhost:5000/api';

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');

        if (storedUser && storedToken) {
          setUser({ ...JSON.parse(storedUser), accessToken: storedToken });
          setLoading(false);
          return;
        }

        const response = await fetch(`${backendUrl}/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
          credentials: 'include'
        });

        if (response.ok) {
          const { user } = await response.json();
          setUser(user);
        } else {
          throw new Error('Session expired');
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { user, accessToken } = data;
      setUser({ ...user, accessToken });
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      
      toast.success('Login successful!');
      return data;
    } catch (error) {
      toast.error(error.message);
      return { error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => formData.append(key, value));

      const response = await fetch(`${backendUrl}/auth/signup`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Sign-up failed');
      }

      toast.success('Sign-up successful! Please log in.');
      return await response.json();
    } catch (error) {
      toast.error(error.message);
      return { error: error.message };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${backendUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
}
