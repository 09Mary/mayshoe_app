import { Navigate } from "react-router-dom";
import { isAuthenticated, isStaff } from "../utils/auth";

function AdminRoute({ children }) {
  if (!isAuthenticated()) return <Navigate to="/auth" replace />;
  if (!isStaff()) return <Navigate to="/" replace />;
  return children;
}

export default AdminRoute;