import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { activateAccountService } from "../Services/auth.service";
import axios from "axios";

function ActivateAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/api/auth/activate-account", {
        email,
        password,
        token,
      });
      
      setSuccess(true);

      setTimeout(() => navigate("/login"), 2000);
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
      {success ? (
        <p style={{ color: "green" }}>Cuenta activada con éxito. Registrando inicio de sesión</p>
      ) : (    
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

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Confirmar</button>
      </form>
      )}
    </div>
  );
}

export default ActivateAccount;
