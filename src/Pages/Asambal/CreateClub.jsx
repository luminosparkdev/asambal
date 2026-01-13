import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

function CreateClub() {
  const navigate = useNavigate();
  const [clubName, setClubName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (isSubmitting) return;

  const token = localStorage.getItem("token");

  if (!token) {
    setMessage("❌ No estás autenticado. Por favor, logueate.");
    return;
  }

  setIsSubmitting(true);

  try {
    const response = await api.post(
      "/clubs",
      { clubName, adminEmail, city },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    Swal.fire({
      icon: "success",
      title: "Club creado",
      text: "Se envió un mail al administrador del club para que complete su registro.",
      confirmButtonText: "Aceptar",
      background: "#0f172a",
      color: "#e5e7eb",
      confirmButtonColor: "#16a34a",
    }).then(() => {
      navigate("/clubs/create");
    });
    setClubName("");
    setAdminEmail("");
    setCity("");
    console.log(response.data);
    // navigate("/clubs");
  } catch (error) {
    console.error(error);
    if (error.response) {
      setMessage(`❌ ${error.response.data.message || "Error al crear el club"}`);
    } else {
      setMessage("❌ Error de red o backend no disponible.");
    }
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className=" min-h-screen relative flex items-center justify-center min-h-[80vh] px-4 bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-md p-6 border border-gray-500 shadow-xl bg-transparent backdrop-blur rounded-2xl"
        >
        <h2 className="mb-1 text-2xl font-bold text-gray-200">Crear club</h2>
        <p className="mb-6 text-sm text-gray-300">
          Registrá un nuevo club y su administrador
        </p>

        {message && (
        <div
          className={`mb-4 rounded-md px-4 py-2 text-sm font-medium
            ${message.startsWith("✅")
              ? "bg-green-700/30 text-white"
              : "bg-red-700/30 text-white"
            }`}
        >
          {message}
        </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">
              Nombre del club
            </label>
            <input
              required
              placeholder="Nombre del club"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              className="px-3 py-2 text-gray-200 
              border border-gray-500 
              placeholder-gray-500 
              rounded 
              focus:outline-none 
              focus:ring-2 
              focus:ring-gray-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">
              Email admin club
            </label>
            <input
              required
              type="email"
              placeholder="Email admin club"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="px-3 py-2 text-gray-200 
              border border-gray-500 
              placeholder-gray-500 
              rounded 
              focus:outline-none 
              focus:ring-2 
              focus:ring-gray-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">
              Ciudad el club
            </label>

            <input
              required
              placeholder="Ciudad del club"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-3 py-2 text-gray-200 
              border border-gray-500 
              placeholder-gray-500 
              rounded 
              focus:outline-none 
              focus:ring-2 
              focus:ring-gray-400"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              disabled={isSubmitting}
              type="submit"
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors 
              ${
                isSubmitting
                ? "border border-green-500/80 bg-green-700/80 rounded-md cursor-not-allowed"
                : "text-gray-200 border border-green-500/80 bg-green-700/80 rounded-md hover:bg-green-600/80 hover:text-white hover:border-green-600/80 hover:cursor-pointer"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  Creando...
                </span>
              ) : (
                "Crear"
              )}
            </button>
            
            <button 
              disabled={isSubmitting}
              onClick={() => navigate("/clubs")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors 
              ${
                isSubmitting
                ? "border border-gray-500/40 text-gray-500 cursor-not-allowed"
                : "text-gray-300 border border-gray-500/80 rounded-md hover:bg-gray-100 hover:text-gray-700 hover:border-gray-600/80 hover:cursor-pointer"
              }`}
            >Cancelar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default CreateClub;
