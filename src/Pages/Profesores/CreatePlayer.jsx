import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

function CreatePlayerCoach() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [clubs, setClubs] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    genero: "",
    email: "",
    clubId: "",
    categoriaPrincipal: "",
    categorias: [],
  });

  // TRAER CLUBES DEL PROFESOR
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await api.get("/coaches/my-clubs");
        const clubsData = res.data || [];

        setClubs(clubsData);

        if (clubsData.length === 1) {
          setForm((prev) => ({
            ...prev,
            clubId: clubsData[0].clubId,
          }));
        }
      } catch (err) {
        console.error("Error al traer clubes:", err);
      }
    };

    fetchClubs();
  }, []);

  // CARGAR CATEGORIAS DEL CLUB SELECCIONADO
  useEffect(() => {
    if (!form.clubId) return;

    const clubSeleccionado = clubs.find(
      (club) => club.clubId === form.clubId
    );

    if (clubSeleccionado) {
      setCategorias(clubSeleccionado.categorias || []);
    }
  }, [form.clubId, clubs]);

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
  const toggleCategoria = (categoria) => {
    if (categoria === form.categoriaPrincipal) return;

    setForm((prev) => ({
      ...prev,
      categorias: prev.categorias.includes(categoria)
        ? prev.categorias.filter((c) => c !== categoria)
        : [...prev.categorias, categoria],
    }));
  };

  // FILTRAR CATEGORIAS POR GENERO
  const categoriasFiltradas = categorias.filter((cat) => {
  if (!form.genero) return false;
  return cat.genero === form.genero;
});

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

      const res = await api.post("/players/create", payload);

      const { code, message: msg } = res.data || {};

      if (code === "JUGADOR_CREADO") {
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
          clubId: form.clubId,
          categoriaPrincipal: "",
          categorias: [],
        });

        navigate("/players");
      } else {
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
    <div className="relative flex items-center justify-center min-h-[80vh] px-4 bg-[url('/src/Assets/Asambal/fondodashboard.webp')]">
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
          Registrá un nuevo jugador
        </p>

        {message && (
          <div className="px-4 py-2 mb-4 text-sm text-white rounded-md bg-red-700/30">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* SELECT CLUB */}
          {clubs.length > 1 && (
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300">Club</label>

              <select
                name="clubId"
                value={form.clubId}
                onChange={handleChange}
                className="px-3 py-2 text-gray-200 bg-gray-800 border border-gray-500 rounded"
              >
                <option value="">Seleccionar club</option>

                {clubs.map((club) => (
                  <option key={club.clubId} value={club.clubId}>
                    {club.nombreClub}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* INPUTS */}
          {[
            { name: "nombre", label: "Nombre" },
            { name: "apellido", label: "Apellido" },
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

          {/* GENERO */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Género</label>

            <select
              required
              name="genero"
              value={form.genero}
              onChange={handleChange}
              className="px-3 py-2 text-gray-200 bg-gray-800 border border-gray-500 rounded"
            >
              <option value="">Seleccionar género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>

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
              <option value="">Seleccionar categoría</option>

              {categoriasFiltradas.map((cat) => (
                <option key={cat.id} value={cat.id}>
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
              {categoriasFiltradas.map((cat) => {
                const active = form.categorias.includes(cat.id);
                const isPrincipal = form.categoriaPrincipal === cat.id;

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

export default CreatePlayerCoach;