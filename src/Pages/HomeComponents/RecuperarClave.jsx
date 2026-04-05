import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../Config/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";

const RecuperarClave = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setSuccess("");
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email, {
        url: "https://asambal.com/login",
        handleCodeInApp: false,
      });
      setSuccess(
        "Si el correo existe, te hemos enviado un enlace para restablecer tu contraseña."
      );

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 bg-cover bg-[67%_67%] bg-[url('/src/Assets/fondologin.webp')]">
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-md p-8 border shadow-xl bg-white/10 backdrop-blur-md rounded-2xl border-white/20">
        <h2 className="mb-6 text-3xl font-bold text-center text-white">
          Recuperar contraseña
        </h2>

        {success && (
          <p className="mb-4 text-sm text-center text-green-400">{success}</p>
        )}
        {error && (
          <p className="mb-4 text-sm text-center text-red-400">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setSuccess("");
              }}
              required
              placeholder="correo@ejemplo.com"
              className="w-full px-4 py-2 text-white placeholder-gray-300 border rounded-lg bg-white/10 border-white/20 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 mt-4 font-semibold text-white transition-all rounded-lg flex items-center justify-center gap-2
              ${
                loading
                  ? "bg-blue-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.01] hover:cursor-pointer"
              }`}
          >
            {loading ? (
              <svg
                className="w-4 h-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="white"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              "Enviar enlace"
            )}
          </button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-blue-300 hover:underline"
            >
              Volver al login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecuperarClave;