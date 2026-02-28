import { useEffect, useState } from "react";
import { useAdminIncentive } from "../context/AdminIncentiveContext";

function AdminIncentives() {
    const { summary, loading, getMonthlySummary } = useAdminIncentive();

    const today = new Date();
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        getMonthlySummary(month, year);
    }, [month, year]);

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
    const handleExport = () => {
        if (!selectedMonth || !selectedYear) {
            alert("Please select month and year");
            return;
        }


        const token = localStorage.getItem("accessToken");

        const url = `http://localhost:5000/incentive/export-monthly?month=${selectedMonth}&year=${selectedYear}`;

        fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to export");
                }
                return response.blob();
            })
            .then((blob) => {
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = `Incentives_${selectedMonth}_${selectedYear}.xlsx`;
                link.click();
            })
            .catch((err) => {
                console.error("Export error:", err);
                alert("Export failed");
            });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 pt-24">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">

                <h2 className="text-2xl font-bold mb-6">
                    💰 Monthly Incentive Summary
                </h2>

                <div className="flex gap-4 mb-6">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    >
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                        {[2024, 2025, 2026].map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleExport}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ml-4"
                    >
                        📥 Export Excel
                    </button>
                </div>


                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 text-left">Employee</th>
                                    <th className="p-3 text-left">Total Reviews</th>
                                    <th className="p-3 text-left">Avg Rating</th>
                                    <th className="p-3 text-left">₹ / Review</th>
                                    <th className="p-3 text-left">Total Incentive</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summary.map((item) => (
                                    <tr key={item.employeeId} className="border-t">
                                        <td className="p-3">{item.employeeName}</td>
                                        <td className="p-3">{item.totalReviews}</td>
                                        <td className="p-3">⭐ {item.averageRating}</td>
                                        <td className="p-3">₹ {item.incentivePerReview}</td>
                                        <td className="p-3 font-semibold text-green-600">
                                            ₹ {item.totalIncentive}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </div>
    );
}

export default AdminIncentives;