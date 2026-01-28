import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminClubProfileForm from "./Profiles/AdminClubProfileForm";
import ProfesorProfileForm from "./Profiles/ProfesorProfileForm";
import JugadorProfileForm from "./Profiles/JugadorProfileForm";
import api from "../Api/Api";

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
  const [roles, setRoles] = useState([]);
  const [clubId, setClubId] = useState(null);
  const [activationToken, setActivationToken] = useState(null);


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
      const res = await api.post(
        "/auth/activate-account",
        { email, password, token }
      );

      setRoles(res.data.roles);
      setUserId(res.data.userId);
      setClubId(res.data.clubId);
      setActivationToken(token);      
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
    <div
      className="relative flex items-center justify-center min-h-screen p-4 bg-top bg-cover"
      style={{ backgroundImage: "url('/src/assets/fondoactivacion.webp')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md p-8 border shadow-2xl  bg-slate-900/70 backdrop-blur-md border-cyan-400/20 rounded-xl text-slate-100"
      >

        {step === "PASSWORD" && (
          <>
          <h2 className="mb-2 text-2xl font-semibold tracking-wide text-center">
              Activación de cuenta
          </h2>

          <p className="mb-6 text-sm text-center text-slate-400">
              Estás a un paso de completar tu registro
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="block w-full px-3 py-2 border rounded-md cursor-not-allowed bg-slate-800/70 border-slate-700 text-slate-400"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-slate-300">Nueva contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full px-3 py-2 border rounded-md bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {error && <p className="text-sm text-center text-red-400">{error}</p>}
            {success && <p className="text-sm text-center text-green-400">Cuenta activada correctamente!</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 mt-4 font-medium transition rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Activando..." : "Activar cuenta"}
            </button>
          </form>
          </>
        )}
        {step === "PROFILE" && roles.includes("admin_club") && (<AdminClubProfileForm userId={userId} clubId={clubId} activationToken={activationToken} />)}
        {step === "PROFILE" && roles.includes("profesor") && (<ProfesorProfileForm userId={userId} activationToken={activationToken} />)}
        {step === "PROFILE" && roles.includes("jugador") && (<JugadorProfileForm userId={userId} activationToken={activationToken} />)}

      </div>
    </div>
  );
}

export default ActivateAccount;
