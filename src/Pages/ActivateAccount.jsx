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
  const [role, setRole] = useState(null);
  const [clubId, setClubId] = useState(null);


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

      localStorage.setItem("token", res.data.token);

      setRole(res.data.role);
      setUserId(res.data.userId);
      setClubId(res.data.clubId);
      
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
      className="relative min-h-screen flex items-center justify-center p-4 bg-cover bg-top"
      style={{ backgroundImage: "url('/src/assets/fondoactivacion.webp')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />

      {/* Card */}
      <div
        className="
          relative z-10
          w-full max-w-md
          p-8
          bg-slate-900/70 backdrop-blur-md
          border border-cyan-400/20
          rounded-xl shadow-2xl
          text-slate-100
        "
      >

        {step === "PASSWORD" && (
          <>
          <h2 className="mb-2 text-2xl font-semibold text-center tracking-wide">
              Activación de cuenta
          </h2>

          <p className="mb-6 text-center text-sm text-slate-400">
              Estás a un paso de completar tu registro
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="block w-full px-3 py-2
                    bg-slate-800/70
                    border border-slate-700
                    rounded-md
                    text-slate-400
                    cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-slate-300">Nueva contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full px-3 py-2
                    bg-slate-800
                    border border-slate-700
                    rounded-md
                    text-slate-100
                    placeholder-slate-400
                    focus:outline-none
                    focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            {success && <p className="text-sm text-green-400 text-center">Cuenta activada correctamente!</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 px-4 py-2 font-medium rounded-md
                  bg-gradient-to-r from-cyan-500 to-blue-600
                  hover:from-cyan-400 hover:to-blue-500
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed"
            >
              {loading ? "Activando..." : "Activar cuenta"}
            </button>
          </form>
          </>
        )}
        {step === "PROFILE" && role === "admin_club" && (<AdminClubProfileForm userId={userId} clubId={clubId} />)}
        {step === "PROFILE" && role === "profesor" && (<ProfesorProfileForm userId={userId} />)}
        {step === "PROFILE" && role === "jugador" && (<JugadorProfileForm userId={userId} />)}

      </div>
    </div>
  );
}

export default ActivateAccount;
