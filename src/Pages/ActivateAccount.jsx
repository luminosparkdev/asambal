import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import AdminClubProfileForm from "../Components/Profiles/AdminClubProfileForm";
import ProfesorProfileForm from "../Components/Profiles/ProfesorProfileForm";
import JugadorProfileForm from "../Components/Profiles/JugadorProfileForm";

function ActivateAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep] = useState("PASSWORD");
  const [userId, setUserId] = useState(null);

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);

  if (!email || !token ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Link inválido o incompleto.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/activate-account",
        { email, password, token }
      );
      setRole(res.data.role);
      setUserId(res.data.userId);
      setStep("PROFILE");
      console.log(res.data);
      setSuccess(true);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Token inválido o expirado. Solicite un nuevo link de activación.");
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || "Faltan datos para activar la cuenta.");
      } else {
        setError("Error al activar la cuenta. Intente más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">
          Activación de cuenta
        </h2>

        {step === "PASSWORD" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="block w-full px-3 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full px-3 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-500">Cuenta activada correctamente!</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Activando..." : "Activar cuenta"}
            </button>
          </form>
        )}
        {step === "PROFILE" && role === "admin_club" && (<AdminClubProfileForm userId={userId} />)}
        {step === "PROFILE" && role === "profesor" && (<ProfesorProfileForm userId={userId} />)}
        {step === "PROFILE" && role === "jugador" && (<JugadorProfileForm userId={userId} />)}

      </div>
    </div>
  );
}

export default ActivateAccount;
