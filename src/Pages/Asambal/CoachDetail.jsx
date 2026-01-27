import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import Swal from "sweetalert2";

function CoachDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        // Traigo profe
        const res = await api.get(`/asambal/coaches/${id}`);
        const data = res.data;
        setCoach(data);

        setLoading(false);
      } catch (err) {
        navigate("/asambal/coaches");
      }
    };

    fetchCoach();
  }, [id, navigate]);

  if (loading) return <p>Cargando...</p>;
  if (!coach) return null;

  const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


  return (
    <div className="relative min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div
          className={`p-8 rounded-2xl border-l-4 shadow-xl backdrop-blur bg-black/30 ${
            coach.status === "ACTIVO" ? "border-green-500" : "border-red-500"
          }`}
        >
          {/* HEADER */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-200">
                {coach.nombre} {coach.apellido}
              </h2>
              <p className="text-sm text-gray-400">Datos del profesor · ASAMBAL</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                coach.status === "ACTIVO" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
              }`}
            >
              {coach.status}
            </span>
          </div>

          {/* BODY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
            {[
              { label: "Nombre", value: coach.nombre },
              { label: "Apellido", value: coach.apellido },
              { label: "DNI", value: coach.dni },
              { label: "Email", value: coach.email },
              { label: "Teléfono", value: coach.telefono },
              { label: "Domicilio", value: coach.domicilio },
              { label: "ENEHA", value: coach.enea },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-xs uppercase text-gray-400">{label}</span>
                <span className="text-sm">{value || "-"}</span>
              </div>
            ))}

            {/* CATEGORÍAS */}
            <div className="flex flex-col gap-4 md:col-span-2">
  <span className="text-xs uppercase text-gray-400">Categorías</span>

  {coach.clubs?.length > 0 ? (
    coach.clubs.map((club, idx) => (
      <div key={idx} className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-200">
          {club.nombre || "Club"}
        </h4>

        <div className="flex flex-wrap gap-2">
          {club.categorias?.length > 0 ? (
            club.categorias.map((cat, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs rounded-full
                           bg-blue-500/20 text-blue-300
                           border border-blue-500/30"
              >
                {cat}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400">
              Sin categorías asignadas
            </span>
          )}
        </div>
      </div>
    ))
  ) : (
    <span className="text-sm text-gray-400">Sin clubes asignados</span>
  )}
</div>
          </div>

          <div className="mt-6 text-sm text-gray-400 space-y-1">
            <p>Creado: {formatDate(coach.createdAt) || "-"}</p>
            <p>Última actualización: {formatDate(coach.updatedAt) || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoachDetails;
