import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { activateAccountService } from "../Services/auth.service";

function ActivateAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token"); // token único que viene en el link

  useEffect(() => {
    const userEmail = searchParams.get("email");
    if (userEmail) setEmail(userEmail);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await activateAccountService(email, password, token);
      setMessage("Cuenta activada con éxito. Ya podés iniciar sesión.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al activar la cuenta");
    }
  };

  return (
    <div>
      <h1>Activación de cuenta</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
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
        <button type="submit">Confirmar</button>
      </form>
    </div>
  );
}

export default ActivateAccount;
