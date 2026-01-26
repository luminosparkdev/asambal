import { useEffect, useState } from "react";
import api from "../../Api/Api";
import { motion } from "framer-motion";
// import { useAuth } from "../../context/AuthContext"; // si lo usás

function PendingPlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState("");

  // 👉 Ejemplo: traés los clubes del profe
  useEffect(() => {
    const fetchClubs = async () => {
      const res = await api.get("/coaches/my-clubs");
      setClubs(res.data); 
      // [{ clubId, nombre }]
    };

    fetchClubs();
  }, []);

  const fetchPending = async (clubId) => {
    setLoading(true);
    try {
      const res = await api.get(
        `/coaches/pending-players/${clubId}`
      );
      setPlayers(res.data);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 SOLO cuando hay club seleccionado
  useEffect(() => {
    if (!selectedClub) return;
    fetchPending(selectedClub);
  }, [selectedClub]);

  const handleAction = async (playerId, action) => {
    await api.patch(`/players/${playerId}/validate-player`, {
      action,
      clubId: selectedClub,
    });
    fetchPending(selectedClub);
  };

  return (
    <div className="relative min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 max-w-6xl px-4 py-8 mx-auto">
        <h1 className="mb-4 text-2xl font-bold text-gray-200">
          Jugadores pendientes
        </h1>

        {/* 🔽 SELECT DE CLUBES */}
        <div className="max-w-sm mb-6">
          <select
            value={selectedClub}
            onChange={(e) => setSelectedClub(e.target.value)}
            className="w-full px-4 py-2 text-gray-800 bg-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar club</option>
            {clubs.map((club) => (
              <option key={club.clubId} value={club.clubId}>
                {club.nombre}
              </option>
            ))}
          </select>
        </div>

        {!selectedClub ? (
          <p className="text-gray-300">
            Seleccioná un club para ver las solicitudes pendientes
          </p>
        ) : loading ? (
          <p className="text-gray-300">Cargando solicitudes…</p>
        ) : players.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100/10 rounded-xl gap-4">
            <div className="text-6xl">✅</div>
            <p className="text-xl font-semibold text-center text-gray-200">
              No hay solicitudes pendientes para este club
            </p>
          </div>
        ) : (
          <motion.div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {players.map((p) => (
              <motion.div
                key={p.id}
                className="p-6 border-l-4 border-blue-400 shadow-lg bg-white/80 rounded-2xl"
              >
                <p><b>Nombre:</b> {p.nombre}</p>
                <p><b>Apellido:</b> {p.apellido}</p>
                <p><b>Email:</b> {p.email}</p>
                <p><b>Categorías:</b> {p.categorias.join(", ")}</p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleAction(p.id, "APPROVE")}
                    className="flex-1 px-3 py-2 text-white bg-green-600 rounded-lg"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleAction(p.id, "REJECT")}
                    className="flex-1 px-3 py-2 text-white bg-red-600 rounded-lg"
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

export default PendingPlayers;
