import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";

function SelectRole() {
  const { user, selectRole } = useAuth();
  const navigate = useNavigate();

  const roleConfig = {
    admin_asambal: {
      label: "Admin Asambal",
      description: "Gestión general del sistema",
      path: "/admin",
    },
    admin_club: {
      label: "Admin Club",
      description: "Administración del club",
      path: "/admin-club",
    },
    profesor: {
      label: "Profesor",
      description: "Gestión de jugadores y equipo",
      path: "/profesor",
    },
    jugador: {
      label: "Jugador",
      description: "Perfil personal y actividad deportiva",
      path: "/jugador",
    },
  };

  const handleSelect = (role) => {
    selectRole(role);
    navigate(roleConfig[role].path);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 bg-cover bg-center bg-[url('/src/Assets/fondologin.webp')]">
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 w-full max-w-2xl p-8 border shadow-xl bg-white/10 backdrop-blur-md rounded-2xl border-white/20">
        <h2 className="mb-2 text-3xl font-bold text-center text-white">
          Elegí cómo querés entrar
        </h2>
        <p className="mb-6 text-sm text-center text-gray-300">
          Tenés múltiples perfiles disponibles
        </p>

        <div className="grid gap-4">
          {user.roles.map((role) => {
            const config = roleConfig[role];

            return (
              <button
                key={role}
                onClick={() => handleSelect(role)}
                className="w-full p-4 text-left transition-all border rounded-xl border-white/20 bg-white/10 hover:bg-white/20 hover:scale-[1.01] group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {config.label}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {config.description}
                    </p>
                  </div>

                  <div className="text-white opacity-50 transition-all group-hover:opacity-100">
                    →
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SelectRole;