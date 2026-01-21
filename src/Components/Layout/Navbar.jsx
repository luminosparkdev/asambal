import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import { ArrowLeftIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from "react";
import { div } from "framer-motion/client";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const isHome = location.pathname === "/";
  const isLogin = location.pathname === "/login";
  const isDashboard = location.pathname === "/dashboard"
    || location.pathname === "/admin"
    || location.pathname === "/admin_club"
    || location.pathname === "/profesor"
    || location.pathname === "/jugador";

  const isAppView = isAuthenticated && !isHome && !isLogin;

  const showDashboardButton = isAuthenticated && !isDashboard;
const showHomeSections = isHome && !isAuthenticated;


  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  useEffect(() => {
    setProfileOpen(false);
  }, [isAuthenticated, location.pathname]);

  const notifications = 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="text-white bg-gradient-to-b from-[#334353] to-[#0F1317] shadow-md border-b-2 border-[#334353]">
      <div className="px-4 mx-auto max-w-7xl">

        {/* Top Navbar */}
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-wide hover:text-blue-200">
            <span className="text-xl font-bold text-white">AsAmBal</span>
          </Link>

          {/* Secciones del Home (solo público) */}
          {showHomeSections && (
            <ul className="items-center hidden gap-6 text-sm text-gray-300 md:flex">
              <li><a href="#clubes" className="px-3 py-1 ml-auto text-sm text-gray-400 transition-all rounded-md hover:text-white">Clubes</a></li>
              <li><a href="#novedades" className="px-3 py-1 ml-auto text-sm text-gray-400 transition-all rounded-md hover:text-white">Novedades</a></li>
              <li><a href="#sponsors" className="px-3 py-1 ml-auto text-sm text-gray-400 transition-all rounded-md hover:text-white">Sponsors</a></li>
              <li><a href="#contacto" className="px-3 py-1 ml-auto text-sm text-gray-400 transition-all rounded-md hover:text-white">Contacto</a></li>
            </ul>
          )}

          {/*Right side */}
          {!isLogin && (
            <div className="flex items-center gap-4">
              {!isAuthenticated && (
              <Link to="/login" className="px-4 py-2 font-semibold text-gray-400 transition-colors border rounded-md border-blue-500/40 hover:bg-blue-500/10 hover:text-gray-200">
                Iniciar sesión
              </Link>
              )}
              {isAuthenticated && (
              <>
              {/* Campana de notificaciones */}
                <div className="relative cursor-pointer">
                  <BellIcon className="w-8 h-8 text-gray-300 transition-colors hover:text-white" />
                  {notifications > 0 && (
                    <span className="absolute flex items-center justify-center w-4 h-4 text-xs bg-red-600 rounded-full -top-1 -right-1">
                      {notifications}
                    </span>
                    )}
                </div>

                {/* Avatar */}
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileOpen(prev => !prev)}
                    className="flex items-center gap-2 px-4 text-gray-300 transition-colors hover:text-white"
                    >
                    <UserCircleIcon className="w-8 h-8" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0F1317] shadow-xl border border-gray-700 z-50">
                      <div className="px-4 py-3 text-sm text-gray-300 border-b border-gray-700">
                        <p className="font-medium text-white">
                          {user?.email ?? "Administrador"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {user?.roles?.[0]
                            ? user.roles[0].split("_").join(" ").toUpperCase() 
                            : "AsAmBal"}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/perfil");
                        }}
                        className="w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-gray-800"
                        >
                        Mi perfil
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-red-900/20"
                        >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          )}
        </div>

        {/* Segunda fila */}
        {isAuthenticated && !isLogin && (
          <div className="flex items-center justify-between py-2">
            {/*Volver*/}
            {isAppView && !isDashboard && (
              <div
                className="inline-flex items-center gap-2 px-3 py-1 text-sm text-gray-400 transition-all border rounded-md cursor-pointer border-gray-500/40 hover:text-white hover:bg-gray-500/10"
                onClick={() => navigate(-1)}
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="font-medium">Volver</span>
              </div>
            )}

            {/* Dashboard */}
            {showDashboardButton && (
              <button
                className="px-3 py-1 ml-auto text-sm text-green-400 transition-all border rounded-md border-green-500/40 hover:bg-green-500/10 hover:text-green-200"
                onClick={() => navigate("/dashboard")}
              >
                <span className="font-medium">Ir al Dashboard</span>
              </button>
            )}            
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;