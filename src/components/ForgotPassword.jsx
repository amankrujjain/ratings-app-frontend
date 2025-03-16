import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const ForgotPassword = () => {
  const { forgotPassword, verifyOTP, resetPassword, loading, error, message } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleForgotPassword = async () => {
    const response = await forgotPassword(email);
    if (response) setStep(2);
  };

  const handleVerifyOTP = async () => {
    const response = await verifyOTP(email, otp);
    if (response) setStep(3);
  };

  const handleResetPassword = async () => {
    const response = await resetPassword(email, otp, newPassword);
    if (response) alert("Password reset successful! You can log in now.");
  };

  return (
    <div>
      {step === 1 && (
        <div>
          <h2>Forgot Password</h2>
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button onClick={handleForgotPassword} disabled={loading}>Send OTP</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Verify OTP</h2>
          <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button onClick={handleVerifyOTP} disabled={loading}>Verify OTP</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Reset Password</h2>
          <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <button onClick={handleResetPassword} disabled={loading}>Reset Password</button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
