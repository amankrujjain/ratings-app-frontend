// src/pages/RatingsDisplay.jsx
import React, { useEffect, useState } from "react";
import { useRating } from "../context/RatingContext";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { Link } from "react-router-dom";

const BASE_URL = 'http://localhost:5000';

const RatingsDisplay = () => {
  const { ratings, loading, error, getAllRatings, deleteRating } = useRating();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRatingId, setSelectedRatingId] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    getAllRatings();
  }, [getAllRatings]);

  const handleDeleteClick = (ratingId) => {
    setSelectedRatingId(ratingId);
    setDeleteModalOpen(true);
  };

  const handleSyncGMB = async () => {
    try {
      setIsSyncing(true);

      const token = localStorage.getItem("accessToken");

      const response = await fetch("http://localhost:5000/gmb/sync", {
        method: "GET", // change to GET if your API uses GET
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Sync failed");
      }

      alert("GMB Reviews synced successfully ✅");

      // refresh ratings after sync
      getAllRatings();

    } catch (error) {
      console.error("Sync Error:", error);
      alert(error.message || "Sync failed");
    } finally {
      setIsSyncing(false);
    }
  };

  const confirmDelete = (ratingId) => {
    deleteRating(ratingId);
    setDeleteModalOpen(false);
    setSelectedRatingId(null);
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading ratings...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          All Ratings
        </h2>

        {/* Button aligned to right like Actions column */}
        <div className="flex justify-end">
          <button
            onClick={handleSyncGMB}
            disabled={isSyncing}
            className="inline-flex items-center justify-center gap-2
             w-full sm:w-auto
             select-none rounded
             bg-slate-800
             py-2 px-6
             text-center text-sm font-semibold text-white
             shadow-md shadow-slate-900/10
             transition-all
             hover:shadow-lg hover:shadow-slate-900/20
             active:opacity-[0.85]
             disabled:pointer-events-none
             disabled:opacity-50
             disabled:shadow-none"
          >
            {isSyncing && (
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-25"
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                  className="opacity-75"
                />
              </svg>
            )}

            {isSyncing ? "Syncing..." : "Sync GMB Reviews"}
          </button>
        </div>
      </div>
      {ratings.length === 0 ? (
        <p className="text-gray-500 text-center">No ratings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Photo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GMB Rating ID</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Phone</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ratings.map((rating) => (
                <tr key={rating._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* <Link to={`/employee-reviews/${rating.employee?._id}`}> */}
                    <img
                      src={
                        rating.employee?.employeePhoto
                          ? `${BASE_URL}/${rating.employee.employeePhoto.replace(/\\/g, '/')}`
                          : 'https://via.placeholder.com/40'
                      }
                      alt="Employee"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {/* </Link> */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {/* <Link to={`/employee-reviews/${rating.employee?._id}`}> */}
                    {rating.employee?.employeeId || "N/A"}
                    {/* </Link> */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {/* <Link to={`/employee-reviews/${rating.employee?._id}`}> */}
                    {rating.employee?.employeeName || "N/A"}
                    {/* </Link> */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rating.customerName || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rating.googleReviewId || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rating.rating}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      to={`/review-details/${rating._id}`}
                      className="w-full sm:w-auto select-none rounded bg-slate-800 py-2 px-6 text-center text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    >
                      View Details
                    </Link>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-white ${rating.inRange ? 'bg-green-500' : 'bg-red-500'}`} title={rating.inRange ? "With in range":"Outside of range"}>
                      {rating.inRange ? 'Yes' : 'No'}
                    </span>
                  </td> */}
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => handleDeleteClick(rating._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                      title="delete"
                    >
                      Delete
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedRatingId(null);
        }}
        onConfirm={confirmDelete}
        ratingId={selectedRatingId}
      />
    </div>
  );
};

export default RatingsDisplay;