import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import Navbar from "./components/Navbar";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import UserContextProvider, { UserContext } from "./context/UserContext";

// ProtectedRoute: Use loading and isLogin
function ProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);
  console.log('ProtectedRoute - loading:', loading, 'user:', user);
  if (loading) return <div>Loading...</div>;
  if (!user || !user.isLogin) return <Navigate to="/login" />;
  return children;
}

function App() {
  const { user } = useContext(UserContext) || {};

  return (
    <UserContextProvider>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<SignUp />} />
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
            path="/about"
            element={
              <ProtectedRoute>
                <div>About Page</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Dashboard Page</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <div>Products Page</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance"
            element={
              <ProtectedRoute>
                <div>Performance Page</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/deliverables"
            element={
              <ProtectedRoute>
                <div>Deliverables Page</div>
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
    </UserContextProvider>
  );
}

export default App;