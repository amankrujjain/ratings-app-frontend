import { useEffect, useState, useContext } from "react";
import { useWallet } from "../context/WalletContext";
import { UserContext } from "../context/userContext";

function Wallet() {
  const { user } = useContext(UserContext);
  const { walletData, loading, getMonthlyWallet } = useWallet();

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  useEffect(() => {
    if (user?._id) {
      getMonthlyWallet(user._id, month, year);
    }
  }, [user, month, year]);

  if (!user) return <div>Please login</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-24">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          💰 My Incentive Wallet
        </h2>

        <div className="flex gap-4 mb-6">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-2 rounded"
          >
            {[...Array(12)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {new Date(0, index).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-2 rounded w-24"
          />
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : walletData ? (
          <div className="space-y-4">

            <div className="bg-indigo-50 p-4 rounded">
              Total Reviews: {walletData.totalReviews}
            </div>

            <div className="bg-yellow-50 p-4 rounded">
              Average Rating: ⭐ {walletData.averageRating}
            </div>

            <div className="bg-green-50 p-4 rounded">
              Incentive Per Review: ₹ {walletData.incentivePerReview}
            </div>

            <div className="bg-green-100 p-6 rounded text-center">
              <h2 className="text-3xl font-bold">
                ₹ {walletData.totalIncentive}
              </h2>
            </div>

          </div>
        ) : (
          <div>No data available</div>
        )}

      </div>
    </div>
  );
}

export default Wallet;