import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

const ReviewDetails = () => {
    const { ratingId } = useParams();
    const navigate = useNavigate();

    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const token = localStorage.getItem("accessToken");

                const res = await fetch(`${API_BASE_URL}/ratings/${ratingId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                setReview(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReview();
    }, [ratingId]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!review) return null;

    const initials = review.customerName
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    const formattedDate = new Date(review.createdAt).toLocaleString(
        "en-GB",
        {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }
    );

    const employeeCode =
        review.feedback?.match(/#(\w+)/)?.[1] || review.employee?.employeeId;

    return (
        <div className="min-h-[calc(100vh-70px)] w-full bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">

            {/* Responsive Container */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 w-full sm:w-auto select-none rounded bg-slate-800 py-2 px-6 text-center text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        <span className="font-medium">Back</span>
                    </button>
                </div>

                <div className="flex justify-center">
                    <div className="w-full max-w-lg">

                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-sm mb-4">
                                {/* ✅ Only Green Tick */}
                                <svg
                                    className="w-6 h-6 text-emerald-500"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 
                10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 
                1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                <span className="ml-2 text-sm font-medium text-600">
                                    Verified Review
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold text-slate-800">
                                Review Details
                            </h1>
                        </div>

                        {/* Main Card */}
                        <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/50 overflow-hidden">

                            {/* Source + ID */}
                            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-100">
                                <div className="flex items-center justify-between flex-wrap gap-4">

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                            <img
                                                src="https://www.gstatic.com/images/branding/product/1x/gmb_48dp.png"
                                                alt="Google"
                                                className="w-6 h-6"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                                                Source
                                            </p>
                                            <p className="text-slate-700 font-semibold">
                                                Google My Business
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                                            Review ID
                                        </p>
                                        <p className="text-slate-600 font-mono text-sm break-all">
                                            {review.googleReviewId}
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* Rating Section */}
                            <div className="px-6 py-6 text-center border-b border-slate-100">
                                <div className="flex justify-center gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-8 h-8 sm:w-10 sm:h-10 ${i < review.rating
                                                    ? "text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                                                    : "text-gray-300"
                                                }`}
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 
                    4.87 1.18 6.88L12 17.77l-6.18 
                    3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    ))}
                                </div>

                                <p className="text-3xl sm:text-4xl font-bold text-slate-800">
                                    {review.rating}
                                    <span className="text-lg font-normal text-slate-400">
                                        {" "} / 5
                                    </span>
                                </p>

                                {/* rating text/color */}
                                {(() => {
                                    let text = "";
                                    let colorClass = "";

                                    if (review.rating >= 4) {
                                        text = "Excellent Rating";
                                        colorClass = "text-emerald-600";
                                    } else if (review.rating === 3) {
                                        text = "Good job, keep going";
                                        colorClass = "text-amber-500"; // orange
                                    } else {
                                        text = "Needs improvement";
                                        colorClass = "text-rose-600"; // red
                                    }

                                    return (
                                        <p className={`text-sm ${colorClass} font-medium mt-1`}>
                                            {text}
                                        </p>
                                    );
                                })()}
                            </div>

                            {/* Customer */}
                            <div className="px-6 py-5">
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                        {initials}
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">
                                            Customer
                                        </p>
                                        <p className="text-lg sm:text-xl font-semibold text-slate-800">
                                            {review.customerName}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feedback */}
                            <div className="px-6 py-5 bg-gradient-to-br from-slate-50 to-white">
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">
                                    Feedback
                                </p>

                                <blockquote className="text-base sm:text-lg text-slate-700 leading-relaxed">
                                    "{review.feedback}"
                                </blockquote>

                                {employeeCode && (
                                    <div className="mt-3">
                                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                                            #{employeeCode}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Timestamp */}
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                                <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                                    <span className="text-slate-500">Created</span>
                                    <span className="font-medium text-slate-700">
                                        {formattedDate}
                                    </span>
                                </div>
                            </div>

                        </div>

                        <p className="text-center text-slate-400 text-sm mt-6">
                            Powered by Review Management System
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewDetails;