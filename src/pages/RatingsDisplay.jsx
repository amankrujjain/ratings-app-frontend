import React, { useEffect, useState } from "react";
import { useRating } from "../context/RatingContext";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
const BASE_URL = 'http://localhost:5000';

const RatingsDisplay = () => {
  const { ratings, loading, error, getAllRatings, deleteRating } = useRating();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRatingId, setSelectedRatingId] = useState(null);

  useEffect(() => {
    getAllRatings();
  }, [getAllRatings]);

  const handleDeleteClick = (ratingId) => {
    setSelectedRatingId(ratingId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = (ratingId) => {
    deleteRating(ratingId);
    setDeleteModalOpen(false);
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading ratings...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Ratings</h2>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ratings.map((rating) => (
                <tr key={rating._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={
                        rating.employee?.employeePhoto
                          ? `${BASE_URL}/${rating.employee.employeePhoto.replace(/\\/g, '/')}`
                          : 'https://via.placeholder.com/40'
                      }
                      alt="Employee"
                      className="w-10 h-10 rounded-full object-cover"
                    />

                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rating.employee?.employeeId || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rating.employee?.employeeName || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rating.customerName || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rating.rating}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="mr-2 px-3 py-1 bg-blue-500 text-white rounded" title="edit">Edit</button>
                    <button
                      onClick={() => handleDeleteClick(rating._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                      title="delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        ratingId={selectedRatingId}
      />
    </div>
  );
};

export default RatingsDisplay;