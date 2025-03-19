import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from "../context/AuthContext";

const ForgotPassword = () => {
  const { forgotPassword, verifyOTP, resetPassword, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

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
    if (response) navigate("/profile");
  };

  const renderStepIcon = (currentStep, targetStep) => {
    const isActive = currentStep >= targetStep;
    const bgColor = isActive ? "bg-blue-100" : "bg-gray-100";
    const textColor = isActive ? "text-blue-600" : "text-gray-600";
    const borderColor = isActive ? "after:border-blue-100" : "after:border-gray-100";

    return (
      <li
        className={`flex w-full items-center ${borderColor} after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block`}
      >
        <div
          className={`flex items-center justify-center w-10 h-10 ${bgColor} rounded-full shrink-0`}
        >
          {targetStep === 1 && (
            <svg
              className={`w-4 h-4 ${textColor}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 16"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
            </svg>
          )}
          {targetStep === 2 && (
            <svg
              className={`w-4 h-4 ${textColor}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 14"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM2 12V6h16v6H2Z" />
              <path d="M6 8H4a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2Zm8 0H9a1 1 0 0 0 0 2h5a1 1 0 1 0 0-2Z" />
            </svg>
          )}
          {targetStep === 3 && (
            <svg
              className={`w-4 h-4 ${textColor}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
            </svg>
          )}
        </div>
      </li>
    );
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      {/* Stepper */}
      <ol className="flex items-center w-full mb-6">
        {renderStepIcon(step, 1)}
        {renderStepIcon(step, 2)}
        <li className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 ${
              step === 3 ? "bg-blue-100" : "bg-gray-100"
            } rounded-full shrink-0`}
          >
            <svg
              className={`w-4 h-4 ${step === 3 ? "text-blue-600" : "text-gray-600"}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
            </svg>
          </div>
        </li>
      </ol>

      {/* Form Content */}
      {step === 1 && (
        <div>
          <h2 className="mb-4 text-lg font-medium text-gray-900">Forgot Password</h2>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
              required
            />
          </div>
          <button
            onClick={handleForgotPassword}
            disabled={loading}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="mb-4 text-lg font-medium text-gray-900">Verify OTP</h2>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              OTP
            </label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
              required
            />
          </div>
          <button
            onClick={handleVerifyOTP}
            disabled={loading}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="mb-4 text-lg font-medium text-gray-900">Reset Password</h2>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              New Password
            </label>
            <input
              type="password"
              placeholder="•••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
              required
            />
          </div>
          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;