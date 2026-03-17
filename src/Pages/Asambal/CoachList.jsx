import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import Swal from "sweetalert2";
import { EyeIcon } from "@heroicons/react/24/outline";

/* =====================
   Helpers
===================== */

const normalizeStatus = (status) =>
  (status || "INCOMPLETO").trim().toUpperCase();

const STATUS_STYLES = {
  INCOMPLETO: "bg-gray-400 text-gray-700",
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  ACTIVO: "bg-green-100 text-green-700",
  INACTIVO: "bg-red-100 text-red-700",
  RECHAZADO: "bg-orange-100 text-orange-700",
};

function CoachesList() {
  const [coaches, setCoaches] = useState([]);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [clubFilter, setClubFilter] = useState("ALL");

  /* =====================
     Utils
  ===================== */

  const getCoachCategories = (coach) => {
    if (!Array.isArray(coach.clubs)) return [];
    return [...new Set(coach.clubs.flatMap(c => c.categorias || []))];
  };

  const getCoachClubs = (coach) => {
    if (!Array.isArray(coach.clubs)) return [];
    return coach.clubs.map(c => ({
      clubId: c.clubId,
      nombre: c.nombre,
    }));
  };

  const categories = [
    "ALL",
    ...new Set(coaches.flatMap(c => getCoachCategories(c))),
  ];

  const clubs = [
    { clubId: "ALL", nombre: "Todos los clubes" },
    ...Array.from(
      new Map(
        coaches
          .flatMap(c => getCoachClubs(c))
          .map(c => [c.clubId, c])
      ).values()
    ),
  ];

  /* =====================
     Filtro
  ===================== */

  const filteredCoaches = coaches.filter(coach => {
    const nameMatch =
      coach.nombre.toLowerCase().includes(search.toLowerCase());

    const status = normalizeStatus(coach.status);

    const statusMatch =
      statusFilter === "ALL" || status === statusFilter;

    const categoryMatch =
      categoryFilter === "ALL" ||
      getCoachCategories(coach).includes(categoryFilter);

    const clubMatch =
      clubFilter === "ALL" ||
      coach.clubs?.some(c => c.clubId === clubFilter);

    return nameMatch && statusMatch && categoryMatch && clubMatch;
  });

  /* =====================
     Data
  ===================== */

  const fetchCoaches = async () => {
    try {
      const res = await api.get("/asambal/coaches");
      setCoaches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  /* =====================
     Render
  ===================== */

  return (
    <div className="min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="px-2 py-6">
          <h2 className="text-2xl font-semibold text-gray-200">
            Profesores registrados
          </h2>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 gap-3 mt-4 md:grid-cols-4">

            {/* Buscar */}
            <input
                type="text"
                placeholder="Buscar profesor..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="px-3 py-2 bg-gradient-to-r from-gray-800/80 to-transparent 
               text-gray-200 placeholder-gray-300 border border-gray-500 
               rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200 h-10"
            />

            {/* Estado */}
            <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gradient-to-r from-gray-800/80 to-transparent 
               text-gray-200 border border-gray-500 rounded-lg 
               focus:outline-none focus:ring-1 focus:ring-gray-200 h-10"
            >
                <option value="ALL" className="bg-gray-800 text-gray-100 hover:bg-gray-700">Todos los estados</option>
                <option value="INCOMPLETO" className="bg-gray-800 text-gray-100 hover:bg-gray-700">Incompleto</option>
                <option value="PENDIENTE" className="bg-gray-800 text-gray-100 hover:bg-gray-700">Pendiente</option>
                <option value="ACTIVO" className="bg-gray-800 text-gray-100 hover:bg-gray-700">Activo</option>
                <option value="INACTIVO" className="bg-gray-800 text-gray-100 hover:bg-gray-700">Inactivo</option>
                <option value="RECHAZADO" className="bg-gray-800 text-gray-100 hover:bg-gray-700">Rechazado</option>
            </select>

            {/* Club */}
            <select
                value={clubFilter}
                onChange={e => setClubFilter(e.target.value)}
                className="px-3 py-2 bg-gradient-to-r from-gray-800/80 to-transparent 
               text-gray-200 border border-gray-500 rounded-lg 
               focus:outline-none focus:ring-1 focus:ring-gray-200 h-10"
            >
                {clubs.map(club => (
                    <option key={club.clubId} value={club.clubId} className="bg-gray-800 text-gray-100 hover:bg-gray-700">
                        {club.nombre}
                    </option>
                ))}
            </select>

            {/* Categoría */}
            <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-gradient-to-r from-gray-800/80 to-transparent 
               text-gray-200 border border-gray-500 rounded-lg 
               focus:outline-none focus:ring-1 focus:ring-gray-200 h-10"
            >
                {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-gray-800 text-gray-100 hover:bg-gray-700">
                        {cat === "ALL" ? "Todas las categorías" : cat}
                    </option>
                ))}
            </select>
        </div>


        {/* Tabla */}
        <div className="mt-6 overflow-x-auto rounded-2xl shadow-xl bg-white/90 backdrop-blur">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-800 text-gray-100">
              <tr>
                <th className="px-4 py-3 text-center">Nombre</th>
                <th className="px-4 py-3 text-center">DNI</th>
                <th className="px-4 py-3 text-center">Email</th>
                <th className="px-4 py-3 text-center">Teléfono</th>
                <th className="px-4 py-3 text-center">Categorías</th>
                <th className="px-4 py-3 text-center">ENEHA</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300">
              {filteredCoaches.map(p => {
                const status = normalizeStatus(p.status);

                return (
                  <tr key={p.id} className="hover:bg-white/5">
                    <td className="px-4 py-2 text-center">
                      {p.nombre} {p.apellido}
                    </td>

                    <td className="px-4 py-2 text-center">{p.dni}</td>
                    <td className="px-4 py-2 text-center">{p.email}</td>
                    <td className="px-4 py-2 text-center">{p.telefono}</td>

                    <td className="px-4 py-2 text-center max-w-48">
                      <div className="overflow-hidden whitespace-nowrap">
                        {getCoachCategories(p).join(", ") || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-2 text-center">{p.enea}</td>

                    <td className="px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          STATUS_STYLES[status]
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => navigate(`/asambal/profesores/${p.id}`)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm text-gray-200 bg-blue-600 rounded-md hover:bg-blue-500 transition"
                      >
                        <EyeIcon className="w-4 h-4" />
                        Ver
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default CoachesList;
