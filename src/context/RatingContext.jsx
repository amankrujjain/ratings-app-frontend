// context/RatingContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './userContext';

const RatingContext = createContext();
const API_BASE_URL = 'http://localhost:5000/api';

export const RatingProvider = ({ children }) => {
  const [ratings, setRatings] = useState([]);
  const [pagination, setPagination] = useState({});
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
      await logout(false);
      navigate('/login');
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Request failed');
    }

    return response;
  }, [logout, navigate]);

  // 🔹 Get All Ratings (Admin) with optional query parameters (page, limit, sortBy, order, search)
  const getAllRatings = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      // build query string if params provided
      const query = new URLSearchParams(params).toString();
      const endpoint = query
        ? `${API_BASE_URL}/ratings/all-ratings?${query}`
        : `${API_BASE_URL}/ratings/all-ratings`;

      const response = await fetchWithAuth(endpoint);
      const data = await response.json();
      console.log("Fetched all ratings:", response);

      setRatings(data.data || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      console.log("Error fetching all ratings:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  // 🔹 Get Employee Ratings with optional query parameters (page, limit, sortBy, order, search)
  const getEmployeeRatings = useCallback(async (employeeId, params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams(params).toString();
      const endpoint = query
        ? `${API_BASE_URL}/ratings/employee-ratings/${employeeId}?${query}`
        : `${API_BASE_URL}/ratings/employee-ratings/${employeeId}`;

      const response = await fetchWithAuth(endpoint);
      const data = await response.json();
      console.log("Fetched employee ratings:", data);

      const list = Array.isArray(data) ? data : data?.data || [];
      setRatings(list);

      if (data?.pagination) {
        setPagination(data.pagination);
      } else {
        setPagination({
          totalItems: list.length,
          totalPages: 1,
          currentPage: 1,
          limit: list.length || 10,
        });
      }
    } catch (err) {
      console.log("Error fetching employee ratings:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  // 🔹 Delete Rating (Admin)
  const deleteRating = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/ratings/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      // optimistically update local list
      setRatings((prev) => prev.filter((r) => r._id !== id));
      toast.success(data.message || 'Rating deleted');
      return data;
    } catch (err) {
      console.log('Error deleting rating:', err);
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
        pagination,
        loading,
        error,
        getAllRatings,
        getEmployeeRatings,
        deleteRating,
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