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

function PendingTransferRequest() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyTransfers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/players/transfers/player");
      setTransfers(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar tus solicitudes",
      });
    } finally {
      setLoading(false);
    }
  };

const handleAction = async (transferId, action) => {
  console.log("el transfer ID es:" +transferId);
  try {
    await api.patch(`/players/transfers/player/${transferId}/respond`, { action });

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: action === "ACCEPT" ? "success" : "info",
      title:
        action === "ACCEPT"
          ? "Aceptaste la transferencia"
          : "Rechazaste la transferencia",
      showConfirmButton: false,
      timer: 2000,
    });

    fetchMyTransfers();
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo procesar la acción",
    });
  }
};


  useEffect(() => {
    fetchMyTransfers();
  }, []);

  return (
    <div className="relative min-h-screen bg-[url('/src/assets/Player/fondodashboard.webp')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 max-w-5xl px-4 py-8 mx-auto">
        <h1 className="mb-6 text-2xl font-bold text-gray-200">
          Solicitudes de Transferencia
        </h1>

        {loading ? (
          <p className="text-gray-300">Cargando…</p>
        ) : transfers.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100/10 rounded-xl gap-4">
            <div className="text-6xl">⚽</div>
            <p className="text-xl font-semibold text-center text-gray-200">
              No tenés solicitudes pendientes
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2"
          >
            {transfers.map(t => (
              <motion.div
                key={t.id}
                variants={cardVariants}
                className="p-6 border-l-4 border-blue-500 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl"
              >
                <p className="mb-1 text-sm text-gray-700">
                  <b>Club destino:</b> {t.clubDestino?.nombreClub}

                </p>
                <p className="mb-1 text-sm text-gray-700">
                  <b>Categorías:</b> {t.categorias?.map(c => `${c.nombre} ${c.genero}`).join(", ") || "-"}
                </p>
                <p className="mb-4 text-sm text-gray-700">
                  ¿Querés aceptar esta transferencia?
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(t.id, "ACCEPT")}
                    className="flex-1 px-3 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => handleAction(t.id, "REJECT")}
                    className="flex-1 px-3 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
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

export default PendingTransferRequest;
