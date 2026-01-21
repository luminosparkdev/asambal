import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.some(role => user?.roles?.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("ProtectedRoute", {
  user,
  roles: user?.roles,
  allowedRoles,
});

  return children;
}

export default ProtectedRoute;
