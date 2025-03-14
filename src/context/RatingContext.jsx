// context/RatingContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './userContext';

const RatingContext = createContext();
const API_BASE_URL = 'http://localhost:5000/api';

export const RatingProvider = ({ children }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, setUser, logout } = useContext(UserContext); // Integrate with UserContext
  const navigate = useNavigate();

  // Fetch utility with token handling and refresh
  const fetchWithAuth = useCallback(async (url, options = {}) => {
    let accessToken = localStorage.getItem('accessToken');
    console.log('fetchWithAuth - Current access token:', accessToken);

    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        'Authorization': accessToken ? `Bearer ${accessToken}` : '',
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Keep cookies if backend uses them
    });

    console.log(`fetchWithAuth - Response status for ${url}:`, response.status);

    if (response.status === 401) {
      console.log('Access token expired, trying to refresh...');
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') }),
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        localStorage.setItem('accessToken', refreshData.accessToken);
        setUser((prevUser) => prevUser ? { ...prevUser, accessToken: refreshData.accessToken } : null);

        // Retry original request with new token
        return fetch(url, {
          ...options,
          headers: {
            ...(options.headers || {}),
            'Authorization': `Bearer ${refreshData.accessToken}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
      } else {
        console.log('Refresh token failed, logging out...');
        logout();
        navigate('/login');
        throw new Error('Session expired');
      }
    }

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return response;
  }, [navigate, setUser, logout]);

  // Submit Rating
  const submitRating = useCallback(async (employeeId, ratingData) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/ratings/submit/${employeeId}`, {
        method: 'POST',
        body: JSON.stringify(ratingData),
      });

      const data = await response.json();
      console.log('submitRating - Response:', data);
      setRatings((prev) => [...prev, data]);
      toast.success('Rating submitted successfully!');
      return data;
    } catch (err) {
      console.error('submitRating - Error:', err.message);
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  // Get All Ratings
  const getAllRatings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/ratings/all-ratings`, {
        method: 'GET',
      });

      const data = await response.json();
      console.log('getAllRatings - Raw response:', data);
      const ratingsData = data.data || data; // Handle nested data or direct array
      setRatings(Array.isArray(ratingsData) ? ratingsData : []);
      return data;
    } catch (err) {
      console.error('getAllRatings - Error:', err.message);
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  // Get Employee Ratings
  const getEmployeeRatings = useCallback(async (employeeId) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/ratings/employee/${employeeId}`, {
        method: 'GET',
      });

      const data = await response.json();
      console.log('getEmployeeRatings - Response:', data);
      setRatings(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      console.error('getEmployeeRatings - Error:', err.message);
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  // Edit Rating
  const editRating = useCallback(async (ratingId, ratingData) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/ratings/update-rating/${ratingId}`, {
        method: 'PUT',
        body: JSON.stringify(ratingData),
      });

      const data = await response.json();
      console.log('editRating - Response:', data);
      setRatings((prev) =>
        prev.map((rating) => (rating._id === ratingId ? data.updatedRating : rating))
      );
      toast.success('Rating updated successfully!');
      return data;
    } catch (err) {
      console.error('editRating - Error:', err.message);
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  // Delete Rating
  const deleteRating = useCallback(async (ratingId) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/ratings/delete-rating/${ratingId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      console.log('deleteRating - Response:', data);
      setRatings((prev) => prev.filter((rating) => rating._id !== ratingId));
      toast.success('Rating deleted successfully!');
      return data;
    } catch (err) {
      console.error('deleteRating - Error:', err.message);
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  return (
    <RatingContext.Provider
      value={{
        ratings,
        loading,
        error,
        submitRating,
        getAllRatings,
        getEmployeeRatings,
        editRating,
        deleteRating,
        setError,
      }}
    >
      {children}
    </RatingContext.Provider>
  );
};

export const useRating = () => {
  const context = useContext(RatingContext);
  if (!context) {
    throw new Error('useRating must be used within a RatingProvider');
  }
  return context;
};