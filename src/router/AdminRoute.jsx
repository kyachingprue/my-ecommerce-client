import { Navigate, useLocation } from "react-router-dom";
import useRole from "../Hooks/useRole";
import LoadingSpinner from "../components/LoadingSpinner";


const AdminRoute = ({ children }) => {
  const { role, roleLoading, isError } = useRole();
  const location = useLocation();

  // Loading state
  if (roleLoading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (isError) {
    return (
      <p className="text-center text-red-500 mt-10">
        Something went wrong while fetching role data!
      </p>
    );
  }

  // Only allow admin
  if (role === "admin") {
    return children;
  }

  // Redirect non-admin users
  return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;
