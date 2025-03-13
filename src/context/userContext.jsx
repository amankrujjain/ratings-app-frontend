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
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');

        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser({ ...parsedUser, accessToken: storedToken });
          setLoading(false);
          return;
        }

        console.log('No valid session, checking profile...');
        const profileResponse = await fetchWithAuth(`${backendUrl}/profile`);

        if (!profileResponse.ok) throw new Error('Session expired, refreshing token...');

        const profileData = await profileResponse.json();
        setUser(profileData.user);
        localStorage.setItem('user', JSON.stringify(profileData.user));

      } catch (error) {
        console.log(error.message);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  async function fetchWithAuth(url, options = {}) {
    let accessToken = localStorage.getItem('accessToken');

    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
      credentials: 'include',
    });

    if (response.status === 401) {
      console.log('Access token expired, trying to refresh...');
      const refreshResponse = await fetch(`${backendUrl}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        localStorage.setItem('accessToken', refreshData.accessToken);
        setUser((prevUser) => ({ ...prevUser, accessToken: refreshData.accessToken }));

        return fetch(url, {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${refreshData.accessToken}`,
          },
          credentials: 'include',
        });
      } else {
        console.log('Refresh token failed, logging out...');
        logout();
        return refreshResponse;
      }
    }
    return response;
  }

  async function login(credentials) {
    try {
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      const { user, accessToken } = data;

      if (!accessToken) throw new Error('Access token is missing!');

      setUser({ ...user, accessToken });
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken); // 🔥 Now properly setting accessToken

      toast.success('Login successful!');
      return data;
    } catch (error) {
      toast.error(error.message);
      return { error: error.message };
    }
  }

  async function signup(userData) {
    try {
      const formData = new FormData();
      for (const key in userData) {
        formData.append(key, userData[key]);
      }

      const response = await fetch(`${backendUrl}/auth/signup`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign-up failed');
      }

      toast.success('Sign-up successful! Please log in.');
      return await response.json();
    } catch (error) {
      toast.error(error.message);
      return { error: error.message };
    }
  }

  async function logout() {
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
        fetchWithAuth,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
