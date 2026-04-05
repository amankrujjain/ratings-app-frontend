import { useEffect, useState, useContext } from "react";
import { useWallet } from "../context/WalletContext";
import { UserContext } from "../context/userContext";

function Wallet() {
  const { user } = useContext(UserContext);
  const { walletData, loading, getMonthlyWallet } = useWallet();

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  useEffect(() => {
    if (user?._id) {
      getMonthlyWallet(user._id, month, year);
    }
  }, [user, month, year]);

  if (!user)
    return <div className="h-screen flex items-center justify-center">Please login</div>;

  return (
    <div className="min-h-[calc(100vh-70px)] bg-gradient-to-b from-slate-50 to-slate-100 pt-20 xl:pt-10 px-4 overflow-hidden flex flex-col">

      {/* HEADER */}
      <div className="max-w-4xl mx-auto mb-8 w-full">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded bg-slate-800 flex items-center justify-center text-white font-bold shadow-md">
            ₹
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            My Incentive Wallet
          </h1>
        </div>
        <p className="text-slate-600 text-sm">
          Monitor your earnings from verified reviews
        </p>
      </div>

      {/* FILTER CARD */}
      <div className="max-w-md mx-auto mb-8 w-full">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-2 text-slate-600 uppercase">
                Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-800"
              >
                {monthNames.map((m, index) => (
                  <option key={index + 1} value={index + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-semibold mb-2 text-slate-600 uppercase">
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-800"
              >
                {[2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-lg mx-auto w-full flex-1 flex items-start">

        {loading ? (
          <div className="w-full text-center py-10">Loading...</div>
        ) : walletData ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm w-full">

            {/* PERIOD */}
            <div className="mb-6">
              <span className="bg-slate-800 text-white font-semibold text-sm px-4 py-2 rounded-lg">
                {monthNames[month - 1]} {year}
              </span>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

              {/* TOTAL REVIEWS */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
                <div className="flex items-center gap-2 mb-1 text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <span className="text-xs uppercase">Total Reviews</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">
                  {walletData.totalReviews}
                </p>
              </div>

              {/* AVG RATING */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
                <div className="flex items-center gap-2 mb-1 text-slate-500">
                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="text-xs uppercase">Avg Rating</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">
                  {walletData.totalReviews > 0
                    ? walletData.averageRating
                    : "—"}
                </p>
              </div>
            </div>

            {/* INCENTIVE PER REVIEW */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-1 text-slate-500">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
                <span className="text-xs uppercase">Incentive Per Review</span>
              </div>
              <p className="text-lg font-bold text-slate-900">
                ₹ {walletData.incentivePerReview}
              </p>
            </div>

            {/* TOTAL EARNINGS */}
            <div className="
              block text-center w-full select-none rounded 
              bg-slate-800 py-6 px-6 
              text-sm font-semibold text-white 
              shadow-md shadow-slate-900/10 
              transition-all 
              hover:shadow-lg hover:shadow-slate-900/20 
              active:opacity-[0.85]
            ">
              <p className="text-xs uppercase mb-2 text-slate-300">
                Total Earnings
              </p>
              <p className="text-2xl sm:text-4xl font-extrabold">
                ₹ {walletData.totalIncentive}
              </p>
            </div>

          </div>
        ) : (
          <div className="w-full text-center py-10">No data available</div>
        )}
      </div>
    </div>
  );
}

export default Wallet;