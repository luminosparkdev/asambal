import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../Api/Api";
import Swal from "sweetalert2";
import { useAuth } from "../../Auth/AuthContext";

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

function PendingPlayersClub() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });

  const fetchPending = async () => {
    setLoading(true);

    try {
      const res = await api.get("/clubs/pending-players");

      const formatted = res.data.map(p => ({
        ...p,
        categoria: p.categoria || "-",
      }));

      setPlayers(formatted);

    } catch (err) {
      console.error("Error fetching pending players:", err);
    } finally {
      setLoading(false);
    }
  };

  
  const { user } = useAuth();
  const currentClubId = user?.clubs?.[0]?.clubId;

  const handleAction = async (playerId, action) => {
    try {
      await api.patch(`/clubs/${playerId}/validate-player`, {
        action,
        clubId: currentClubId
      });

      toast.fire({
        icon: "success",
        title:
          action === "APPROVE"
            ? "Jugador aprobado correctamente"
            : "Jugador rechazado",
      });

      fetchPending();

    } catch (err) {
      console.error("Error validating player:", err);

      toast.fire({
        icon: "error",
        title: "Error al validar el jugador",
      });
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="relative min-h-screen bg-[url('../public/Assets/Asambal/fondodashboard.webp')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 max-w-6xl px-4 py-8 mx-auto">
        <h1 className="mb-6 text-2xl font-bold text-gray-200">
          Jugadores pendientes
        </h1>

        {loading ? (
          <p className="text-gray-300">Cargando solicitudes…</p>
        ) : players.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100/10 rounded-xl gap-4">
            <div className="text-6xl">⚽</div>
            <p className="text-xl font-semibold text-center text-gray-200">
              No hay solicitudes de jugadores pendientes
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {players.map(p => (
              <motion.div
                key={p.id}
                variants={cardVariants}
                className="p-6 transition-all duration-200 border-l-4 border-blue-400 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl hover:-translate-y-1 hover:shadow-2xl"
              >
                <p className="mb-1 text-sm text-gray-600">
                  <b>Email:</b> {p.email}
                </p>

                <p className="mb-1 text-sm text-gray-600">
                  <b>Nombre:</b> {p.nombre} {p.apellido}
                </p>

                <p className="mb-1 text-sm text-gray-600">
                  <b>Categoría:</b> {p.categoria}
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleAction(p.id, "APPROVE")}
                    className="flex-1 px-3 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                  >
                    Aprobar
                  </button>

                  <button
                    onClick={() => handleAction(p.id, "REJECT")}
                    className="flex-1 px-3 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                  >
                    Rechazar
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default PendingPlayersClub;