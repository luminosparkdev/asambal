import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import { loginService } from "../Services/auth.service";
import { Link } from "react-router-dom";

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
    jugador: "/jugador",
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginService(email, password);

      login(data.user);

      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);

      const userRoles = data.user.roles;

      const redirectPath = roleRedirectMap[userRoles[0]] || "/perfil";

      navigate(redirectPath);

    } catch (error) {
      setError(error.response?.data?.message || "Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen px-4 bg-cover bg-[67%_67%]"
      style={{ backgroundImage: "url('/src/assets/fondologin.webp')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md p-8 border shadow-xl bg-white/10 backdrop-blur-md rounded-2xl border-white/20">
        <h2 className="mb-6 text-3xl font-bold text-center text-white">
          Iniciar sesión
        </h2>

        {error && (
          <p className="mb-4 text-sm text-center text-red-400">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block mb-1 text-sm text-gray-200">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 text-white placeholder-gray-300 border rounded-lg bg-white/10 border-white/20 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="correo@ejemplo.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm text-gray-200">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 text-white placeholder-gray-300 border rounded-lg bg-white/10 border-white/20 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="••••••••"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 mt-4 font-semibold text-white transition-all rounded-lg bg-blue-600 hover:bg-blue-700 hover:scale-[1.01] hover:cursor-pointer"
          >
            Iniciar sesión
          </button>

          {/* Forgot */}
          <div className="text-center">
            <Link
              to="/recuperar-clave"
              className="text-sm text-blue-300 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

