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
      localStorage.setItem("refreshToken", data.refreshToken);

      const redirectPath = roleRedirectMap[data.user.role] || "/perfil";
      navigate(redirectPath);

    } catch (error) {
      setError(error.response?.data?.message || "Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-300">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-xl">

        {/* Título (no h1 para SEO) */}
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-900">
          Iniciar sesión
        </h2>

        {/* Error */}
        {error && (
          <p className="mb-4 text-sm text-center text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 mt-4 font-semibold text-white transition-colors bg-blue-700 rounded-lg cursor-pointer hover:bg-blue-800"
          >
            Iniciar sesión
          </button>

                  <button
          type="button"
          className="w-full mt-2 text-sm text-blue-700 cursor-pointer hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

