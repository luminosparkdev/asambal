import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../Api/Api";

export default function AdministrarMembresia() {
  const { clubId, year } = useParams();
  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCuotas = async () => {
    try {
      const res = await api.get(`/asambal/membresias/${clubId}/${year}`);
      setCuotas(res.data);
    } catch (error) {
      console.error("Error cargando cuotas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCuotas();
  }, [clubId, year]);

  const acreditar = async (ticketId) => {
    try {
      await api.patch(`/asambal/membresias/ticket/${ticketId}/acreditar`);
      fetchCuotas();
    } catch (error) {
      console.error("Error acreditando cuota", error);
    }
  };

  const rechazar = async (ticketId) => {
    try {
      await api.patch(`/asambal/membresias/ticket/${ticketId}/rechazar`);
      fetchCuotas();
    } catch (error) {
      console.error("Error rechazando cuota", error);
    }
  };

  if (loading)
    return (
      <p className="mt-10 text-center text-gray-200">Cargando cuotas...</p>
    );

  const statusStyle = {
    pendiente: "text-yellow-600 font-semibold",
    acreditada: "text-green-600 font-semibold",
    adeudada: "text-gray-500",
    impaga: "text-red-600 font-semibold",
  };

  return (
    <div className="select-none min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
      <div className="px-4 mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold text-gray-200 mb-6">
          Administración Membresía <span className="text-yellow-600">{year}</span>
        </h1>

        <div className="mt-6 overflow-x-auto shadow-xl rounded-2xl bg-white/90 backdrop-blur">
          <table className="min-w-full text-sm">
            <thead className="text-gray-100 bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-center">Cuota</th>
                <th className="px-4 py-3 text-center">Monto</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300">
              {cuotas.map((cuota) => (
                <tr key={cuota.id}>
                  <td className="px-4 py-2 text-center">Cuota {cuota.cuotaNumber}</td>
                  <td className="px-4 py-2 text-center">${cuota.amount}</td>
                  <td className={`px-4 py-2 text-center ${statusStyle[cuota.status]}`}>
                    {cuota.status}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {cuota.status === "pendiente" && (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => acreditar(cuota.id)}
                          className="cursor-pointer px-3 py-1 w-28 text-sm text-gray-200 bg-green-700 rounded-md hover:bg-green-500 transition-all"
                        >
                          Acreditar
                        </button>
                        <button
                          onClick={() => rechazar(cuota.id)}
                          className="cursor-pointer px-3 py-1 w-28 text-sm text-gray-200 bg-red-700 rounded-md hover:bg-red-500 transition-all"
                        >
                          Rechazar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}