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

  if (loading) return <p className="p-6">Cargando cuotas...</p>;

  const statusStyle = {
    pendiente: "text-yellow-600 font-semibold",
    acreditada: "text-green-600 font-semibold",
    adeudada: "text-gray-500",
    impaga: "text-red-600 font-semibold"
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Administración Membresía {year}
      </h1>

      <table className="w-full border border-gray-200">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Cuota</th>
            <th className="p-3 text-left">Monto</th>
            <th className="p-3 text-left">Estado</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>

        <tbody>

          {cuotas.map((cuota) => (

            <tr key={cuota.id} className="border-t">

              <td className="p-3">
                Cuota {cuota.cuotaNumber}
              </td>

              <td className="p-3">
                ${cuota.amount}
              </td>

              <td className={`p-3 ${statusStyle[cuota.status]}`}>
                {cuota.status}
              </td>

              <td className="p-3">

                {cuota.status === "pendiente" && (

                  <div className="flex gap-2">

                    <button
                      onClick={() => acreditar(cuota.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Acreditar
                    </button>

                    <button
                      onClick={() => rechazar(cuota.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
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
  );
}