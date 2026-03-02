import { useEffect, useState, useMemo } from "react";
import { useAdminIncentive } from "../context/AdminIncentiveContext";
import { useNavigate } from "react-router-dom";

function AdminIncentives() {
    const { summary, loading, getMonthlySummary } = useAdminIncentive();
    const navigate = useNavigate();

    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    const [reportType, setReportType] = useState("monthly");

    useEffect(() => {
        getMonthlySummary(selectedMonth, selectedYear);
    }, [selectedMonth, selectedYear]);

    const months = [
        { name: "January", value: 1 },
        { name: "February", value: 2 },
        { name: "March", value: 3 },
        { name: "April", value: 4 },
        { name: "May", value: 5 },
        { name: "June", value: 6 },
        { name: "July", value: 7 },
        { name: "August", value: 8 },
        { name: "September", value: 9 },
        { name: "October", value: 10 },
        { name: "November", value: 11 },
        { name: "December", value: 12 },
    ];

    const totalIncentive = useMemo(() => {
        return summary.reduce((acc, item) => acc + item.totalIncentive, 0);
    }, [summary]);

    const handleExport = () => {
        const token = localStorage.getItem("accessToken");

        let url;

        if (reportType === "monthly") {
            url = `http://localhost:5000/incentive/export-monthly?month=${selectedMonth}&year=${selectedYear}`;
        } else {
            url = `http://localhost:5000/incentive/export-yearly?year=${selectedYear}`;
        }

        fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.blob())
            .then((blob) => {
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download =
                    reportType === "monthly"
                        ? `Incentives_${selectedMonth}_${selectedYear}.xlsx`
                        : `Incentives_${selectedYear}.xlsx`;
                link.click();
            })
            .catch(() => alert("Export failed"));
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-8">

            {/* Back Button (Your Premium Style) */}
            <div className="max-w-5xl mx-auto mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 
                     rounded-lg 
                     bg-slate-800 
                     px-5 py-2.5 
                     text-sm font-semibold text-white 
                     shadow-md shadow-slate-900/20
                     transition-all duration-200 
                     hover:bg-slate-700 
                     active:scale-[0.98]"
                >
                    <svg
                        className="w-4 h-4 stroke-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back
                </button>
            </div>

            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">
                        💰 Monthly Incentive Summary
                    </h1>

                    <button
                        onClick={handleExport}
                        className="inline-flex items-center gap-2 px-4 py-2 
                       bg-white border border-slate-200 
                       rounded-lg 
                       text-sm font-medium text-slate-700
                       hover:bg-slate-50 transition"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                        Export Excel
                    </button>
                </div>

                {/* Filters */}
                <div className="mb-8 pb-6 border-b border-slate-200">

                    {/* Report Type Toggle */}
                    <div className="mb-6">
                        <label className="text-xs text-slate-500 mb-3 block">
                            Report Type
                        </label>

                        <div className="inline-flex bg-slate-100 rounded-lg p-1">

                            <button
                                onClick={() => setReportType("monthly")}
                                className={`px-5 py-2 text-sm font-semibold rounded-md transition-all duration-200
          ${reportType === "monthly"
                                        ? "bg-white shadow text-slate-800"
                                        : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                Monthly
                            </button>

                            <button
                                onClick={() => setReportType("yearly")}
                                className={`px-5 py-2 text-sm font-semibold rounded-md transition-all duration-200
          ${reportType === "yearly"
                                        ? "bg-white shadow text-slate-800"
                                        : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                Yearly
                            </button>

                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row sm:items-end gap-8">

                        {/* Month Filter (Only if Monthly) */}
                        {reportType === "monthly" && (
                            <div className="min-w-[200px]">
                                <label className="text-xs text-slate-500 mb-2 block">
                                    Month
                                </label>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg 
                     text-sm font-medium text-slate-800 bg-white 
                     hover:border-slate-400 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     transition"
                                >
                                    {months.map((m) => (
                                        <option key={m.value} value={m.value}>
                                            {m.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Year Filter */}
                        <div className="min-w-[160px]">
                            <label className="text-xs text-slate-500 mb-2 block">
                                Year
                            </label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg 
                   text-sm font-medium text-slate-800 bg-white 
                   hover:border-slate-400 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   transition"
                            >
                                {[2024, 2025, 2026, 2027].map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">

                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                        Employee
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                        Total Reviews
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                        Avg Rating
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                        ₹ / Review
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                        Total Incentive
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : summary.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                            No data available
                                        </td>
                                    </tr>
                                ) : (
                                    summary.map((item) => (
                                        <tr
                                            key={item.employeeId}
                                            className="border-b border-slate-200 hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                                                {item.employeeName}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-700">
                                                {item.totalReviews}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-700">
                                                <span className="text-amber-600">
                                                    ⭐ {item.averageRating}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-700">
                                                ₹ {item.incentivePerReview}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-green-600">
                                                ₹ {item.totalIncentive}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>

                {/* Total */}
                <div className="flex justify-end mt-6 p-4 bg-slate-100 rounded-lg">
                    <div className="text-right">
                        <p className="text-xs text-slate-500 mb-1">
                            Total Incentive for Period
                        </p>
                        <p className="text-2xl font-bold text-slate-800">
                            ₹ {totalIncentive}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AdminIncentives;