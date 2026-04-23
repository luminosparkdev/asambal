import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import api from "../../Api/Api";
import {useAuth} from "../../Auth/AuthContext"
import Swal from "sweetalert2"; // ✅ FALTABA

export default function CuotaDetalle() {
  const { id } = useParams();

  const [cuota, setCuota] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProrroga, setLoadingProrroga] = useState(null); // 🔥 por jugador
  const [filtroEstado, setFiltroEstado] = useState("TODOS");

  const { activeClubId } = useAuth();

  useEffect(() => {
    if (!activeClubId) return;
    fetchDetalle();
  }, [id, activeClubId]);

  const fetchDetalle = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/cuotas/${id}`,{
        params: { clubId: activeClubId }
      })
      ;
      setCuota(res.data.cuota);

      const jugadores = res.data.jugadores.map((j) => ({
        ...j,
        fechaVencimiento: j.fechaVencimiento
        ? new Date(j.fechaVencimiento._seconds * 1000)
        : null,
      }));
      setJugadores(res.data.jugadores);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProrroga = async (jugadorId) => {
    const { value: fecha } = await Swal.fire({
      title: "Nueva fecha de vencimiento",
      input: "datetime-local",
      inputLabel: "Seleccioná la nueva fecha",
      showCancelButton: true,
      confirmButtonText: "Aplicar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) return "Tenés que elegir una fecha 😅";
      },
      background: "#0f172a",
      color: "#e5e7eb",
    });

    if (!fecha) return;

    try {
      setLoadingProrroga(jugadorId);

      await api.patch(`/cuotas/prorroga/${cuota.id}/${jugadorId}`, {
  nuevaFecha: fecha,
  clubId: activeClubId,
});

      await Swal.fire({
        icon: "success",
        title: "Prórroga aplicada",
        confirmButtonColor: "#16a34a",
        background: "#0f172a",
        color: "#e5e7eb",
      });

      // 🔥 UPDATE LOCAL (sin refetch completo)
      setJugadores((prev) =>
        prev.map((j) =>
          j.id === jugadorId
            ? { ...j, estado: "ADEUDADO", fechaVencimiento: fecha }
            : j
        )
      );

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo aplicar la prórroga", "error");
    } finally {
      setLoadingProrroga(null);
    }
  };

  // 🧠 helpers
  const formatPeriodo = (mes, anio) => {
    const meses = [
      "Enero","Febrero","Marzo","Abril",
      "Mayo","Junio","Julio","Agosto",
      "Septiembre","Octubre","Noviembre","Diciembre"
    ];
    return `${meses[mes - 1]} ${anio}`;
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "PAGADO":
        return "text-green-400";
      case "PENDIENTE":
        return "text-yellow-400";
      case "ADEUDADO":
        return "text-red-400";
      case "VENCIDO":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const jugadoresFiltrados =
    filtroEstado === "TODOS"
      ? jugadores
      : jugadores.filter((j) => j.estado === filtroEstado);

  // 📊 stats
  const stats = {
    total: jugadores.length,
    pagados: jugadores.filter((j) => j.estado === "PAGADO").length,
    pendientes: jugadores.filter((j) => j.estado === "PENDIENTE").length,
    adeudados: jugadores.filter((j) => j.estado === "ADEUDADO").length,
    vencidos: jugadores.filter((j) => j.estado === "VENCIDO").length,
  };

  return (
    <div className="min-h-screen bg-[url('/src/Assets/Asambal/fondodashboard.webp')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 max-w-6xl px-4 py-8 mx-auto">

        {/* HEADER */}
        {cuota && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">
              {formatPeriodo(cuota.mes, cuota.anio)}
            </h1>

            <p className="text-sm text-gray-300">
              {cuota.categoriasDetalle
                ?.map((c) => `${c.nombre}`)
                .join(" • ")}
            </p>
          </div>
        )}

        {/* 📊 STATS */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-5">
          
          <CardStat
            label="Total"
            value={stats.total}
            active={filtroEstado === "TODOS"}
            onClick={() => setFiltroEstado("TODOS")}
          />

          <CardStat
            label="Pagados"
            value={stats.pagados}
            color="green"
            active={filtroEstado === "PAGADO"}
            onClick={() => setFiltroEstado("PAGADO")}
          />

          <CardStat
            label="Pendientes"
            value={stats.pendientes}
            color="yellow"
            active={filtroEstado === "PENDIENTE"}
            onClick={() => setFiltroEstado("PENDIENTE")}
          />

          <CardStat
            label="Adeudados"
            value={stats.adeudados}
            color="red"
            active={filtroEstado === "ADEUDADO"}
            onClick={() => setFiltroEstado("ADEUDADO")}
          />

          <CardStat
            label="Vencidos"
            value={stats.vencidos}
            color="lightred"
            active={filtroEstado === "VENCIDO"}
            onClick={() => setFiltroEstado("VENCIDO")}
          />
        </div>

        {/* 📋 TABLA */}
        <div className="overflow-x-auto border border-gray-700 rounded-xl bg-black/40 backdrop-blur">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase border-b border-gray-700">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Apellido</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {jugadoresFiltrados.map((j) => (
                <motion.tr
                  key={j.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-800 hover:bg-white/5"
                >
                  <td className="p-3">{j.nombre}</td>
                  <td className="p-3">{j.apellido}</td>
                  <td className="p-3">{j.categoriaNombre}</td>
                  <td className="p-3">{j.telefono || "-"}</td>

                  <td className={`p-3 font-medium ${getEstadoColor(j.estado)}`}>
                    {j.estado}
                  </td>

                  <td className="p-3 text-right">
                    {j.estado === "VENCIDO" && (
                      <button
                        onClick={() => handleProrroga(j.id)}
                        disabled={loadingProrroga === j.id}
                        className="px-3 py-1 text-xs text-white bg-yellow-600 rounded hover:bg-yellow-700 disabled:opacity-50"
                      >
                        {loadingProrroga === j.id
                          ? "..."
                          : "Prórroga"}
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}

              {!loading && jugadoresFiltrados.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-5 text-center text-gray-400">
                    No hay resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CardStat({ label, value, onClick, color = "gray", active }) {
  const colors = {
    gray: "bg-white/10 text-white",
    green: "bg-green-900/30 text-green-400",
    yellow: "bg-yellow-900/30 text-yellow-400",
    red: "bg-red-900/30 text-red-400",
    lightred: "bg-red-500/30 text-red-200"
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl cursor-pointer transition border ${
        active ? "border-white" : "border-transparent"
      } ${colors[color]} hover:scale-[1.02]`}
    >
      <p className="text-xs">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}