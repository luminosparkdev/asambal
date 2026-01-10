import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import { ArrowLeftIcon, BellIcon } from '@heroicons/react/24/outline';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const notifications = 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Rutas donde NO queremos mostrar la flecha
  const noBackArrowPaths = ["/", "/login", "/admin"];
  const showBackArrow = isAuthenticated && !noBackArrowPaths.includes(location.pathname);

  const showDashboardButton = isAuthenticated && location.pathname === "/";

  return (
    <nav className="text-white bg-blue-900 shadow-md">
      <div className="px-4 mx-auto max-w-7xl">
        {/* Top Navbar: Logo + Links */}
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-wide hover:text-blue-200">
            <span className="text-xl font-bold text-white">AsAmBal</span>
          </Link>

          {/* Links */}
          <ul className="flex items-center space-x-6 font-light">

            {!isAuthenticated && (
              <li>
                <Link
                  to="/login"
                  className="px-4 py-2 font-semibold transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Iniciar sesión
                </Link>
              </li>
            )}

            {isAuthenticated && (
              <>
                <li>
                  <Link to="/perfil" className="transition-colors hover:text-blue-200">Perfil</Link>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 transition-colors bg-red-700 rounded-md hover:bg-red-600"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Usuario / Flecha / Dashboard button / Campana */}
        {isAuthenticated && (
          <div className="flex items-center justify-between py-2">

            {/* Flecha de volver atrás */}
            {showBackArrow && (
              <div
                className="flex items-center gap-2 text-sm text-blue-200 cursor-pointer hover:text-blue-100"
                onClick={() => window.history.length > 1 && navigate(-1)}
                title="Volver atrás"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Volver</span>
              </div>
            )}

            {/* Saludo */}
            <div className="flex-1 text-sm text-center text-blue-200">
              Bienvenido, <span className="font-medium">{user.email}</span>
            </div>

            {/* Botón ir al Dashboard */}
            {showDashboardButton && (
              <button
                className="px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-500"
                onClick={() => navigate("/admin")}
              >
                Ir al Dashboard
              </button>
            )}

            {/* Campana de notificaciones */}
            <div className="relative ml-4 cursor-pointer">
              <BellIcon className="w-6 h-6 text-blue-200 hover:text-blue-100" />
              {notifications > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                  {notifications}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;