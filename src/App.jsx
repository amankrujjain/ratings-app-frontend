import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import Navbar from "./components/Navbar";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ForgotPassword from "./components/ForgotPassword"; // Import Forgot Password Page
import { UserContext } from "./context/userContext";
import EmployeeManagement from "./pages/EmployeeManagement";
import RatingsDisplay from "./pages/RatingsDisplay";
import EmployeeReviews from "./pages/EmployeeReviews";
import RolesTable from "./pages/RolesTable";
import SingleEmployeeRating from "./components/SingleEmployeeRatings";
import RatingSubmissionForm from "./components/RatingsSubmissionForm";

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);
  console.log("ProtectedRoute - loading:", loading, "user:", user);
  if (loading) return <div>Loading...</div>;
  if (!user || !user.isLogin) return <Navigate to="/login" />;
  return children;
}

function App() {
  const { user } = useContext(UserContext) || {};

  return (
    <div className="App">

      <Navbar />
      <Routes>
        <Route path="/submit-review/:employeeId" element={<RatingSubmissionForm/>}/>
        <Route path="/" element={user && user.isLogin ? <Navigate to="/profile" /> : <Login />} />
        <Route
          path="/login"
          element={user && user.isLogin ? <Navigate to="/profile" /> : <Login />}
        />
        <Route
          path="/signup"
          element={user && user.isLogin ? <Navigate to="/profile" /> : <SignUp />}
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/manage-roles"
          element={
            <ProtectedRoute>
              <RolesTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <EmployeeManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-ratings"
          element={
            <ProtectedRoute>
              <RatingsDisplay />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-reviews/:employeeId"
          element={
            <ProtectedRoute>
              <EmployeeReviews />
            </ProtectedRoute>
          }
        />
        <Route
            path="/ratings/employee/:employeeId"
            element={
              <ProtectedRoute>
                <SingleEmployeeRating />
              </ProtectedRoute>
            }
          />
        {/* Added Forgot Password Route */}
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <div>Not Found</div>
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
