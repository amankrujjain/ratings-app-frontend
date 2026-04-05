import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./userContext";

const WalletContext = createContext();
const API_BASE_URL = "http://localhost:5000";

export const WalletProvider = ({ children }) => {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchWithAuth = useCallback(async (url, options = {}) => {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
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

  const getMonthlyWallet = useCallback(async (employeeId, month, year) => {
    try {
      setLoading(true);

      const response = await fetchWithAuth(
        `${API_BASE_URL}/incentive/monthly/${employeeId}?month=${month}&year=${year}`,
        { method: "GET" }
      );

      const data = await response.json();
      setWalletData(data);
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
    <WalletContext.Provider
      value={{
        walletData,
        loading,
        error,
        getMonthlyWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
};