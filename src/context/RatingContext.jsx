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

  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  // Minimal Auth Fetch
  const fetchWithAuth = useCallback(async (url, options = {}) => {
    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.status === 401) {
      logout();
      navigate('/login');
      throw new Error('Session expired');
    }

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Request failed');
    }

    return response;
  }, [logout, navigate]);

  // 🔹 Get All Ratings (Admin)
  const getAllRatings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/ratings/all-ratings`);
      const data = await response.json();
      console.log("Fetched all ratings:", response);
      setRatings(data.data || []);
    } catch (err) {
      console.log("Error fetching all ratings:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  // 🔹 Get Employee Ratings
  const getEmployeeRatings = useCallback(async (employeeId) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/ratings/employee-ratings/${employeeId}`
      );
      const data = await response.json();
      console.log("Fetched employee ratings:", response);
      setRatings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error fetching employee ratings:", err);
      setError(err.message);
      toast.error(err.message);
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
        getAllRatings,
        getEmployeeRatings,
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