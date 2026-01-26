import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

function PlayerCreate() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allClubs, setAllClubs] = useState([]);
  const [clubCategorias, setClubCategorias] = useState([]); // categorías del club seleccionado

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    clubId: "",
    categorias: [],
  });

  // --- Traer clubes del profesor ---
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await api.get("/coaches/my-clubs"); 
        setAllClubs(res.data);
        console.log(res.data);

        if (res.data.length > 0) {
          const firstClub = res.data[0];
          setForm(prev => ({ 
            ...prev, 
            clubId: firstClub.clubId,
          }));
          setClubCategorias(firstClub.categorias || []);
        }
      } catch (err) {
        console.error("Error al traer clubes:", err);
      }
    };

    fetchClubs();
  }, []);

  // --- Manejo de cambios en inputs ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => {
      if (name === "clubId") {
        const selectedClub = allClubs.find(c => c.clubId === value);
        setClubCategorias(selectedClub?.categorias || []);
        return {
          ...prev,
          clubId: value,
          categorias: selectedClub?.categorias || []
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const toggleCategoria = (categoria) => {
    setForm(prev => ({
      ...prev,
      categorias: prev.categorias.includes(categoria)
        ? prev.categorias.filter(c => c !== categoria)
        : [...prev.categorias, categoria],
    }));
  };

  // --- Envío del formulario ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!form.clubId) {
      setMessage("❌ Debe seleccionar un club");
      return;
    }
    if (form.categorias.length === 0) {
      setMessage("❌ Debe seleccionar al menos una categoría");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await api.post("/players/create", form);

      // --- CASOS SEGÚN CÓDIGO DEL BACK ---
      if (res.data.code === "PROFESOR_EXISTENTE") {
        const confirm = await Swal.fire({
          icon: "question",
          title: "Profesor existente",
          text: res.data.message,
          showCancelButton: true,
          confirmButtonText: "Enviar solicitud",
          cancelButtonText: "Cancelar",
        });

        if (confirm.isConfirmed) {
          await api.post("/players/request-join", { email: form.email, clubId: form.clubId, categorias: form.categorias });
          Swal.fire("Solicitud enviada", "", "success");
          navigate("/players");
          return;
        } else {
          setIsSubmitting(false);
          return;
        }
      }

      if (res.data.code === "JUGADOR_EXISTENTE_OTRO_CLUB") {
        const confirm = await Swal.fire({
          icon: "question",
          title: "Jugador existente en otro club",
          text: res.data.message,
          showCancelButton: true,
          confirmButtonText: "Iniciar solicitud de pase",
          cancelButtonText: "Cancelar",
        });

        if (confirm.isConfirmed) {
          await api.post("/players/request-transfer", { email: form.email, clubId: form.clubId, categorias: form.categorias });
          Swal.fire("Solicitud enviada", "", "success");
          navigate("/players");
          return;
        } else {
          setIsSubmitting(false);
          return;
        }
      }

      if (res.data.code === "AGREGAR_CATEGORIAS") {
        const confirm = await Swal.fire({
          icon: "question",
          title: "Agregar categorías",
          text: res.data.message,
          showCancelButton: true,
          confirmButtonText: "Agregar",
          cancelButtonText: "Cancelar",
        });

        if (confirm.isConfirmed) {
          await api.post("/players/add-categories", { userId: res.data.userId, categorias: res.data.categorias, clubId: form.clubId });
          Swal.fire("Categorías agregadas", "", "success");
          navigate("/players");
          return;
        } else {
          setIsSubmitting(false);
          return;
        }
      }

      // --- CREACIÓN EXITOSA ---
      await Swal.fire({
        icon: "success",
        title: "Jugador creado",
        text: "El jugador fue registrado exitosamente. Se envió un mail para que complete su perfil.",
        confirmButtonText: "Aceptar",
        background: "#0f172a",
        color: "#e5e7eb",
        confirmButtonColor: "#16a34a",
      });

      setForm({ nombre: "", apellido: "", email: "", clubId: allClubs[0]?.clubId || "", categorias: [] });
      setClubCategorias(allClubs[0]?.categorias || []);
      navigate("/players");

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
        className="w-full max-w-md p-6 border border-gray-500 shadow-xl bg-transparent backdrop-blur rounded-2xl"
      >
        <h2 className="mb-1 text-2xl font-bold text-gray-200">Crear jugador</h2>
        <p className="mb-6 text-sm text-gray-300">Registrá un nuevo jugador para tu club</p>

        {message && (
          <div className="mb-4 rounded-md px-4 py-2 text-sm font-medium bg-red-700/30 text-white">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[{ name: "nombre", label: "Nombre", placeholder: "Nombre" },
            { name: "apellido", label: "Apellido", placeholder: "Apellido" },
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
                className="px-3 py-2 text-gray-200 border border-gray-500 placeholder-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
          ))}

          {/* CLUB */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Club</label>
            <select
              required
              name="clubId"
              value={form.clubId}
              onChange={handleChange}
              className="px-3 py-2 text-gray-200 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              {allClubs.map((c) => (
                <option key={c.clubId} value={c.clubId}>{c.nombreClub}</option>
              ))}
            </select>
          </div>

          {/* CATEGORÍAS */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Categorías</label>
            <div className="flex flex-wrap gap-2">
              {clubCategorias.map((cat) => {
                const active = form.categorias.includes(cat);

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategoria(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition w-48
                      ${active ? "bg-green-600/80 border-green-500 text-white" : "border-gray-500 text-gray-300 hover:bg-gray-700/50"}`}
                  >
                    {cat}
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
                  <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
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

export default PlayerCreate;
