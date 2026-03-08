import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

function CreatePlayerClub() {

  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categorias, setCategorias] = useState([]);

  const clubId = localStorage.getItem("activeClubId");

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    genero: "",
    email: "",
    clubId: clubId,
    categoriaPrincipal: "",
    categorias: [],
  });

  // TRAER CATEGORIAS
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await api.get("/categories");
        setCategorias(res.data);
      } catch (err) {
        console.error("Error al traer categorias:", err);
      }
    };

    fetchCategorias();
  }, []);

  // INPUTS
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // CATEGORIA PRINCIPAL
  const handleCategoriaPrincipal = (e) => {

    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      categoriaPrincipal: value,
      categorias: prev.categorias.filter((c) => c !== value),
    }));
  };

  // CATEGORIAS SECUNDARIAS
  const toggleCategoria = (categoriaId) => {

    if (categoriaId === form.categoriaPrincipal) return;

    setForm((prev) => ({
      ...prev,
      categorias: prev.categorias.includes(categoriaId)
        ? prev.categorias.filter((c) => c !== categoriaId)
        : [...prev.categorias, categoriaId],
    }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.categoriaPrincipal) {
      setMessage("❌ Debe seleccionar una categoría principal");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setMessage("");

    try {

      const payload = {
        ...form,
        categorias: [form.categoriaPrincipal, ...form.categorias],
      };

      const res = await api.post("/clubs/create-player", payload);

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

          setForm({
            nombre: "",
            apellido: "",
            genero: "",
            email: "",
            clubId: clubId,
            categoriaPrincipal: "",
            categorias: [],
          });

          navigate("/clubs/players");

          break;

        default:
          setMessage(msg || "Ocurrió un error");
      }

    } catch (err) {

      console.error(err);

      setMessage(
        `❌ ${err.response?.data?.message || "Error al crear el jugador"}`
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
        transition={{ duration: 0.3 }}
        className="w-full max-w-md p-6 bg-transparent border border-gray-500 shadow-xl backdrop-blur rounded-2xl"
      >

        <h2 className="mb-1 text-2xl font-bold text-gray-200">
          Crear jugador
        </h2>

        <p className="mb-6 text-sm text-gray-300">
          Registrá un nuevo jugador para tu club
        </p>

        {message && (
          <div className="px-4 py-2 mb-4 text-sm text-white rounded-md bg-red-700/30">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* INPUTS */}
          {[
            { name: "nombre", label: "Nombre" },
            { name: "apellido", label: "Apellido" },
            { name: "genero", label: "Género" },
            { name: "email", label: "Email", type: "email" },
          ].map(({ name, label, type }) => (

            <div key={name} className="flex flex-col gap-1">

              <label className="text-sm text-gray-300">{label}</label>

              <input
                required
                type={type || "text"}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="px-3 py-2 text-gray-200 border border-gray-500 rounded"
              />

            </div>

          ))}

          {/* CATEGORIA PRINCIPAL */}
          <div className="flex flex-col gap-1">

            <label className="text-sm text-gray-300">
              Categoría Principal ⭐
            </label>

            <select
              value={form.categoriaPrincipal}
              onChange={handleCategoriaPrincipal}
              className="px-3 py-2 text-gray-200 bg-gray-800 border border-gray-500 rounded"
            >

              <option value="">
                Seleccionar categoría
              </option>

              {categorias.map((cat) => (

                <option
                  key={cat.id}
                  value={cat.id}
                >
                  {cat.nombre} {cat.genero}
                </option>

              ))}

            </select>

          </div>

          {/* CATEGORIAS SECUNDARIAS */}
          <div className="flex flex-col gap-2">

            <label className="text-sm text-gray-300">
              Categorías Secundarias
            </label>

            <div className="flex flex-wrap gap-2">

              {categorias.map((cat) => {

                const active = form.categorias.includes(cat.id);
                const isPrincipal = String(form.categoriaPrincipal) === String(cat.id);

                return (

                  <button
                    key={cat.id}
                    type="button"
                    disabled={isPrincipal}
                    onClick={() => toggleCategoria(cat.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition w-48
                    ${
                      isPrincipal
                        ? "bg-gray-600 border-gray-600 text-gray-400 cursor-not-allowed"
                        : active
                        ? "bg-green-600 border-green-500 text-white"
                        : "border-gray-500 text-gray-300 hover:bg-gray-700"
                    }`}
                  >

                    {isPrincipal ? "⭐ " : ""}
                    {cat.nombre} {cat.genero}

                  </button>

                );

              })}

            </div>

          </div>

          {/* BOTONES */}
          <div className="flex gap-3 mt-4">

            <button
              disabled={isSubmitting}
              type="submit"
              className="flex-1 px-4 py-2 text-gray-200 bg-green-700 border border-green-500 rounded"
            >
              {isSubmitting ? "Creando..." : "Crear"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/players")}
              className="flex-1 px-4 py-2 text-gray-300 border border-gray-500 rounded"
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