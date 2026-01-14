import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

function CoachCreate() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    categoria: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      await api.post(`/coaches`, form);

      Swal.fire({
        icon: "success",
        title: "Profesor creado",
        text: "El profesor fue registrado exitosamente. Se envió un mail al profesor para que complete su registro.",
        confirmButtonText: "Aceptar",
        background: "#0f172a",
        color: "#e5e7eb",
        confirmButtonColor: "#16a34a",
      });

      setForm({
        nombre: "",
        apellido: "",
        email: "",
        categoria: "",
      });
    } catch (err) {
      console.error(err);
      setMessage(
        `❌ ${err.response?.data?.message || "Error al crear el profesor"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[80vh] px-4 bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-md p-6 border border-gray-500 shadow-xl bg-transparent backdrop-blur rounded-2xl"
      >
        <h2 className="mb-1 text-2xl font-bold text-gray-200">
          Crear profesor
        </h2>
        <p className="mb-6 text-sm text-gray-300">
          Registrá un nuevo profesor para el club
        </p>

        {message && (
          <div className="mb-4 rounded-md px-4 py-2 text-sm font-medium bg-red-700/30 text-white">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { name: "nombre", label: "Nombre", placeholder: "Nombre" },
            { name: "apellido", label: "Apellido", placeholder: "Apellido" },
            { name: "email", label: "Email", placeholder: "Email", type: "email" },
            { name: "categoria", label: "Categoría", placeholder: "Categoría" },
          ].map(({ name, label, placeholder, type }) => (
            <div key={name} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-300">
                {label}
              </label>
              <input
                required
                type={type || "text"}
                name={name}
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
                className="px-3 py-2 text-gray-200 border border-gray-500 placeholder-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
          ))}

          <div className="flex gap-3 mt-4">
            <button
              disabled={isSubmitting}
              type="submit"
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors 
              ${
                isSubmitting
                  ? "border border-green-500/80 bg-green-700/80 rounded-md cursor-not-allowed"
                  : "text-gray-200 border border-green-500/80 bg-green-700/80 rounded-md hover:bg-green-600/80 hover:text-white hover:border-green-600/80"
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
              type="button"
              onClick={() => navigate("/coaches")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors 
              ${
                isSubmitting
                  ? "border border-gray-500/40 text-gray-500 cursor-not-allowed"
                  : "text-gray-300 border border-gray-500/80 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-600/80"
              }`}
            >
              Cancelar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default CoachCreate;

