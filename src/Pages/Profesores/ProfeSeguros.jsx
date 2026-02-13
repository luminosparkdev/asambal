import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../Api/Api";

function ProfeSeguros() {
  const currentYear = new Date().getFullYear();
  const [loading, setLoading] = useState(true);
  const [seguros, setSeguros] = useState([]);
  const [availableYears, setAvailableYears] = useState([currentYear]);
  const [filterYear, setFilterYear] = useState(currentYear);

  // Traer años disponibles y seguros al cargar
  useEffect(() => {
    console.log("Fetching available years...");
    fetchSeguros();
  }, []);

  useEffect(() => {
    console.log(`Fetching seguros for year ${filterYear}...`);
    fetchSeguros();
  }, [filterYear]);

  const fetchSeguros = async () => {
    try {
      setLoading(true);
      console.log("Fetching seguros from backend...");
      const res = await api.get("/coaches/seguros"); // Sin el filtro de año, solo el ID del profesor
      console.log("Seguros response:", res.data);
      const tickets = res.data || [];
      
      // Obtenemos los años únicos y los ordenamos
      const years = [...new Set(tickets.map(t => t.year))].sort((a, b) => b - a);
      setAvailableYears(years); // Guardamos los años disponibles
      setFilterYear(years.includes(currentYear) ? currentYear : years[0]); // Seleccionamos el año por defecto

      // Filtramos los seguros por año
      const segurosForYear = tickets.filter(seguro => seguro.year === filterYear);
      setSeguros(segurosForYear);
    } catch (error) {
      console.error("Error fetching seguros:", error);
      setSeguros([]);
    } finally {
      setLoading(false);
    }
  };

  const pagarSeguro = async (seguro) => {
    if (seguro.status === "activo") return;

    const confirm = await Swal.fire({
      icon: "question",
      title: "Confirmar pago",
      text: `Desea marcar como pagado el seguro de ${seguro.year}?`,
      showCancelButton: true,
      confirmButtonText: "Sí, pagar",
      cancelButtonText: "Cancelar",
      background: "#0f172a",
      color: "#e5e7eb",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.patch(`/coaches/seguros/${seguro.id}/pagar`);
      Swal.fire({
        icon: "success",
        title: "Pago registrado",
        text: `El seguro de ${seguro.year} ahora está activo.`,
        background: "#0f172a",
        color: "#e5e7eb",
        confirmButtonColor: "#16a34a",
      });
      fetchSeguros(); // Refrescar la lista de seguros después del pago
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo procesar el pago",
        background: "#0f172a",
        color: "#e5e7eb",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
      <div className="pb-6 mx-auto max-w-7xl">
        {/* Título y controles */}
        <div className="px-2 py-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-2xl font-semibold text-gray-200">
            Mis Seguros <span className="text-yellow-600">Profesores</span>
          </h2>

          <div className="flex gap-2">
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(Number(e.target.value))}
              className="h-10 px-3 border border-gray-500 rounded-lg bg-gradient-to-r from-gray-800/80 to-transparent text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-200"
            >
              {availableYears.map((year) => (
                <option key={year} value={year} className="bg-gray-800 text-gray-100">
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabla de seguros */}
        {loading ? (
          <p className="mt-10 text-center text-gray-200">Cargando seguros...</p>
        ) : (
          <div className="mt-6 overflow-x-auto shadow-xl rounded-2xl bg-white/90 backdrop-blur">
            <table className="select-none min-w-full text-sm">
              <thead className="text-gray-100 bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-center">Monto</th>
                  <th className="px-4 py-3 text-center">Año</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {seguros.map((seguro) => (
                  <tr key={seguro.id} className="transition-colors hover:bg-white/5">
                    <td className="px-4 py-2 text-center">{formatCurrency(seguro.amount)}</td>
                    <td className="px-4 py-2 text-center">{seguro.year}</td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          seguro.status === "activo"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {seguro.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {seguro.status !== "activo" && (
                        <button
                          onClick={() => pagarSeguro(seguro)}
                          className="text-sm text-blue-500 hover:text-blue-700 underline"
                        >
                          Pagar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {seguros.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                      No hay seguros para este año
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfeSeguros;
