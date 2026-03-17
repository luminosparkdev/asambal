import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import Swal from "sweetalert2";
import { EyeIcon, PlusIcon } from "@heroicons/react/24/outline";

function MembresiasList() {

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("ALL");

  const navigate = useNavigate();

  const years = ["ALL", ...new Set(data.map(d => d.year))];

  const filtered = data.filter(row => {

    const matchName =
      row.club.toLowerCase().includes(search.toLowerCase());

    const matchYear =
      yearFilter === "ALL" || row.year === Number(yearFilter);

    return matchName && matchYear;
  });

  const fetchResumen = async () => {
    try {

      const res = await api.get("/asambal/membresias/resumen");

      setData(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResumen();
  }, []);

  const getStatusColor = (status) => {

    switch (status) {
      case "acreditada":
        return "bg-green-100 text-green-700";

      case "pendiente":
        return "bg-yellow-100 text-yellow-700";

      case "adeudada":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleCrearMembresia = async () => {

    try {

      const res = await api.get("/asambal/membresia/activo");

      if (res.data) {

        await Swal.fire({
          icon: "warning",
          title: "Membresía activa",
          text: `Ya existe una membresía activa para el año ${res.data.year}`,
          confirmButtonText: "Volver al listado"
        });

        return;
      }

      navigate("/asambal/membresias/crear");

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')]">

      <div className="pb-6 mx-auto max-w-7xl">

        <div className="px-2 py-6">
          <h2 className="text-2xl font-semibold text-gray-200">
            Membresías de clubes
          </h2>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

          {/* filtros */}

          <div className="grid grid-cols-1 gap-3 mt-6 md:grid-cols-3">

            <input
              type="text"
              placeholder="Buscar club..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-10 px-3 py-2 text-gray-200 placeholder-gray-200 border border-gray-500 rounded-lg bg-gradient-to-r from-gray-800/80 to-transparent focus:outline-none focus:ring-1 focus:ring-gray-200"
            />

            <select
              value={yearFilter}
              onChange={e => setYearFilter(e.target.value)}
              className="cursor-pointer h-10 px-3 py-2 text-gray-200 border border-gray-500 rounded-lg bg-gradient-to-r from-gray-800/80 to-transparent"
            >

              {years.map(y => (
                <option
                  key={y}
                  value={y}
                  className="text-gray-100 bg-gray-800"
                >
                  {y === "ALL" ? "Todos los años" : y}
                </option>
              ))}

            </select>

          </div>

          <button
            onClick={handleCrearMembresia}
            className="flex items-center gap-2 px-3 py-1 ml-auto text-sm text-green-400 transition-all border rounded-md border-green-500/40 hover:bg-green-500/10 hover:text-green-200"
          >
            <PlusIcon className="w-5 h-5" />
            Crear membresía
          </button>

        </div>

        {/* tabla */}

        <div className="mt-6 overflow-x-auto shadow-xl rounded-2xl bg-white/90 backdrop-blur">

          <table className="min-w-full text-sm select-none">

            <thead className="text-gray-100 bg-gray-800">

              <tr>
                <th className="px-4 py-3 text-center">Club</th>
                <th className="px-4 py-3 text-center">Año</th>
                <th className="px-4 py-3 text-center">Cuota 1</th>
                <th className="px-4 py-3 text-center">Cuota 2</th>
                <th className="px-4 py-3 text-center">Cuota 3</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>

            </thead>

            <tbody className="divide-y divide-gray-300">

              {filtered.map(row => (

                <tr key={row.clubId} className="hover:bg-white/5">

                  <td className="px-4 py-2 text-center">{row.club}</td>

                  <td className="px-4 py-2 text-center">{row.year}</td>

                  {row.cuotas.map(c => (
                    <td key={c.number} className="px-4 py-2 text-center">

                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(c.status)}`}
                      >
                        {c.status}
                      </span>

                    </td>
                  ))}

                  <td className="px-4 py-2">

                    <button
                      onClick={() => navigate(`/asambal/membresias/${row.clubId}/${row.year}`)}
                      className="flex items-center gap-1 px-3 py-1 ml-auto text-sm text-gray-200 transition-all bg-blue-600 rounded-md hover:bg-blue-500"
                    >
                      <EyeIcon className="w-4 h-4" />
                      Administrar
                    </button>

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

export default MembresiasList;