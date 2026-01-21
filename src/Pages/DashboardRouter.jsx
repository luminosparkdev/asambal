import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import { ROLES } from "../Utils/roles";

function DashboardRouter() {
  const { user, loading } = useAuth();

  if (loading) return null; // o spinner

  if (!user) return <Navigate to="/login" />;

  if (user.roles.includes(ROLES.ADMIN_ASAMBAL)) {
    return <Navigate to="/admin" />;
  }
  if (user.roles.includes(ROLES.ADMIN_CLUB)) {
    return <Navigate to="/admin-club" />;
  }
  if (user.roles.includes(ROLES.PROFESOR)) {
    return <Navigate to="/profesor" />;
  }
  if (user.roles.includes(ROLES.JUGADOR)) {
    return <Navigate to="/jugador" />;
  }

  return <Navigate to="/unauthorized" />;
}

export default DashboardRouter;
