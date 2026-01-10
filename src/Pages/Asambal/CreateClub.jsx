import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api";

function CreateClub() {
  const navigate = useNavigate();
  const [clubName, setClubName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState(""); // Para mostrar feedback

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("❌ No estás autenticado. Por favor, logueate.");
      return;
    }

    try {
      const response = await axios.post(
        API_URL + "/clubs",
        {
          clubName,
          adminEmail,
          city,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("✅ Club creado correctamente!");
      setClubName("");
      setAdminEmail("");
      setCity("");
      console.log(response.data);
      // Opcional: redirigir al listado
      // navigate("/clubs");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        setMessage("❌ No autorizado. Revisa tu sesión.");
      } else {
        setMessage("❌ Error al crear el club.");
      }
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto mt-8 bg-white rounded-lg shadow">
      <h2 className="mb-4 text-2xl font-bold">Crear Club</h2>

      {message && (
        <p className="mb-4 text-sm font-medium text-red-500">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          required
          placeholder="Nombre del club"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          required
          type="email"
          placeholder="Email admin club"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          required
          placeholder="Ciudad"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="px-4 py-2 text-white transition bg-blue-700 rounded hover:bg-blue-800"
        >
          Crear
        </button>
      </form>
    </div>
  );
}

export default CreateClub;
