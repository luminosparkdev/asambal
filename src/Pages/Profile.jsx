import { useAuth } from "../Auth/AuthContext";

function Profile() {
  const { user } = useAuth();

  if (!user) return null; 

  const renderContent = () => {
    switch (user.role) {
      case "admin_asambal":
        return <p>Bienvenido, Admin ASAMBAL. Podés gestionar usuarios y clubes.</p>;

      case "admin_club":
        return <p>Bienvenido, Admin de Club. Podés gestionar tu club y jugadores.</p>;

      case "profesor":
        return <p>Bienvenido, Profesor. Podés ver tus equipos y horarios.</p>;

      case "jugador":
        return <p>Bienvenido, Jugador. Podés ver tus entrenamientos y resultados.</p>;

      default:
        return <p>Bienvenido, usuario.</p>;
    }
  };

  return (
    <div>
      <h1>Perfil de {user.email}</h1>
      {renderContent()}
    </div>
  );
}

export default Profile;
