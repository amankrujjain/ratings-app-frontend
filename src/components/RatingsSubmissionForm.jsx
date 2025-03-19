// src/components/RatingSubmissionForm.jsx
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useRating } from "../context/RatingContext";

const BASE_URL = "http://localhost:5000"; // Adjust as needed
const DEFAULT_EMPLOYEE_ID = "67cda2bd951a8574e3cbea9d";

const RatingSubmissionForm = () => {
  const { employeeId = DEFAULT_EMPLOYEE_ID } = useParams();
  const { employee, ratings, loading, error, getEmployeeRatings, submitRating } = useRating();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    rating: "",
    feedback: "",
    latitude: null,
    longitude: null,
  });
  const [locationPermission, setLocationPermission] = useState("pending");

  // Fetch employee ratings
  useEffect(() => {
    getEmployeeRatings(employeeId);
  }, [employeeId, getEmployeeRatings]);

  // Request location permission
  useEffect(() => {
    const requestLocation = async () => {
      try {
        if (!navigator.geolocation) {
          setLocationPermission("denied");
          toast.error("Geolocation is not supported by your browser");
          return;
        }

        const permission = await navigator.permissions.query({ name: "geolocation" });
        if (permission.state === "granted" || permission.state === "prompt") {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setFormData((prev) => ({
                ...prev,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              }));
              setLocationPermission("granted");
            },
            () => {
              setLocationPermission("denied");
              toast.warn("Location permission denied");
            }
          );
        } else {
          setLocationPermission("denied");
          toast.warn("Location permission denied");
        }
      } catch (err) {
        setLocationPermission("denied");
        toast.error("Error requesting location");
      }
    };

    requestLocation();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await submitRating(employeeId, formData);
        setFormData({
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          rating: "",
          feedback: "",
          latitude: formData.latitude,
          longitude: formData.longitude,
        });
      } catch (err) {
        // Error handled in context
      }
    },
    [employeeId, formData, submitRating]
  );

  // Calculate average rating from ratings array
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

  // Use the employee from the first rating if not already set in context
  const displayEmployee = employee || (ratings.length > 0 ? ratings[0].employee : null);

  if (loading) return <div className="text-center py-4 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
        Submit Your Review
      </h1>

      {/* Employee Details and Form Container */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Employee Profile Card */}
        {displayEmployee ? (
          <div className="bg-white shadow-sm border border-slate-200 rounded-lg w-full md:w-1/3">
            <div className="m-2.5 overflow-hidden rounded-md h-64 flex justify-center items-center">
              <img
                className="w-full h-full object-cover"
                src={
                  displayEmployee.employeePhoto
                    ? `${BASE_URL}/${displayEmployee.employeePhoto.replace(/\\/g, "/")}`
                    : "https://docs.material-tailwind.com/img/team-3.jpg"
                }
                alt={displayEmployee.employeeName}
              />
            </div>
            <div className="p-6 text-center">
              <h4 className="mb-1 text-xl font-semibold text-slate-800">
                {displayEmployee.employeeName || "Unknown Employee"}
              </h4>
              <p className="text-sm font-semibold text-slate-500 uppercase">
                {displayEmployee.designation || "N/A"}
              </p>
              <div className="flex justify-center items-center mt-2">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-4 h-4 me-1 ${
                      index < Math.round(averageRating) ? "text-yellow-300" : "text-gray-300"
                    }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                ))}
                <p className="text-sm font-medium text-gray-500">
                  {averageRating.toFixed(1)} ({ratings.length} reviews)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-sm border border-slate-200 rounded-lg w-full md:w-1/3 p-6 text-center">
            <p className="text-gray-500">Employee not found - Rating for ID: {employeeId}</p>
          </div>
        )}

        {/* Rating Form */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-2/3">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Feedback</h3>
          {locationPermission === "pending" && (
            <p className="text-gray-600 mb-4 text-sm">Requesting location permission...</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Phone
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (1-5)
              </label>
              <input
                type="number"
                name="rating"
                min="1"
                max="5"
                value={formData.rating}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback
              </label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 min-h-[100px] text-sm"
              />
            </div>
            {locationPermission === "granted" && (
              <p className="text-sm text-green-600">
                Location acquired: Rating will be validated against shop proximity
              </p>
            )}
            {locationPermission === "denied" && (
              <p className="text-sm text-orange-600">
                Location unavailable: Rating will be submitted without location validation
              </p>
            )}
            <button
              type="submit"
              disabled={loading || locationPermission === "pending"}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {loading ? "Submitting..." : "Submit Rating"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingSubmissionForm;