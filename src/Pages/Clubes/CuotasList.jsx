import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../Api/Api";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CuotasList() {
  const { activeClubId } = useAuth();
  const navigate = useNavigate();

  const [cuotas, setCuotas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  const [filtros, setFiltros] = useState({
    mes: "",
    anio: "",
    categoria: "",
  });

  // 🔥 fetch categorias
  useEffect(() => {
    const fetchCategorias = async () => {
      const res = await api.get("/categories");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];
      setCategorias(data);
    };
    fetchCategorias();
  }, []);

  const fetchCuotas = async (reset = false) => {
    if (!activeClubId) return;

    try {
      setLoading(true);

      const params = {
        clubId: activeClubId,
        ...filtros,
        limit: 12,
        lastDoc: reset ? null : lastDoc,
      };

      const res = await api.get("/cuotas", { params });

      if (reset) {
        setCuotas(res.data.data);
      } else {
        setCuotas((prev) => [...prev, ...res.data.data]);
      }

      setLastDoc(res.data.lastDoc);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCuotas(true);
  }, [filtros]);

  // 🔥 RESUMEN
  const resumen = {
    total: cuotas.length,
    totalJugadores: cuotas.reduce((acc, c) => acc + (c.totalJugadores || 0), 0),
    totalPagados: cuotas.reduce((acc, c) => acc + (c.totalPagados || 0), 0),
    totalAdeudados: cuotas.reduce((acc, c) => acc + (c.totalAdeudados || 0), 0),
  };

  const formatPeriodo = (mes, anio) => {
    const meses = [
      "Enero","Febrero","Marzo","Abril",
      "Mayo","Junio","Julio","Agosto",
      "Septiembre","Octubre","Noviembre","Diciembre"
    ];
    return `${meses[mes - 1]} ${anio}`;
  };

  const getEstado = (fecha) => {
    if (!fecha) return { label: "Sin venc.", color: "text-green-400" };

    const hoy = new Date();
    const venc = new Date(fecha);

    if (venc < hoy) return { label: "Vencida", color: "text-red-400" };

    const diff = (venc - hoy) / (1000 * 60 * 60 * 24);
    if (diff <= 5) return { label: "Por vencer", color: "text-yellow-400" };

    return { label: "Activa", color: "text-green-400" };
  };

  return (
    <div className="select-none relative min-h-screen bg-[url('/src/Assets/Asambal/fondodashboard.webp')] bg-cover bg-center">
      
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 max-w-6xl px-4 py-8 mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-200">
            Cuotas
          </h1>

          <button
            onClick={() => navigate("/clubs/fees/create")}
            className="px-4 py-2 text-white transition bg-green-600 rounded-xl hover:bg-green-700"
          >
            + Crear cuota
          </button>
        </div>

        {/* 🔥 RESUMEN */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
          <div className="p-4 bg-white/10 backdrop-blur rounded-xl">
            <p className="text-xs text-gray-300">Cuotas</p>
            <p className="text-xl font-bold text-white">{resumen.total}</p>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur rounded-xl">
            <p className="text-xs text-gray-300">Jugadores</p>
            <p className="text-xl font-bold text-white">{resumen.totalJugadores}</p>
          </div>

          <div className="p-4 bg-green-900/30 rounded-xl">
            <p className="text-xs text-green-300">Pagados</p>
            <p className="text-xl font-bold text-green-400">{resumen.totalPagados}</p>
          </div>

          <div className="p-4 bg-red-900/30 rounded-xl">
            <p className="text-xs text-red-300">Adeudados</p>
            <p className="text-xl font-bold text-red-400">{resumen.totalAdeudados}</p>
          </div>
        </div>

        {/* FILTROS */}
        <div className="flex flex-wrap gap-3 mb-6">
          
          <select
            value={filtros.mes}
            onChange={(e) =>
              setFiltros({ ...filtros, mes: e.target.value })
            }
            className="px-3 py-2 text-gray-200 bg-gray-800 border border-gray-600 rounded-lg"
          >
            <option value="">Mes</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </select>

          <select
            value={filtros.anio}
            onChange={(e) =>
              setFiltros({ ...filtros, anio: e.target.value })
            }
            className="px-3 py-2 text-gray-200 bg-gray-800 border border-gray-600 rounded-lg"
          >
            <option value="">Año</option>
            {[2026, 2025, 2024].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>

          {/* 🔥 NUEVO FILTRO */}
          <select
            value={filtros.categoria}
            onChange={(e) =>
              setFiltros({ ...filtros, categoria: e.target.value })
            }
            className="px-3 py-2 text-gray-200 bg-gray-800 border border-gray-600 rounded-lg"
          >
            <option value="">Categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} {c.genero}
              </option>
            ))}
          </select>
        </div>

        {/* LISTADO */}
        <div className="grid gap-4">

          {cuotas.map((cuota) => {
            const estado = getEstado(cuota.fechaVencimiento);

            return (
              <motion.div
                key={cuota.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 border border-gray-700 rounded-xl bg-black/40 backdrop-blur"
              >
                {/* HEADER CARD */}
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-white">
                    {formatPeriodo(cuota.mes, cuota.anio)}
                  </h2>

                  <span className={`text-xs ${estado.color}`}>
                    {estado.label}
                  </span>
                </div>

                {/* categorias */}
                <p className="mb-3 text-sm text-gray-400">
                  {cuota.categoriasDetalle
                    ?.map((c) => `${c.nombre}`)
                    .join(" • ")}
                </p>

                {/* monto */}
                <div className="mb-3 text-xl font-bold text-green-400">
                  ${cuota.monto}
                </div>

                {/* stats estilo barra */}
                <div className="flex items-center gap-3 text-xs text-gray-300">
                  <span>👥 {cuota.totalJugadores}</span>
                  <span>•</span>
                  <span className="text-green-400">
                    {cuota.totalPagados} pagos
                  </span>
                  <span>•</span>
                  <span className="text-red-400">
                    {cuota.totalAdeudados} deuda
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/cuotas/${cuota.id}`)}
                  className="w-full px-3 py-2 mt-4 text-sm text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Ver detalle
                </button>
              </motion.div>
            );
          })}

        </div>

        {/* PAGINACION */}
        {lastDoc && (
          <div className="mt-8 text-center">
            <button
              onClick={() => fetchCuotas()}
              disabled={loading}
              className="px-5 py-2 text-gray-200 transition bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              {loading ? "Cargando..." : "Cargar más"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}