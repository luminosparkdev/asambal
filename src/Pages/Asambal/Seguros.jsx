import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../Api/Api";
import { PlusIcon } from "@heroicons/react/24/outline";

function Seguros() {
  const currentYear = new Date().getFullYear();
  const [loading, setLoading] = useState(true);
  const [seguros, setSeguros] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [filterYear, setFilterYear] = useState(currentYear);

  // Traer años disponibles y seguros al cargar
  useEffect(() => {
    fetchAvailableYears();
  }, []);

  useEffect(() => {
    if (filterYear) fetchSeguros(filterYear);
  }, [filterYear]);

  const fetchAvailableYears = async () => {
    try {
      const res = await api.get("/asambal/seguros/years"); // array de años con seguros emitidos
      const years = res.data || [];
      setAvailableYears(years);
      setFilterYear(years.includes(currentYear) ? currentYear : years[years.length - 1]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSeguros = async (year) => {
    try {
      setLoading(true);
      const res = await api.get("/asambal/seguros", { params: { year } });
      setSeguros(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const agregarSeguro = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Agregar seguro",
      html: `
      <input 
        id="swal-year" 
        class="swal2-input" 
        type="number" 
        value="${currentYear}" 
        readonly 
        placeholder="Año"
      >
      <input 
        id="swal-amount" 
        class="swal2-input" 
        type="text" 
        placeholder="$"
      >
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      background: "#0f172a",
      color: "#e5e7eb",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
      didOpen: () => {
        const amountInput = document.getElementById("swal-amount");

        amountInput.addEventListener("input", (e) => {
          let value = e.target.value.replace(/[^\d]/g, ""); // solo números
          if (!value) {
            e.target.value = "";
            return;
          }
          e.target.value = "$ " + Number(value).toLocaleString("es-AR");
        });
      },
      preConfirm: () => {
        const year = document.getElementById("swal-year").value;
        const amountRaw = document
          .getElementById("swal-amount")
          .value.replace(/[^\d]/g, ""); // eliminar $ y separadores
        const amount = Number(amountRaw);
        if (!amount) Swal.showValidationMessage("Ingresar un monto válido");
        return { year, amount };
      },
    });

    if (!formValues) return;

    try {
      await api.post("/asambal/seguros", formValues);

      await Swal.fire({
        icon: "success",
        title: "Seguro agregado",
        text: `Se creó el seguro del año ${formValues.year} correctamente.`,
        confirmButtonText: "Aceptar",
        background: "#0f172a",
        color: "#e5e7eb",
        confirmButtonColor: "#16a34a",
      });

      fetchAvailableYears(); // actualizar años y tabla
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo agregar el seguro",
        confirmButtonText: "Aceptar",
        background: "#0f172a",
        color: "#e5e7eb",
        confirmButtonColor: "#dc2626",
      });
    }
  };



  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "";
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
            Seguros <span className="text-yellow-600">Profesores</span>
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

            <button
              onClick={agregarSeguro}
              className="cursor-pointer flex items-center gap-2 h-10 px-3 text-sm text-green-400 transition-all border rounded-md border-green-500/40 hover:bg-green-500/10 hover:text-green-200"
              title="Agregar seguro"
            >
              <PlusIcon className="w-5 h-5" />
              Agregar
            </button>
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
                  <th className="px-4 py-3 text-center">Profesor</th>
                  <th className="px-4 py-3 text-center">Monto</th>
                  <th className="px-4 py-3 text-center">Año</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {seguros.map((seguro) => (
                  <tr key={seguro.id} className="transition-colors hover:bg-white/5">
                    <td className="px-4 py-2 text-center">
                      {[seguro.nombre, seguro.apellido].filter(Boolean).join(" ")}
                    </td>
                    <td className="px-4 py-2 text-center">{formatCurrency(seguro.amount)}</td>
                    <td className="px-4 py-2 text-center">{seguro.year}</td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${seguro.status === "activo"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {seguro.status}
                      </span>
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

export default Seguros;
