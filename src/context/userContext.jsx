import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const backendUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://your-production-url.com'
    : 'http://localhost:5000/api';

export const UserContext = createContext();

export default function UserContextProvider(props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Check localStorage first
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('Restored from localStorage:', parsedUser);
          if (parsedUser.isLogin) {
            setUser(parsedUser);
            setLoading(false);
            return; // Use localStorage if isLogin: true
          }
        }

        // Fallback to fetch /profile with cookies
        console.log('No valid localStorage user, attempting /profile');
        const profileResponse = await fetch(`${backendUrl}/profile`, {
          method: 'GET',
          credentials: 'include',
        });
        console.log('Profile status:', profileResponse.status);
        if (!profileResponse.ok) {
          console.log('Profile failed, attempting /refresh-token');
          const refreshResponse = await fetch(`${backendUrl}/auth/refresh-token`, {
            method: 'POST',
            credentials: 'include',
          });
          console.log('Refresh status:', refreshResponse.status);
          if (!refreshResponse.ok) {
            const refreshError = await refreshResponse.json();
            throw new Error(`Refresh failed: ${refreshError.message}`);
          }
          console.log('Refresh succeeded, retrying /profile');
          const retryResponse = await fetch(`${backendUrl}/profile`, {
            method: 'GET',
            credentials: 'include',
          });
          console.log('Retry profile status:', retryResponse.status);
          if (!retryResponse.ok) throw new Error('Session invalid after refresh');
          const retryData = await retryResponse.json();
          console.log('Retry profile data:', retryData);
          setUser(retryData.user);
          localStorage.setItem('user', JSON.stringify(retryData.user)); // Cache in localStorage
        } else {
          const data = await profileResponse.json();
          console.log('Initial profile data:', data);
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user)); // Cache in localStorage
        }
      } catch (error) {
        console.log('Session restore failed:', error.message);
        setUser(null);
        localStorage.removeItem('user'); // Clear invalid data
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  async function login(item) {
    try {
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log('Login response:', data);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user)); // Store user in localStorage
      toast.success('Login successful!');
      return data;
    } catch (error) {
      toast.error(error.message);
      return { error: error.message };
    }
  }

  async function signup(item) {
    try {
      const formData = new FormData();
      for (const key in item) {
        formData.append(key, item[key]);
      }

      const response = await fetch(`${backendUrl}/auth/signup`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error while signing up');
      }

      const data = await response.json();
      toast.success('Sign-up successful! Please log in.');
      return data;
    } catch (error) {
      toast.error(error.message);
      return { error: error.message };
    }
  }

  async function logout() {
    try {
      const response = await fetch(`${backendUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      setUser(null);
      localStorage.removeItem('user'); // Clear localStorage on logout
      toast.success('Logged out successfully!');
      return { message: 'Logged out successfully' };
    } catch (error) {
      toast.error(error.message);
      return { error: error.message };
    }
  }

  return (
    <UserContext.Provider
      value={{
        login,
        signup,
        logout,
        user,
        setUser,
        loading,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}