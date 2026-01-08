import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import { loginService } from "../Services/auth.service";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const roleRedirectMap = {
    admin_asambal: "/admin",
    admin_club: "/admin-club",
    profesor: "/profesor",
    jugador: "/perfil",
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginService(email, password);

      login(data.user);

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      const redirectPath = roleRedirectMap[data.user.role] || "/perfil";
      navigate(redirectPath);

    } catch (error) {
      setError(error.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}

export default Login;

