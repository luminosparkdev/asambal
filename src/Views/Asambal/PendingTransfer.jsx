import { useEffect, useState } from "react";
import api from "../../Api/Api";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

function PendingTransfer() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);

const fetchPending = async () => {
  setLoading(true);
  try {
    const res = await api.get("/asambal/transfers");

    const transfersFormatted = res.data.map(t => ({
      ...t,
      clubOrigen: t.clubOrigen || { nombreClub: "-" },
      clubDestino: t.clubDestino || { nombreClub: "-" },
      categorias: t.categorias || []
    }));

    console.log("Transfers formatted:", transfersFormatted); // <-- aquí ves si es un objeto plano

    setTransfers(transfersFormatted);
  } catch (err) {
    console.error("Error fetching transfers:", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudieron cargar las transferencias",
    });
  } finally {
    setLoading(false);
  }
};


const handleAction = async (transferId, action) => {
  try {
    await api.patch(`/players/transfers/${transferId}/respond`, { action });

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: action === "ACCEPT" ? "success" : "error",
      title:
        action === "ACCEPT"
          ? "Transferencia aprobada"
          : "Transferencia rechazada",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });

    fetchPending();
  } catch (err) {
    console.error("Error responding transfer:", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo completar la acción",
    });
  }
};


  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="relative min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 max-w-6xl px-4 py-8 mx-auto">
        <h1 className="mb-6 text-2xl font-bold text-gray-200">Transferencias Pendientes</h1>

        {loading ? (
          <p className="text-gray-300">Cargando transferencias…</p>
        ) : transfers.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100/10 rounded-xl gap-4">
            <div className="text-6xl">✅</div>
            <p className="text-xl font-semibold text-center text-gray-200">No hay transferencias pendientes</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {transfers.map(t => (
              
              <motion.div key={t.id} variants={cardVariants} className="p-6 transition-all duration-200 border-l-4 border-purple-500 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl hover:-translate-y-1 hover:shadow-2xl">
                <p className="mb-1 text-sm text-gray-600"><b>Jugador:</b> {t.jugadorNombre || "-"}</p>
                <p className="mb-1 text-sm text-gray-600"><b>Club Origen:</b> {t.clubOrigen.nombreClub || "-"}</p>
                <p className="mb-1 text-sm text-gray-600"><b>Club Destino:</b> {t.clubDestino.nombreClub || "-"}</p>
                <p className="mb-4 text-sm text-gray-600"><b>Categorías:</b> {t.categorias?.map(c => `${c.nombre} ${c.genero}`).join(", ") || "-"}</p>

                <div className="flex gap-2">
                  <button onClick={() => handleAction(t.id, "ACCEPT")} className="flex-1 px-3 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700">Aprobar</button>
                  <button onClick={() => handleAction(t.id, "REJECT")} className="flex-1 px-3 py-2 text-white transition bg-red-600 rounded-lg hover:bg-red-700">Rechazar</button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default PendingTransfer;
