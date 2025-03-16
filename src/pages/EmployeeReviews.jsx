// src/pages/EmployeeReviews.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRating } from "../context/RatingContext";

const BASE_URL = 'http://localhost:5000';

const EmployeeReviews = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const { ratings, loading, error, getAllRatings } = useRating();
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10; // Adjust this number as needed

  useEffect(() => {
    getAllRatings();
  }, [getAllRatings]);

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  const employeeRatings = ratings.filter(rating => rating.employee?._id === employeeId);
  const employee = employeeRatings[0]?.employee;

  if (!employee) {
    return <div className="text-center py-4 text-gray-500">Employee not found</div>;
  }

  // Calculate rating distribution and average
  const ratingDistribution = [0, 0, 0, 0, 0];
  employeeRatings.forEach(rating => {
    ratingDistribution[rating.rating - 1]++;
  });
  const totalReviews = employeeRatings.length;
  const averageRating = employeeRatings.reduce((sum, rating) => sum + rating.rating, 0) / totalReviews || 0;

  // Pagination calculations
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = employeeRatings.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(employeeRatings.length / reviewsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Back
      </button>

      {/* Profile and Ratings Side by Side */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Employee Details */}
        <div className="flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg md:w-1/3">
          <div className="m-2.5 overflow-hidden rounded-md h-80 flex justify-center items-center">
            <img
              className="w-full h-full object-cover"
              src={
                employee.employeePhoto
                  ? `${BASE_URL}/${employee.employeePhoto.replace(/\\/g, '/')}`
                  : 'https://docs.material-tailwind.com/img/team-3.jpg'
              }
              alt={employee.employeeName}
            />
          </div>
          <div className="p-6 text-center">
            <h4 className="mb-1 text-xl font-semibold text-slate-800">
              {employee.employeeName}
            </h4>
            <p className="text-sm font-semibold text-slate-500 uppercase">
              {employee.designation || "N/A"}
            </p>
            <p className="text-sm text-slate-600 mt-2">
              ID: {employee.employeeId}
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Department: {employee.department || "N/A"}
            </p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md md:w-2/3">
          <h3 className="text-xl font-semibold mb-4">Rating Distribution</h3>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                className={`w-4 h-4 me-1 ${index < Math.round(averageRating) ? 'text-yellow-300' : 'text-gray-300'}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
              </svg>
            ))}
            <p className="ms-1 text-sm font-medium text-gray-500">{averageRating.toFixed(2)}</p>
            <p className="ms-1 text-sm font-medium text-gray-500">out of</p>
            <p className="ms-1 text-sm font-medium text-gray-500">5</p>
          </div>
          <p className="text-sm font-medium text-gray-500 mb-4">{totalReviews} total ratings</p>
          
          {[5, 4, 3, 2, 1].map(stars => {
            const percentage = totalReviews > 0 ? (ratingDistribution[stars - 1] / totalReviews) * 100 : 0;
            return (
              <div key={stars} className="flex items-center mt-4">
                <span className="text-sm font-medium text-blue-600 hover:underline w-16">{stars} star</span>
                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded-sm">
                  <div 
                    className="h-5 bg-yellow-300 rounded-sm" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-500">{percentage.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List with Pagination */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Reviews</h3>
        {employeeRatings.length === 0 ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
          <>
            <div className="space-y-6">
              {currentReviews.map(rating => (
                <div 
                  key={rating._id} 
                  className="flex w-full p-4 flex-col rounded-lg bg-white shadow-sm border border-slate-200"
                >
                  <div className="flex items-center justify-between text-slate-800">
                    <h5 className="text-xl font-semibold text-slate-800">
                      {rating.customerName || "Anonymous"}
                    </h5>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className={`w-5 h-5 ${index < rating.rating ? 'text-yellow-600' : 'text-gray-300'}`}
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" 
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-base text-slate-600 font-light leading-normal">
                      {rating.feedback || "No comment provided"}
                    </p>
                    <p className="text-sm text-gray-400 ml-4 whitespace-nowrap">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => paginate(index + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === index + 1 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeReviews;