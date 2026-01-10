import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="text-white bg-blue-900 shadow-md">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-16">

          {/* Logo / Nombre */}
          <Link
            to="/"
            className="text-xl font-bold tracking-wide hover:text-blue-200"
          >
            <h1 className="text-xl font-bold text-white">AsAmBal </h1>
          </Link>

          {/* Links */}
          <ul className="flex items-center space-x-6">
            <li>
              <Link
                to="/"
                className="transition-colors hover:text-blue-200"
              >
                Inicio
              </Link>
            </li>

            {!isAuthenticated && (
              <li>
                <Link
                  to="/login"
                  className="px-4 py-2 transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Login
                </Link>
              </li>
            )}

            {isAuthenticated && (
              <>
                <li>
                  <Link
                    to="/perfil"
                    className="transition-colors hover:text-blue-200"
                  >
                    Perfil
                  </Link>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 transition-colors bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Usuario */}
        {isAuthenticated && (
          <div className="pb-2 text-sm text-blue-200">
            Bienvenido, <span className="font-medium">{user.email}</span>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
