import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useAuth } from "../../Auth/AuthContext";

function CreatePlayerClub() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const clubId = localStorage.getItem("activeClubId")

const token = localStorage.getItem("token");
console.log("TOKEN ACTUAL:", token);
if (!token) {
  console.error("No hay token en localStorage");
  return;
}

try {
  const payload = JSON.parse(atob(token.split(".")[1]));
  console.log("Payload del JWT:", payload);
} catch(e) {
  console.error("Token inválido", e);
}

console.log(clubId)

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    genero: "",
    email: "",
    clubId: clubId,
    categorias: [],
  });

  // --- Traer clubes del profesor ---
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await api.get("/categories");
        const categoriasData = res.data;

        setCategorias(categoriasData);
      } catch (err) {
        console.error("Error al traer categorias:", err);
      }
    };

    fetchCategorias();
  }, []);

  // --- Manejo de cambios en inputs ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => {
      if (name === "clubId") {
        const selectCategoria = setCategorias.find(c => c.clubId === value);
        setCategorias(selectCategoria?.categorias || []);
        return {
          ...prev,
          clubId: value,
          categorias: selectCategoria?.categorias || []
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const toggleCategoria = (categorias) => {
    setForm(prev => ({
      ...prev,
      categorias: prev.categorias.includes(categorias)
        ? prev.categorias.filter(c => c !== categorias)
        : [...prev.categorias, categorias],
    }));
  };

  // --- Envío del formulario ---
const handleSubmit = async (e) => {
  e.preventDefault();
  if (isSubmitting) return;

  if (form.categorias.length === 0) {
    setMessage("❌ Debe seleccionar al menos una categoría");
    return;
  }

  setIsSubmitting(true);
  setMessage("");

  try {
    // La API ya incluye el token y X-club-id gracias al interceptor
    const res = await api.post("/clubs/create-player", form);

    const { code, message: msg } = res.data || {};

    switch (code) {
      case "JUGADOR_CREADO":
        await Swal.fire({
          icon: "success",
          title: "Jugador creado",
          text: msg,
          confirmButtonText: "Aceptar",
          background: "#0f172a",
          color: "#e5e7eb",
          confirmButtonColor: "#16a34a",
        });
        setForm({ nombre: "", apellido: "", email: "", genero: "", categorias: [] });
        navigate("/clubs/players");
        break;

      case "SOLICITUD_PENDIENTE":
        {
          const confirm = await Swal.fire({
            icon: "question",
            title: "Jugador en otro club",
            text: msg,
            showCancelButton: true,
            confirmButtonText: "Aceptar solicitud de pase",
            cancelButtonText: "Cancelar",
          });

          if (confirm.isConfirmed) {
            Swal.fire("Solicitud enviada al club de origen", "", "success");
            navigate("/clubs/players");
          }
        }
        break;

      case "YA_EXISTE_EN_CLUB":
        await Swal.fire({
          icon: "warning",
          title: "Jugador ya existe en este club",
          text: msg,
          confirmButtonText: "Aceptar",
        });
        break;

      default:
        setMessage(msg || "Ocurrió un error desconocido");
        break;
    }

  } catch (err) {
    console.error(err);
    setMessage(`❌ ${err.response?.data?.message || "Error al crear el jugador"}`);
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
        className="w-full max-w-md p-6 bg-transparent border border-gray-500 shadow-xl backdrop-blur rounded-2xl"
      >
        <h2 className="mb-1 text-2xl font-bold text-gray-200">Crear jugador</h2>
        <p className="mb-6 text-sm text-gray-300">Registrá un nuevo jugador para tu club</p>

        {message && (
          <div className="px-4 py-2 mb-4 text-sm font-medium text-white rounded-md bg-red-700/30">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[{ name: "nombre", label: "Nombre", placeholder: "Nombre" },
            { name: "apellido", label: "Apellido", placeholder: "Apellido" },
            { name: "genero", label: "Género", placeholder: "Género", type: "text" },
            { name: "email", label: "Email", placeholder: "Email", type: "email" },
          ].map(({ name, label, placeholder, type }) => (
            <div key={name} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-300">{label}</label>
              <input
                required
                type={type || "text"}
                name={name}
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
                className="px-3 py-2 text-gray-200 placeholder-gray-500 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
          ))}

          {/* CATEGORÍAS */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Categorías</label>
            <div className="flex flex-wrap gap-2">
              {categorias.map((cat) => {
                const active = form.categorias.includes(cat.id);

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategoria(cat.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition w-48
                      ${active ? "bg-green-600/80 border-green-500 text-white" : "border-gray-500 text-gray-300 hover:bg-gray-700/50"}`}
                  >
                    {cat.nombre} {cat.genero}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              disabled={isSubmitting}
              type="submit"
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                isSubmitting
                  ? "border border-green-500/80 bg-green-700/80 rounded-md cursor-not-allowed"
                  : "text-gray-200 border border-green-500/80 bg-green-700/80 rounded-md hover:bg-green-600/80 hover:text-white hover:border-green-600/80"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                  Creando...
                </span>
              ) : "Crear"}
            </button>

            <button
              disabled={isSubmitting}
              type="button"
              onClick={() => navigate("/players")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
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

export default CreatePlayerClub;
