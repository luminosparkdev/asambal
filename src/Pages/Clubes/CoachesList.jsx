import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import Swal from "sweetalert2";
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

function CoachesList() {
  const [coaches, setCoaches] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const categories = [
    "ALL",
    ...new Set(coaches.flatMap(c => c.categorias || []))
  ];

  const filteredCoaches = coaches.filter(coach => {
    const matchName = coach.nombre
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "ALL" || coach.status === statusFilter;

    const matchCategory =
      categoryFilter === "ALL" || coach.categorias?.includes(categoryFilter);

    return matchName && matchStatus && matchCategory;
  });

  // CÁLCULOS PAGINACIÓN
  const totalItems = filteredCoaches.length;

  const totalPages =
    itemsPerPage === "Todos"
      ? 1
      : Math.ceil(totalItems / itemsPerPage);

  const startIndex =
    itemsPerPage === "Todos"
      ? 0
      : (currentPage - 1) * itemsPerPage;

  const endIndex =
    itemsPerPage === "Todos"
      ? totalItems
      : startIndex + itemsPerPage;

  const paginatedCoaches = filteredCoaches.slice(startIndex, endIndex);

  const updateCoachStatusLocally = (coachId, newStatus) => {
    setCoaches(prev =>
      prev.map(c =>
        c.id === coachId
          ? { ...c, status: newStatus }
          : c
      )
    );
  };

  const fetchCoaches = async () => {
    try {
      const res = await api.get(`/coaches/club`);
      setCoaches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const toggleCoach = async (coach) => {

    const isActive = coach.status === "ACTIVO";
    const action = isActive ? "desactivar" : "activar";

    const result = await Swal.fire({
      title: `¿Seguro que quieres ${action} este profesor?`,
      text: action === "desactivar" 
          ? "El profesor quedará inactivo en el sistema" 
          : "El profesor volverá a estar activo en el sistema",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: action === "desactivar" ? "#d33" : "#3085d6",
      confirmButtonText: `Sí. ${action}`,
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    const previousState = coach.status;
    const optimisticStatus = isActive ? "INACTIVO" : "ACTIVO";

    try {
      updateCoachStatusLocally(coach.id, optimisticStatus);
      await api.patch(`/coaches/${coach.id}/toggle`);

      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      updateCoachStatusLocally(coach.id, previousState);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cambiar el estado del profesor",
      });

      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[url('../public/assets/Asambal/fondodashboard.webp')]">
      <div className="mx-auto max-w-7xl">


        <div className="flex items-center justify-between px-2 py-6">
          <h2 className="text-2xl font-semibold text-gray-200">Profesores registrados</h2>
          <button
            onClick={() => navigate("/coaches/nuevo")}
            className="flex items-center h-10 gap-2 px-3 py-1 text-sm text-green-400 transition-all border rounded-md border-green-500/40 hover:bg-green-500/10 hover:text-green-200 w-fit"
          >
            <PlusIcon className="w-5 h-5" />
            Nuevo profesor
          </button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

            <input
              type="text"
              placeholder="Buscar profesor..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 px-3 py-2 text-gray-200 placeholder-gray-200 border border-gray-500 rounded-lg bg-gradient-to-r from-gray-800/80 to-transparent"
            />

            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 px-3 text-gray-200 border border-gray-500 rounded-lg bg-slate-800"
            >
              <option value="ALL">Todos los estados</option>
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
              <option value="RECHAZADO">Rechazado</option>
            </select>

            <select
              value={categoryFilter}
              onChange={e => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 px-3 text-gray-200 border border-gray-500 rounded-lg bg-slate-800"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "ALL" ? "Todas las categorías" : category}
                </option>
              ))}
            </select>

          </div>

          <div className="flex items-center gap-2 text-gray-200">
            <label>Mostrar por página:</label>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                const val = e.target.value === "Todos" ? "Todos" : Number(e.target.value);
                setItemsPerPage(val);
                setCurrentPage(1);
              }}
              className="h-10 px-3 border border-gray-500 rounded-lg bg-slate-800"
            >
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={60}>60</option>
              <option value="Todos">Todos</option>
            </select>
          </div>


        </div>

        <div className="mt-6 overflow-x-auto shadow-xl rounded-2xl bg-white/90 backdrop-blur">
          <table className="min-w-full text-sm">

            <thead className="text-gray-100 bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-center">Nombre</th>
                <th className="px-4 py-3 text-center">DNI</th>
                <th className="px-4 py-3 text-center">Email</th>
                <th className="px-4 py-3 text-center">Teléfono</th>
                <th className="px-4 py-3 text-center">Categorías</th>
                <th className="px-4 py-3 text-center">ENEA</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300">

              {paginatedCoaches.map((p) => (

                <tr key={p.id} className="transition-colors hover:bg-white/5">

                  <td className="px-4 py-2 text-center">
                    {p.nombre} {p.apellido}
                  </td>

                  <td className="px-4 py-2 text-center">{p.dni}</td>
                  <td className="px-4 py-2 text-center">{p.email}</td>
                  <td className="px-4 py-2 text-center">{p.telefono}</td>

                  <td className="px-4 py-2 text-center">
                    {Array.isArray(p.categorias) && p.categorias.length > 0
                      ? p.categorias[0]
                      : "-"}
                  </td>

                  <td className="px-4 py-2 text-center">{p.enea}</td>

                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        p.status === "ACTIVO"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="flex items-center gap-2 px-4 py-2">

                    <button
                      onClick={() => navigate(`/coaches/${p.id}`)}
                      className="flex items-center gap-1 px-3 py-1 ml-auto text-sm text-gray-200 transition-all bg-blue-600 rounded-md hover:bg-blue-500"
                    >
                      <EyeIcon className="w-4 h-4" />
                      Ver
                    </button>

                    <button
                      onClick={() => toggleCoach(p)}
                      className={`flex items-center gap-1 ml-auto px-3 py-1 text-sm text-white rounded w-24 ${
                        p.status === "ACTIVO"
                          ? "bg-red-700/95 hover:bg-red-500"
                          : "bg-green-700/95 hover:bg-green-500"
                      }`}
                    >
                      {p.status === "ACTIVO" ? (
                        <>
                          <XCircleIcon className="w-4 h-4" />
                          Desactivar
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="w-4 h-4" />
                          Activar
                        </>
                      )}
                    </button>

                  </td>
                </tr>

              ))}

            </tbody>

          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-4">

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 text-green-400 border border-green-400 rounded-md hover:bg-green-400/20 disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="text-green-400">
              Página {currentPage} de {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 text-green-400 border border-green-400 rounded-md hover:bg-green-400/20 disabled:opacity-50"
            >
              Siguiente
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

export default CoachesList;