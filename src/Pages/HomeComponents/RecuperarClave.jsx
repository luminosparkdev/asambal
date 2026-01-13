import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../Config/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";

const RecuperarClave = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email, {
        url: "http://localhost:5173/login", // Donde redirigir después del reset
        handleCodeInApp: false,
      });
      setSuccess("Si el correo existe, te hemos enviado un enlace para restablecer tu contraseña.");

      // Redirigir automáticamente después de 3 segundos
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error. Intenta nuevamente.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-6 bg-white rounded shadow">
        <h2 className="mb-4 text-xl font-semibold text-center">Recuperar contraseña</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-2 mb-3 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Enviar enlace
          </button>
        </form>

        {success && <p className="mt-3 text-sm text-center text-green-600">{success}</p>}
        {error && <p className="mt-3 text-sm text-center text-red-600">{error}</p>}

        <Link to="/login" className="block mt-4 text-sm text-center text-blue-700 hover:underline">
          Volver al login
        </Link>
      </div>
    </div>
  );
};

export default RecuperarClave;
