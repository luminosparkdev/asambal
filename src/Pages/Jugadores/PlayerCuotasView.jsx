import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../Api/Api";
import { useAuth } from "../../Auth/AuthContext";
import CuotaCard from "./CuotaCard";

export default function PlayerCuotasView() {
  const { user } = useAuth();

  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("USER:", user);
    if (user?.id) {
      fetchCuotas();
    }
  }, [ user]);

  const fetchCuotas = async () => {
    try {
      setLoading(true);

      const res = await api.get("/cuotas/me", {
        params: {
          jugadorId: user.id,
        },
      });

      setCuotas(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  return (
    <div className="relative min-h-screen bg-[url('/src/Assets/Asambal/fondodashboard.webp')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 max-w-6xl px-4 py-8 mx-auto">
        <h1 className="mb-6 text-2xl font-bold text-gray-200">
          Mis cuotas
        </h1>

        {loading ? (
          <p className="text-gray-300">Cargando cuotas…</p>
        ) : cuotas.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100/10 rounded-xl gap-4">
            <div className="text-6xl">💸</div>
            <p className="text-xl font-semibold text-center text-gray-200">
              No tenés cuotas registradas
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {cuotas.map((cuota) => (
              <CuotaCard key={cuota.id} cuota={cuota} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}