import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./userContext";
import { config } from '../../config';

const AdminIncentiveContext = createContext();
const API_BASE_URL = config.BASE_URL;

export const AdminIncentiveProvider = ({ children }) => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchWithAuth = useCallback(async (url) => {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.status === 401) {
      await logout(false);
      navigate("/login");
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Request failed");
    }

    return response;
  }, [logout, navigate]);

  const getMonthlySummary = useCallback(async (month, year) => {
    try {
      setLoading(true);

      const url = `${API_BASE_URL}/incentive/monthly-summary?month=${month}&year=${year}`;
      console.log('[AdminIncentive] Fetching:', url);
      const response = await fetchWithAuth(
        url
      );

      const data = await response.json();
      setSummary(data);

      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  return (
    <AdminIncentiveContext.Provider
      value={{
        summary,
        loading,
        error,
        getMonthlySummary,
      }}
    >
      {children}
    </AdminIncentiveContext.Provider>
  );
};

export const useAdminIncentive = () => {
  const context = useContext(AdminIncentiveContext);
  if (!context) {
    throw new Error("useAdminIncentive must be used inside AdminIncentiveProvider");
  }
  return context;
};