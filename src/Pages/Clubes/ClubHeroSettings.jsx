import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import api from "../../Api/Api";
import defaultHero from "../../assets/Hero.png";
import { useAuth } from "../../Auth/AuthContext";

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

function ClubHeroSettings() {
  const { activeClubId } = useAuth();
  const [currentHero, setCurrentHero] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (!activeClubId) return;

  const fetchClub = async () => {
    const res = await api.get(`/clubs/${activeClubId}`);
    setCurrentHero(res.data.heroUrl || null);
  };

  fetchClub();
}, [activeClubId]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.size > 500 * 1024) {
      Swal.fire("Archivo muy grande", "Máx 500kb", "warning");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
  if (!file || !activeClubId) return;

  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("hero", file);

    const res = await api.post(
      `/heroclubs/clubs/${activeClubId}/hero`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setCurrentHero(res.data.heroUrl);
    setPreview(null);
    setFile(null);

    Swal.fire("Listo", "Hero actualizado", "success");
  } catch (err) {
    Swal.fire("Error", "No se pudo subir el hero", "error");
  } finally {
    setLoading(false);
  }
};

if (loading) return <div>Cargando...</div>;

if (!activeClubId) {
  return (
    <div className="p-6 text-yellow-400">
      No hay club activo seleccionado
    </div>
  );
}

  return (
    <div className="relative min-h-screen p-8 bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="p-6 border-l-4 border-yellow-400 rounded-2xl shadow-xl bg-black/40 backdrop-blur"
        >
          <h2 className="mb-2 text-2xl font-bold text-gray-100">
            Hero del <span className="text-yellow-400">Club</span>
          </h2>
          <p className="mb-6 text-gray-300">
            Imagen principal del micrositio
          </p>

          {/* Preview */}
          <div className="mb-6 overflow-hidden rounded-xl">
            <img
              src={preview || currentHero || defaultHero}
              alt="Hero preview"
              className="object-contain w-full h-64 bg-transparent"
            />
          </div>

          {/* Input */}
          <input
            type="file"
            accept="image/webp,image/png,image/jpeg"
            onChange={handleFileChange}
            className="block w-full mb-4 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-800 file:text-gray-200 hover:file:bg-gray-700"
          />

          {/* Actions */}
          <div className="flex justify-end">
            <button
              disabled={!file || loading}
              onClick={handleUpload}
              className="px-6 py-2 font-medium text-gray-100 transition rounded-lg bg-yellow-500/80 hover:bg-yellow-500 disabled:opacity-50"
            >
              {loading ? "Subiendo..." : "Guardar cambios"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ClubHeroSettings;
