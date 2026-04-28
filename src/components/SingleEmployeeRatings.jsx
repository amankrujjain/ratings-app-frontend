// src/components/SingleEmployeeRating.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useRating } from "../context/RatingContext";
import SearchInput from "./SearchInput";
import { config } from '../../config';

const BASE_URL = config.BASE_URL;

const SingleEmployeeRating = () => {
  const { employeeId } = useParams();
  const { ratings, pagination, loading, error, getEmployeeRatings } = useRating();

  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (!employeeId) {
      return;
    }

    const params = {
      page: currentPage,
      limit: itemsPerPage,
      sortBy,
      order,
    };

    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim();
    }

    getEmployeeRatings(employeeId, params);
  }, [employeeId, currentPage, itemsPerPage, sortBy, order, debouncedSearch, getEmployeeRatings]);

  const employeeName =
    ratings[0]?.employee?.employeeName || "Unknown Employee";

  const totalPages = Math.max(1, pagination?.totalPages || 1);
  const totalReviews = pagination?.totalItems ?? ratings.length;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (loading && ratings.length === 0) {
    return <div className="text-center py-4 text-gray-500">Loading ratings...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100">
      <div className="relative flex flex-col w-full max-w-screen-2xl mx-auto my-16 px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-xl p-5 overflow-hidden">
        <div className="relative mx-4 mt-4 text-slate-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                Ratings for {employeeName}
              </h3>
              <p className="text-slate-500">
                Total reviews: {totalReviews}
              </p>
            </div>

            <SearchInput
              value={searchTerm}
              onChange={handleSearch}
              onClear={() => setSearchTerm("")}
              placeholder="Search by customer, source, review id..."
              wrapperClassName="max-w-xs"
            />
          </div>
        </div>

        {ratings.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No ratings found.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto mt-6">
              <table className="w-full table-fixed bg-white border border-gray-200 rounded-lg shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-[14%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="w-[10%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th
                      onClick={() => handleSort("customerName")}
                      className="w-[13%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      <p className="flex items-center gap-2">
                        Customer Name
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className={`w-4 h-4 transform transition-transform ${
                            sortBy === "customerName" && order === "desc"
                              ? "rotate-180"
                              : ""
                          }`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                          />
                        </svg>
                      </p>
                    </th>
                    <th
                      onClick={() => handleSort("rating")}
                      className="w-[8%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      <p className="flex items-center gap-2">
                        Rating
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className={`w-4 h-4 transform transition-transform ${
                            sortBy === "rating" && order === "desc"
                              ? "rotate-180"
                              : ""
                          }`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                          />
                        </svg>
                      </p>
                    </th>
                    <th
                      onClick={() => handleSort("googleReviewId")}
                      className="w-[20%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      <p className="flex items-center gap-2">
                        GMB Rating ID
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className={`w-4 h-4 transform transition-transform ${
                            sortBy === "googleReviewId" && order === "desc"
                              ? "rotate-180"
                              : ""
                          }`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                          />
                        </svg>
                      </p>
                    </th>
                    <th
                      onClick={() => handleSort("source")}
                      className="w-[8%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      <p className="flex items-center gap-2">
                        Source
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className={`w-4 h-4 transform transition-transform ${
                            sortBy === "source" && order === "desc"
                              ? "rotate-180"
                              : ""
                          }`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                          />
                        </svg>
                      </p>
                    </th>
                    <th
                      onClick={() => handleSort("createdAt")}
                      className="w-[10%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      <p className="flex items-center gap-2">
                        Date
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className={`w-4 h-4 transform transition-transform ${
                            sortBy === "createdAt" && order === "desc"
                              ? "rotate-180"
                              : ""
                          }`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                          />
                        </svg>
                      </p>
                    </th>
                    <th className="w-[12%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ratings.map((rating) => (
                    <tr key={rating._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              rating.employee?.employeePhoto
                                ? `${BASE_URL}/${rating.employee.employeePhoto.replace(
                                    /\\/g,
                                    "/"
                                  )}`
                                : "https://via.placeholder.com/40"
                            }
                            alt="Employee"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span className="text-sm text-gray-900">
                            {rating.employee?.employeeName || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rating.employee?.employeeId || "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rating.customerName || "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rating.rating ?? "N/A"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 truncate" title={rating.googleReviewId || ""}>
                        {rating.googleReviewId || "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rating.source || "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rating.createdAt
                          ? new Date(rating.createdAt).toLocaleDateString("en-GB")
                          : "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/review-details/${rating._id}`}
                          className="inline-flex items-center gap-2 w-full sm:w-auto select-none rounded bg-slate-800 py-2 px-6 text-center text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between p-3">
              <p className="block text-sm text-slate-500">
                Page {currentPage} of {totalPages || 1}
              </p>

              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SingleEmployeeRating;