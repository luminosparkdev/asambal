import { Link, useNavigate} from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";

function Navbar() {
  const {isAuthenticated, user, logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Inicio</Link></li>

        {!isAuthenticated && (
          <li><Link to="/login">Login</Link></li>
        )}

        {isAuthenticated && (
          <>
            <li><Link to="/perfil">Perfil</Link></li>
            <li><button onClick={handleLogout}>Cerrar sesión</button></li>
          </>
        )}
      </ul>
      {isAuthenticated && <p>Bienvenido, {user.email}</p>}
    </nav>
  );
}

export default Navbar;
