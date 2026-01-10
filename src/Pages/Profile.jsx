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
<div className="p-8 mx-auto bg-gray-300 shadow-lg rounded-xl">
  <h2 className="mb-6 text-2xl font-semibold text-gray-800">
    Perfil de <span className="text-blue-700">{user.email}</span>
  </h2>

  <div className="space-y-4">
    {renderContent()}
  </div>
</div>
  );
}

export default Profile;
