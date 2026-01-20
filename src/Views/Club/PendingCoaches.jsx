import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../Api/Api";
import { useAuth } from "../../Auth/AuthContext";

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { opacity: 0, y: 20, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } } };

function PendingCoaches() {
  const { user } = useAuth();
  const currentClubId = user?.clubId;

  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPending = async () => {
    if (!currentClubId) return;
    setLoading(true);
    try {
      const res = await api.get("/coaches/pending-coaches");

      // filtramos por club actual y transformamos categorías para mostrar
      const filtered = res.data
        .map(c => {
          const clubData = c.clubs?.find(cl => cl.clubId === currentClubId);
          if (!clubData) return null;
          return {
            ...c,
            categoria: clubData.categorias.join(", "),
            clubId: clubData.clubId,
            clubName: clubData.nombreClub,
          };
        })
        .filter(Boolean);

      setCoaches(filtered);
    } catch (err) {
      console.error("Error fetching pending coaches:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (coachId, action) => {
    if (!currentClubId) return;
    try {
      await api.patch(`/coaches/${coachId}/validate-coach`, {
        action,
        clubId: currentClubId,
      });
      fetchPending(); // refrescar lista después de aprobar/rechazar
    } catch (err) {
      console.error("Error validating coach:", err);
    }
  };

  useEffect(() => { fetchPending(); }, [currentClubId]);

  return (
    <div className="relative min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 max-w-6xl px-4 py-8 mx-auto">
        <h1 className="mb-6 text-2xl font-bold text-gray-200">Profesores pendientes</h1>

        {loading ? (
          <p className="text-gray-300">Cargando solicitudes…</p>
        ) : coaches.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100/10 rounded-xl gap-4">
            <div className="text-6xl">✅</div>
            <p className="text-xl font-semibold text-center text-gray-200">No hay solicitudes de profesores pendientes</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {coaches.map(c => (
              <motion.div key={c.id} variants={cardVariants} className="p-6 transition-all duration-200 border-l-4 border-blue-400 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl hover:-translate-y-1 hover:shadow-2xl">
                <p className="mb-1 text-sm text-gray-600"><b>Email:</b> {c.email}</p>
                <p className="mb-1 text-sm text-gray-600"><b>Nombre:</b> {c.nombre}</p>
                <p className="mb-1 text-sm text-gray-600"><b>Categoría:</b> {c.categoria}</p>
                <p className="mb-4 text-sm text-gray-600"><b>Club:</b> {c.clubName}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleAction(c.id, "APPROVE")} className="flex-1 px-3 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition">Aprobar</button>
                  <button onClick={() => handleAction(c.id, "REJECT")} className="flex-1 px-3 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition">Rechazar</button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default PendingCoaches;
