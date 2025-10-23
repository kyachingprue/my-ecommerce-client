import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ✅ 1. Wait for loading to finish first
  if (loading) {
    return <LoadingSpinner />;
  }

  // ✅ 2. After loading, if no user found -> redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // ✅ 3. Otherwise, show the protected page
  return children;
};

export default PrivateRoute;
