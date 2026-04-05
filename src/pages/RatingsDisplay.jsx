// src/pages/RatingsDisplay.jsx
import React, { useEffect, useState } from "react";
import { useRating } from "../context/RatingContext";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { Link } from "react-router-dom";
import SearchInput from "../components/SearchInput";
import { config } from '../../config';

const BASE_URL = config.BASE_URL;

const RatingsDisplay = () => {
  const { ratings, pagination, loading, error, getAllRatings, deleteRating } = useRating();

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRatingId, setSelectedRatingId] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // sorting
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  // search
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  //
  // Debounce Search (same as employees)
  //
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  //
  // Fetch Ratings
  //
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      sortBy,
      order,
    };

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    getAllRatings(params).catch((err) =>
      console.error("Fetch ratings failed:", err)
    );
  }, [currentPage, itemsPerPage, sortBy, order, debouncedSearch]);

  //
  // Sorting
  //
  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setOrder("asc");
    }

    setCurrentPage(1);
  };

  //
  // Pagination
  //
  const totalPages = pagination?.totalPages || 1;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  //
  // Search handler
  //
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  //
  // Delete
  //
  const handleDeleteClick = (ratingId) => {
    setSelectedRatingId(ratingId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async (ratingId) => {
    try {
      await deleteRating(ratingId);

      // If last item deleted on page
      if (ratings.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          sortBy,
          order,
        };

        if (debouncedSearch) params.search = debouncedSearch;

        getAllRatings(params);
      }

      setDeleteModalOpen(false);
      setSelectedRatingId(null);
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteModalOpen(false);
      setSelectedRatingId(null);
    }
  };

  //
  // Sync GMB Reviews
  //
  const handleSyncGMB = async () => {
    try {
      setIsSyncing(true);

      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${config.BASE_URL}/gmb/sync`, {
        method: "GET",
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

      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        order,
      };

      if (debouncedSearch) params.search = debouncedSearch;

      getAllRatings(params);

    } catch (error) {
      console.error("Sync Error:", error);
      alert(error.message || "Sync failed");
    } finally {
      setIsSyncing(false);
    }
  };

  //
  // Loading
  //
  if (loading && ratings.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Loading ratings...
      </div>
    );
  }

  //
  // Error
  //
  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Error: {error}
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100">
      <div className="relative flex flex-col w-full max-w-screen-2xl mx-auto my-16 px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-xl p-5 overflow-hidden">

        {/* Header */}
        <div className="relative mx-4 mt-4 text-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                All Ratings
              </h3>
              <p className="text-slate-500">
                Review all customer ratings for employees
              </p>
            </div>

            <div className="w-full sm:flex-1 sm:flex sm:justify-center">
              <SearchInput
                value={searchTerm}
                onChange={handleSearch}
                onClear={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                placeholder="Search employees..."
                wrapperClassName="sm:max-w-md"
              />
            </div>

            {/* Button aligned right */}
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
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
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
          <p className="text-gray-500 text-center py-10">No ratings found.</p>
        ) : (
          <>
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                <thead className="bg-gray-100">
                  <tr>

                    <th
                      onClick={() => handleSort("employee")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      <p className="flex items-center justify-between gap-2">
                        Employee Photo
                      </p>
                    </th>

                    <th
                      onClick={() => handleSort("employeeId")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      <p className="flex items-center justify-between gap-2">
                        Employee ID
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className={`w-4 h-4 transform transition-transform ${sortBy === 'employeeId' && order === 'desc' ? 'rotate-180' : ''}`}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                        </svg>
                      </p>
                    </th>

                    <th
                      onClick={() => handleSort("employeeName")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      <p className="flex items-center justify-between gap-2">
                        Employee Name
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className={`w-4 h-4 transform transition-transform ${sortBy === 'employeeName' && order === 'desc' ? 'rotate-180' : ''}`}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                        </svg>
                      </p>
                    </th>

                    <th
                      onClick={() => handleSort("customerName")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      <p className="flex items-center justify-between gap-2">
                        Customer Name
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className={`w-4 h-4 transform transition-transform ${sortBy === 'customerName' && order === 'desc' ? 'rotate-180' : ''}`}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                        </svg>
                      </p>
                    </th>

                    <th
                      onClick={() => handleSort("googleReviewId")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      <p className="flex items-center justify-between gap-2">
                        GMB Rating ID
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className={`w-4 h-4 transform transition-transform ${sortBy === 'googleReviewId' && order === 'desc' ? 'rotate-180' : ''}`}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                        </svg>
                      </p>
                    </th>

                    <th
                      onClick={() => handleSort("rating")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      <p className="flex items-center justify-between gap-2">
                        Rating
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className={`w-4 h-4 transform transition-transform ${sortBy === 'googleReviewId' && order === 'desc' ? 'rotate-180' : ''}`}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                        </svg>
                      </p>
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {ratings.map((rating) => (
                    <tr key={rating._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
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

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {rating.employee?.employeeId || "N/A"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {rating.employee?.employeeName || "N/A"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {rating.customerName || "N/A"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {rating.googleReviewId || "N/A"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {rating.rating}
                      </td>

                      <td className="px-3 sm:px-6 py-4 text-sm">
                        <Link
                          to={`/review-details/${rating._id}`}
                          className="inline-block whitespace-nowrap select-none rounded bg-slate-800 py-1.5 px-3 sm:py-2 sm:px-6 text-center text-xs sm:text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:opacity-[0.85]"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-3">
              <p className="text-sm text-slate-500">
                Page {currentPage} of {totalPages || 1}
              </p>

              <div className="flex gap-1">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className="rounded border border-slate-300 py-2.5 px-3 text-xs font-semibold text-slate-600 transition-all hover:opacity-75 disabled:opacity-50"
                >
                  Previous
                </button>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className="rounded border border-slate-300 py-2.5 px-3 text-xs font-semibold text-slate-600 transition-all hover:opacity-75 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
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
    </div>
  );
};

export default RatingsDisplay;