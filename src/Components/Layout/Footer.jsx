import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import {
  MapPinIcon,
} from "@heroicons/react/24/outline";
import {
  FaInstagram,
  FaFacebook,
  FaXTwitter,
  FaYoutube,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa6";
import logo from "../../Assets/Asambal/logo.png";

function Footer() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const showFullFooter = isHome && !isAuthenticated;

  return (
    <footer className="bg-gradient-to-t from-[#0F1317] to-[#334353] text-gray-300 border-t border-[#334353] border-t-2 border-[#334353]">
      <div className="px-4 py-10 mx-auto max-w-7xl">

        {/* FOOTER COMPLETO (home sin sesión) */}
        {showFullFooter && (
          <div className="grid gap-10 mb-10 md:grid-cols-3">

            {/* Columna 1: Ubicación */}
            <div>
              <h4 className="mb-3 text-sm font-semibold tracking-wide text-white uppercase">Dónde estamos</h4>
              <div className="flex gap-2 text-sm">
                <MapPinIcon className="w-5 h-5 mt-1 text-blue-300" />
                <div>
                  <p>Asociación AsAmBal</p>
                  <p>Chivilcoy, Buenos Aires, Argentina</p>
                  <a
                    href="https://www.google.com/maps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 text-blue-300 hover:text-blue-200"
                  >
                    Ver en Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Columna 2: Institucional */}
            <div>
              <h4 className="mb-3 text-sm font-semibold tracking-wide text-white uppercase">Institucional</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#quienes-somos" className="hover:text-white">
                    Quiénes somos
                  </a>
                </li>
                <li>
                  <a href="#autoridades" className="hover:text-white">
                    Autoridades
                  </a>
                </li>
                <li>
                  <a href="#contacto" className="hover:text-white">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna 3: Redes */}
            <div>
              <h4 className="mb-3 text-sm font-semibold tracking-wide text-white uppercase">Seguinos</h4>
              <div className="flex items-center gap-4 text-xl">
                <a href="https://www.instagram.com/as.am.bal/?hl=es" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500"><FaInstagram /></a>
                <a href="https://web.facebook.com/asociacionamigosdelbalonmano/?locale=es_LA&_rdc=1&_rdr#" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500"><FaFacebook /></a>
                <a href="https://x.com/AsAmBal_" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500"><FaXTwitter /></a>
                <a href="https://www.youtube.com/@Asambal" target="_blank" rel="noopener noreferrer" className="hover:text-red-500"><FaYoutube /></a>
                <a href="https://wa.me/5492346573613" target="_blank" rel="noopener noreferrer" className="hover:text-green-500"><FaWhatsapp /></a>
                <a href="https://www.tiktok.com/@asambal" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400"><FaTiktok /></a>
              </div>
            </div>

          </div>
        )}

        {/* FOOTER BASE (siempre visible) */}
        <div className="flex flex-col items-center justify-between gap-4 pt-6 border-t border-gray-600 md:flex-row">

          {/* Copyright */}
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo de ASAMBAL"
              className="w-9 h-9 p-1 bg-white rounded-full"
            />
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} AsAmBal. Todos los derechos reservados.
            </p>
          </div>

          {/* Créditos */}
          <p className="text-sm text-gray-400">
            Desarrollado por{" "}
            <a
              className="font-medium text-blue-300 hover:text-blue-200"
              href="https://luminospark-dev.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lumino Spark
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
