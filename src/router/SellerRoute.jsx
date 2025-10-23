import { Navigate, useLocation } from "react-router-dom";
import useRole from "../Hooks/useRole";
import LoadingSpinner from "../components/LoadingSpinner";

const SellerRoute = ({ children }) => {
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

  // Only allow seller or admin
  if (role === "seller" || role === "admin") {
    return children;
  }

  // Redirect non-seller users
  return <Navigate to="/" state={{ from: location }} replace />;
};

export default SellerRoute;
