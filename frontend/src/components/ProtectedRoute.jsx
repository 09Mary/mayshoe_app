import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to auth, but remember where they were going
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default ProtectedRoute;