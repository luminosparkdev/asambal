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
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/api/auth/activate-account", {
        email,
        password,
        token,
      });

      setRole(res.data.role);
      setUserId(res.data.userId);
      setStep("PROFILE");

    } catch (err) {
      setError(err.response?.data?.message || "Error al activar la cuenta");
    }
  };

  if (!email || !token) {
    return <p>Link inválido</p>;
  }

  return (
    <div>
      <h1>Activación de cuenta</h1>
      {step === "PASSWORD" && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input type="email" value={email} readOnly />
          </div>
          <div>
            <label>Nueva contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </form>
      )}

      {step === "PROFILE" && role === "admin_club" && (
        <AdminClubProfileForm userId={userId} />
      )}

      {step === "PROFILE" && role === "profesor" && (
        <ProfesorProfileForm userId={userId} />
      )}

      {step === "PROFILE" && role === "jugador" && (
        <JugadorProfileForm userId={userId} />
      )}
    </div>
  );
}

export default ActivateAccount;
