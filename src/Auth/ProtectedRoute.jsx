import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, activeRole, loading } = useAuth();

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(activeRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (!activeRole) {
  return <Navigate to="/select-role" replace />;
}

  console.log("ProtectedRoute", {
  user,
  roles: user?.roles,
  allowedRoles,
});

  return children;
}

export default ProtectedRoute;
