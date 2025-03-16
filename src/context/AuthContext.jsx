import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const BASE_URL = "http://localhost:5000/api/auth";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Helper function for API calls
  const apiCall = async (endpoint, method, body) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      setMessage(data.message);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    return apiCall("/forgot-password", "POST", { email });
  };

  // Verify OTP
  const verifyOTP = async (email, otp) => {
    return apiCall("/verify-otp", "POST", { email, otp });
  };

  // Reset Password
  const resetPassword = async (email, otp, newPassword) => {
    return apiCall("/reset-password", "POST", { email, otp, newPassword });
  };

  return (
    <AuthContext.Provider value={{ forgotPassword, verifyOTP, resetPassword, loading, error, message }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
