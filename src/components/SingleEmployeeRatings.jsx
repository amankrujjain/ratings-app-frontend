// src/components/SingleEmployeeRating.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useRating } from "../context/RatingContext";

const BASE_URL = "http://localhost:5000/api"; // Adjust as needed

const SingleEmployeeRating = () => {
  const { employeeId } = useParams(); // Get employeeId from URL params
  const { ratings, loading, error, getEmployeeRatings } = useRating();

  useEffect(() => {
    if (employeeId) {
      getEmployeeRatings(employeeId); // Fetch ratings using protected endpoint
    }
  }, [employeeId, getEmployeeRatings]);

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading ratings...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  const employeeRatings = ratings.filter((rating) => rating.employee?._id === employeeId);
  const employeeName = employeeRatings[0]?.employee?.employeeName || "Unknown Employee";

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Ratings for {employeeName}
      </h2>
      {employeeRatings.length === 0 ? (
        <p className="text-gray-500 text-center">No ratings found for this employee.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee Photo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GMB Rating ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In Range
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employeeRatings.map((rating) => (
                <tr key={rating._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={
                        rating.employee?.employeePhoto
                          ? `${BASE_URL}/${rating.employee.employeePhoto.replace(/\\/g, "/")}`
                          : "https://via.placeholder.com/40"
                      }
                      alt="Employee"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rating.employee?.employeeId || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rating.employee?.employeeName || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rating.customerName || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rating.rating}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rating.googleReviewId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rating.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      to={`/review-details/${rating._id}`}
                      className="inline-flex items-center gap-2 w-full sm:w-auto select-none rounded bg-slate-800 py-2 px-6 text-center text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"

                    >
                      View Details
                    </Link>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-white ${
                        rating.inRange ? "bg-green-500" : "bg-red-500"
                      }`}
                      title={rating.inRange ? "Within range" : "Outside of range"}
                    >
                      {rating.inRange ? "Yes" : "No"}
                    </span>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SingleEmployeeRating;