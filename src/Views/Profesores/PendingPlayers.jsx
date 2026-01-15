import { useEffect, useState } from "react";
import api from "../../Api/Api";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

function PendingPlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    const res = await api.get("/players/pending-players");
    setPlayers(res.data);
    setLoading(false);
  };

  const handleAction = async (playerId, action) => {
    await api.patch(`/players/${playerId}/validate-player`, { action });
    setPlayers((prev) => prev.filter((p) => p.id !== playerId));
    fetchPending();
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="relative min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover bg-center">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* contenido */}
      <div className="relative z-10 max-w-6xl px-4 py-8 mx-auto">
        <h1 className="mb-6 text-2xl font-bold text-gray-200">
          Jugadores pendientes
        </h1>

        {loading ? (
          <p className="text-gray-300">Cargando solicitudes…</p>
        ) : players.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100/10 rounded-xl gap-4">
            <div className="text-6xl">✅</div>
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
            {players.map((p) => (
              <motion.div
                key={p.id}
                variants={cardVariants}
                className="p-6 transition-all duration-200 border-l-4 border-blue-400 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl hover:-translate-y-1 hover:shadow-2xl"
              >
                <p className="mb-1 text-sm text-gray-600">
                  <b>Nombre:</b> {p.nombre}
                </p>
                <p className="mb-1 text-sm text-gray-600">
                  <b>Apellido:</b> {p.apellido}
                </p>
                <p className="mb-1 text-sm text-gray-600">
                  <b>DNI:</b> {p.dni}
                </p>
                <p className="mb-1 text-sm text-gray-600">
                  <b>Fecha de nacimiento:</b> {p.fecha_nacimiento}
                </p>
                <p className="mb-1 text-sm text-gray-600">
                  <b>Edad:</b> {p.edad}
                </p>
                <p className="mb-1 text-sm text-gray-600">
                  <b>Email:</b> {p.email}
                </p>
                <p className="mb-1 text-sm text-gray-600">
                  <b>Teléfono:</b> {p.telefono}
                </p>
                <p className="mb-1 text-sm text-gray-600">
                  <b>Domicilio:</b> {p.domicilio}
                </p>
                
                <p className="mb-1 text-sm text-gray-600">
                  <b>Domicilio de cobro:</b> {p.domiciliocobro}
                </p>
                <p className="mb-1 text-sm text-gray-600">
                  <b>Horario de cobro:</b> {p.horariocobro}
                </p>
                <p className="mb-1 text-sm text-gray-600">
                  <b>Escuela:</b> {p.escuela}
                </p>
                <p className="mb-1 text-sm text-gray-600">
                  <b>Turno:</b> {p.turno}
                </p>
                <p className="mb-1 text-sm text-gray-600">
                  <b>Estatura:</b> {p.estatura}
                </p>
                <p className="mb-1 text-sm text-gray-600">
                  <b>Peso:</b> {p.peso}
                </p>
                <p className="mb-1 text-sm text-gray-600">
                  <b>Nivel:</b> {p.nivel}
                </p>
                <p className="mb-1 text-sm text-gray-600">
                  <b>Sexo:</b> {p.sexo}
                </p>
                <p className="mb-1 text-sm text-gray-600">
                  <b>Categoría:</b> {p.categoria}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(p.id, "APPROVE")}
                    className="flex-1 px-3 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Aprobar
                  </button>

                  <button
                    onClick={() => handleAction(p.id, "REJECT")}
                    className="flex-1 px-3 py-2 text-white transition bg-red-600 rounded-lg hover:bg-red-700"
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
