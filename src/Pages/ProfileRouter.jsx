import { useAuth } from "../Auth/AuthContext";
import { ROLES } from "../Utils/roles";

import AsambalProfile from "./Profiles/AsambalProfile";
import ClubProfile from "./Profiles/ClubProfile";
import CoachProfile from "./Profiles/CoachProfile";
import PlayerProfile from "./Profiles/PlayerProfile";

function ProfileRouter() {
  const { user, loading } = useAuth();

  if (loading) return null; // spinner si querés quedar elegante
  if (!user) return null;

  switch (user.role) {
    case ROLES.ADMIN_ASAMBAL:
      return <AsambalProfile user={user} />;

    case ROLES.ADMIN_CLUB:
      return <ClubProfile user={user} />;

    case ROLES.PROFESOR:
      return <CoachProfile user={user} />;

    case ROLES.JUGADOR:
      return <PlayerProfile user={user} />;

    default:
      return <p>Rol no reconocido</p>;
  }
}

export default ProfileRouter;