import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../Api/Api";
import Swal from "sweetalert2";

function PlayerScholarshipHistory() {
  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id: playerId } = useParams();


  useEffect(() => {
  fetchBecas();
}, []);

const fetchBecas = async () => {
  try {
    setLoading(true);
    const res = await api.get(
      `/asambal/players/${playerId}/scholarships`
    );
    setBecas(res.data);
  } catch (error) {
    Swal.fire("Error", "No se pudo cargar el historial de becas", "error");
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <p className="mt-10 text-center text-gray-200">
        Cargando historial de becas...
      </p>
    );
  }

  const formatDate = (date) => {
    if (!date) return "-";
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString("es-AR");
    }
    return new Date(date).toLocaleDateString("es-AR");
  };

  return (
    <div className="min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
      <div className="px-4 mx-auto max-w-6xl">

        <div className="px-2 py-6">
          <h2 className="text-2xl font-semibold text-gray-200">
            Historial de
            <span className="text-yellow-600"> Becas</span>
          </h2>
        </div>

        {becas.length === 0 ? (
          <p className="text-gray-300">
            El jugador no registra becas.
          </p>
        ) : (
          <div className="overflow-x-auto shadow-xl rounded-2xl bg-white/90 backdrop-blur">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-800 text-gray-100">
                <tr>
                  <th className="px-4 py-3 text-center">Estado</th>
                  <th className="px-4 py-3 text-center">Club</th>
                  <th className="px-4 py-3 text-center">Categorías</th>
                  <th className="px-4 py-3 text-center">Otorgada</th>
                  <th className="px-4 py-3 text-center">Vencimiento</th>
                  <th className="px-4 py-3 text-center">Revocación</th>
                </tr>
              </thead>
              <tbody>
                {becas.map(beca => (
                  <tr key={beca.id} className="border-b last:border-none">
                    {/* Estado */}
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                          beca.estado === "ACTIVA"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {beca.estado}
                      </span>
                    </td>

                    {/* Club */}
                    <td className="px-4 py-2 text-center">
                      {beca.nombreClub || "—"}
                    </td>

                    {/* Categorías */}
                    <td className="px-4 py-2 text-center">
                      {(beca.categorias || []).length > 0
                        ? beca.categorias.join(", ")
                        : "—"}
                    </td>

                    {/* Fecha otorgamiento */}
                    <td className="px-4 py-2 text-center">
                      {formatDate(beca.fechaOtorgamiento)}
                    </td>

                    {/* Fecha vencimiento */}
                    <td className="px-4 py-2 text-center">
                      {formatDate(beca.fechaVencimiento)}
                    </td>

                    {/* Fecha revocación */}
                    <td className="px-4 py-2 text-center">
                      {beca.fechaRevocacion
                        ? formatDate(beca.fechaRevocacion)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerScholarshipHistory;
