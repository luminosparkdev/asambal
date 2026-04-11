import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import api from "../../Api/Api";
import { useAuth } from "../../Auth/AuthContext";

export default function CreateCuota() {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const [form, setForm] = useState({
    mes: currentMonth,
    anio: currentYear,
    categorias: [],
    monto: "",
    tieneVencimiento: false,
    fechaVencimiento: "",
  });

  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const fetchCategorias = async () => {
    try {
      const res = await api.get("/categories");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setCategoriasDisponibles(data);
    } catch (err) {
      console.error("Error trayendo categorías", err);
    }
  };

  fetchCategorias();
}, []);

  const toggleCategoria = (id) => {
    setForm((prev) => {
      const exists = prev.categorias.includes(id);
      return {
        ...prev,
        categorias: exists
          ? prev.categorias.filter((c) => c !== id)
          : [...prev.categorias, id],
      };
    });
  };

  const { activeClubId } = useAuth();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!activeClubId) {
    return Swal.fire("Error", "No hay club seleccionado", "error");
  }

  if (
    form.anio < currentYear ||
    (form.anio === currentYear && form.mes < currentMonth)
  ) {
    return Swal.fire("Error", "No podés crear cuotas para meses pasados", "error");
  }

  if (form.categorias.length === 0) {
    return Swal.fire("Error", "Seleccioná al menos una categoría", "error");
  }

  if (!form.monto || Number(form.monto) <= 0) {
    return Swal.fire("Error", "El monto debe ser mayor a 0", "error");
  }

  if (form.tieneVencimiento && !form.fechaVencimiento) {
    return Swal.fire("Error", "Seleccioná una fecha de vencimiento", "error");
  }

  const payload = {
    ...form,
    clubId: activeClubId, 
    monto: Number(form.monto),
    fechaVencimiento: form.tieneVencimiento
      ? new Date(form.fechaVencimiento)
      : null,

    categoriasDetalle: categoriasDisponibles
    .filter((cat) => form.categorias.includes(cat.id))
    .map((cat) => ({
      id: cat.id,
      nombre: cat.nombre,
      genero: cat.genero,
    })),
  };

  try {
    // 🔮 PREVIEW
    const previewRes = await api.post("/cuotas/crear", {
      ...payload,
      preview: true,
    });

    const { nuevos, duplicados, total, code } = previewRes.data;

    if (code === "SIN_JUGADORES") {
      return Swal.fire("Info", "No hay jugadores para esas categorías", "info");
    }

    if (nuevos === 0) {
      return Swal.fire(
        "Nada que hacer",
        "Todos los jugadores ya tienen cuota para este período",
        "info"
      );
    }

    // ⚠️ CONFIRM con data real
    const confirm = await Swal.fire({
      title: "¿Crear cuota?",
      html: `
        Se generarán <b>${nuevos}</b> cuotas nuevas<br/>
        Se omitirán <b>${duplicados}</b> duplicadas
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, crear",
      cancelButtonText: "Cancelar",
      background: "#0f172a",
      color: "#e5e7eb",
      confirmButtonColor: "#16a34a",
    });

    if (!confirm.isConfirmed) return;

    // 🚀 CREATE REAL
    setLoading(true);

    const res = await api.post("/cuotas/crear", payload);

    const { message } = res.data || {};

    await Swal.fire({
      icon: "success",
      title: "Cuota creada",
      text: message,
      confirmButtonText: "Aceptar",
      background: "#0f172a",
      color: "#e5e7eb",
      confirmButtonColor: "#16a34a",
    });

    // 🔄 reset
    setForm({
      mes: currentMonth,
      anio: currentYear,
      categorias: [],
      monto: "",
      tieneVencimiento: false,
      fechaVencimiento: "",
    });

  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Ocurrió un error al crear la cuota", "error");
  } finally {
    setLoading(false);
  }
};

  const setUltimoDiaMes = () => {
    const { mes, anio } = form;
    const lastDay = new Date(anio, mes, 0, 23, 59, 59);

    const pad = (n) => n.toString().padStart(2, "0");

    const localString = `${lastDay.getFullYear()}-${pad(
      lastDay.getMonth() + 1
    )}-${pad(lastDay.getDate())}T${pad(lastDay.getHours())}:${pad(
      lastDay.getMinutes()
    )}`;

    setForm((prev) => ({ ...prev, fechaVencimiento: localString }));
  };

  const getMesesDisponibles = () => {
    if (form.anio === currentYear) {
      return Array.from({ length: 12 - currentMonth + 1 }, (_, i) =>
        currentMonth + i
      );
    }
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  return (
    <div className="select-none relative flex items-center justify-center min-h-[80vh] px-4 bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl p-6 bg-transparent border border-gray-500 shadow-xl backdrop-blur rounded-2xl"
      >
        <h1 className="mb-1 text-2xl font-bold text-gray-200">Crear cuota</h1>
        <p className="mb-6 text-sm text-gray-300">Configurá una nueva cuota para tu club</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="flex gap-3">
            <select
              value={form.mes}
              disabled={loading}
              onChange={(e) => setForm({ ...form, mes: Number(e.target.value) })}
              className="w-full px-3 py-2 text-gray-200 bg-gray-800 border border-gray-500 rounded"
            >
              {getMesesDisponibles().map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <input
              type="number"
              min={currentYear}
              disabled={loading}
              value={form.anio}
              onChange={(e) => setForm({ ...form, anio: Number(e.target.value) })}
              className="w-full px-3 py-2 text-gray-200 bg-gray-800 border border-gray-500 rounded"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Categorías</label>
            <div className="flex flex-wrap gap-2">
              {categoriasDisponibles.map((cat) => {
                const active = form.categorias.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    disabled={loading}
                    onClick={() => toggleCategoria(cat.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition w-40
                      ${active
                        ? "bg-green-600 border-green-500 text-white"
                        : "border-gray-500 text-gray-300 hover:bg-gray-700"}`}
                  >
                    {cat.nombre} • {cat.genero}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Monto</label>
            <input
              type="number"
              disabled={loading}
              min="0"
              value={form.monto}
              onChange={(e) => setForm({ ...form, monto: e.target.value })}
              className="px-3 py-2 text-gray-200 bg-gray-800 border border-gray-500 rounded"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Vencimiento</label>

            <div className="flex gap-4 text-sm text-gray-300">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  disabled={loading}
                  checked={!form.tieneVencimiento}
                  onChange={() => setForm({ ...form, tieneVencimiento: false, fechaVencimiento: "" })}
                />
                Sin vencimiento
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  disabled={loading}
                  checked={form.tieneVencimiento}
                  onChange={() => setForm({ ...form, tieneVencimiento: true })}
                />
                Con vencimiento
              </label>
            </div>

            {form.tieneVencimiento && (
              <div className="flex gap-2">
                <input
                  type="datetime-local"
                  disabled={loading}
                  value={form.fechaVencimiento}
                  onChange={(e) => setForm({ ...form, fechaVencimiento: e.target.value })}
                  className="w-full px-3 py-2 text-gray-200 bg-gray-800 border border-gray-500 rounded"
                />

                <button
                  type="button"
                  disabled={loading}
                  onClick={setUltimoDiaMes}
                  className="px-3 py-2 text-gray-200 border border-gray-500 rounded hover:bg-gray-700"
                >
                  Último día
                </button>
              </div>
            )}
          </div>

          <div className="px-4 py-2 text-sm text-yellow-200 border border-yellow-500 rounded bg-yellow-900/20">
            Se generarán cuotas para todos los jugadores que coincidan con las categorías seleccionadas.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 text-gray-200 bg-green-700 border border-green-500 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "Creando..." : "Crear cuota"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
