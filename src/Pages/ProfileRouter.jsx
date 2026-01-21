import { useAuth } from "../Auth/AuthContext";
import { ROLES } from "../Utils/roles";
import { Navigate } from "react-router-dom";

import AsambalProfile from "./Profiles/AsambalProfile";
import ClubProfile from "./Profiles/ClubProfile";
import CoachProfile from "./Profiles/CoachProfile";
import PlayerProfile from "./Profiles/PlayerProfile";

function ProfileRouter() {
  const { user, loading } = useAuth();

  if (loading) return null; // spinner si querés quedar elegante
  if (!user) return null;

  if (user.roles.includes(ROLES.ADMIN_ASAMBAL)) {
    return <AsambalProfile {...user} />;
  }
  if (user.roles.includes(ROLES.ADMIN_CLUB)) {
    return <ClubProfile {...user} />;
  }
  if (user.roles.includes(ROLES.PROFESOR)) {
    return <CoachProfile {...user} />;
  }
  if (user.roles.includes(ROLES.JUGADOR)) {
    return <PlayerProfile {...user} />;
  }

  return <Navigate to="/unauthorized" />;
}

export default ProfileRouter;