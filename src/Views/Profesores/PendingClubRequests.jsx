import { useEffect, useState } from "react";
import api from "../../Api/Api";
import { motion } from "framer-motion";

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

function PendingClubRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    const res = await api.get("/coaches/my-requests");
    setRequests(res.data);
    setLoading(false);
  };

  const handleAction = async (requestId, action) => {
    await api.patch(
      `/coaches/requests/${requestId}/respond`,
      { action }
    );

    setRequests((prev) => prev.filter((r) => r.id !== requestId));
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
          Solicitudes de clubes
        </h1>

        {loading ? (
          <p className="text-gray-300">Cargando solicitudes…</p>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100/10 rounded-xl gap-4">
            <div className="text-6xl">🤝</div>
            <p className="text-xl font-semibold text-center text-gray-200">
              No tenés solicitudes de clubes pendientes
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {requests.map((r) => (
              <motion.div
                key={r.id}
                variants={cardVariants}
                className="p-6 transition-all duration-200 border-l-4 border-blue-400 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl hover:-translate-y-1 hover:shadow-2xl"
              >
                <p className="mb-2 text-lg font-semibold text-gray-800">
                  {r.nombreClub}
                </p>

                <p className="mb-4 text-sm text-gray-600">
                  <b>Categorías:</b>{" "}
                  {r.categorias?.length
                    ? r.categorias.join(", ")
                    : "—"}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(r.id, "ACCEPT")}
                    className="flex-1 px-3 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Aceptar
                  </button>

                  <button
                    onClick={() => handleAction(r.id, "REJECT")}
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

export default PendingClubRequests;
