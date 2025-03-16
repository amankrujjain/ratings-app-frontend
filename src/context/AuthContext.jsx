import { createContext, useState, useContext } from "react";
import { toast } from "react-toastify"; // Import toast from react-toastify

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
      toast.success(data.message || "Operation successful!", {
        position: "top-right",
        autoClose: 3000,
      }); // Show success toast
      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "An error occurred!", {
        position: "top-right",
        autoClose: 3000,
      }); // Show error toast
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
    <AuthContext.Provider
      value={{ forgotPassword, verifyOTP, resetPassword, loading, error, message }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);