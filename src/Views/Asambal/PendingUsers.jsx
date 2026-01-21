import { useEffect, useState } from "react";
import api from "../../Api/Api";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

function PendingUsers() {
  const [users, setUsers] = useState([]);

  const fetchPending = async () => {
    const res = await api.get("/asambal/pending-users");
    setUsers(res.data);
  };

  const handleAction = async (userId, action) => {
    try {
    await api.patch("/asambal/validate-user", { userId, action });

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: action === "APPROVE" ? 'success' : 'error',
      title: action === "APPROVE" ? 'Usuario aprobado' : 'Usuario rechazado',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    
    fetchPending();
    }catch(error){
      console.log(error);
      Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo completar la acción',
    });
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="relative min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-gray-200">Usuarios Pendientes</h1>

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[100vh] bg-gray-100/10 rounded-xl gap-4">
          <div className="text-6xl">✅</div>
          <p className="text-xl font-semibold text-center text-gray-200">
            ¡Estás al día! No hay solicitudes pendientes.
          </p>
        </div>

      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {users.map((u) => (
            <motion.div
              key={u.userId}
              variants={cardVariants}
              className="p-6 transition-all duration-200 border-l-4 border-yellow-400 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl hover:-translate-y-1 hover:shadow-2xl"
            >
              <p className="mb-1 text-sm text-gray-500"><b>Email:</b> {u.email}</p>
              <p className="mb-1 text-sm text-gray-500"><b>Club:</b> {u.club?.nombre || "–"}</p>
              <p className="mb-4 text-sm text-gray-500"><b>Ciudad:</b> {u.club?.ciudad || "–"}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(u.userId, "APPROVE")}
                  className="flex-1 px-3 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Aprobar
                </button>

                <button
                  onClick={() => handleAction(u.userId, "REJECT")}
                  className="flex-1 px-3 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
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

export default PendingUsers;
