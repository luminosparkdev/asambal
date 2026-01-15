import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import { ROLES } from "../Utils/roles";

function DashboardRouter() {
  const { user, loading } = useAuth();

  if (loading) return null; // o spinner

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case ROLES.ADMIN_ASAMBAL:
      return <Navigate to="/admin" />;
    case ROLES.ADMIN_CLUB:
      return <Navigate to="/admin-club" />;
    case ROLES.PROFESOR:
      return <Navigate to="/profesor" />;
    case ROLES.JUGADOR:
      return <Navigate to="/players/me" />;
    default:
      return <Navigate to="/unauthorized" />;
  }
}

export default DashboardRouter;
