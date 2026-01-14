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
  const categories = ["ALL", ...new Set(coaches.map(c => c.categoria))];

  const filteredCoaches = coaches.filter(coach => {
      const matchName = coach.nombre
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "ALL" || coach.status === statusFilter;

      const matchCategory =
        categoryFilter === "ALL" || coach.categoria === categoryFilter;

      return matchName && matchStatus && matchCategory;
    });

    const updateCoachStatusLocally = (coachId, newStatus) => {
      setCoaches(prev =>
        prev.map(c =>
          c.id === coachId
            ? { ...c, status: newStatus }
            : c
        )
      );
    };

    //OBTENER LISTA DE PROFESORES
    const fetchCoaches = async () => {
      try {
        const res = await api.get(`/coaches`);
        setCoaches(res.data);
        console.log(res.data);
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
        text: 
          action === "desactivar" 
          ? "El profesor ha sido desactivado exitosamente" 
          : "El profesor ha sido activado exitosamente",
        showConfirmButton: false,
      });
    } catch (err) {
      updateCoachStatusLocally(coach.id, previousState);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cambiar el estado del profesor",
        timer: 1200,
        showConfirmButton: false,
      });
      console.error(err);
    }
  };

  //ACTUALIZAR COACH EN LA LISTA
  const updateCoachInList = (updatedCoach) => {
    setCoaches(prev =>
      prev.map(c =>
        c.id === updatedCoach.id ? updatedCoach : c
      )
    );
  };

  const formatDate = (date) =>
  new Date(date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="px-2 py-6">
          <h2 className="text-2xl font-semibold text-gray-200">
            Profesores registrados
          </h2>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      {/* Filtros */}
      <div className="grid grid-cols-1 gap-3 mt-4 md:grid-cols-4 ">

          {/* Buscar */}
        <input
          type="text"
          placeholder="Buscar profesor..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 bg-gradient-to-r from-gray-800/80 to-transparent text-gray-200 placeholder-gray-200 border border-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200 h-10"
        />

        {/* Estado */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-gradient-to-r from-gray-800/80 to-transparent text-gray-200 border border-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200 h-10"
        >
          <option value="ALL" className="bg-gray-800 text-gray-100 hover:bg-gray-700">Todos los estados</option>
          <option value="ACTIVO" className="bg-gray-800 text-gray-100 hover:bg-gray-700">Activo</option>
          <option value="INACTIVO" className="bg-gray-800 text-gray-100 hover:bg-gray-700">Inactivo</option>
          <option value="RECHAZADO" className="bg-gray-800 text-gray-100 hover:bg-gray-700">Rechazado</option>
        </select>

        {/* Categoria */}
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-gradient-to-r from-gray-800/80 to-transparent text-gray-200 border border-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200 "
        >
          {categories.map(category => (
            <option key={category} value={category} className="bg-gray-800 text-gray-100 hover:bg-gray-700">
              {category === "ALL" ? "Todas las categorías" : category}
            </option>
          ))}
        </select>
      </div>

          <button
            onClick={() => navigate("/coaches/nuevo")}
            className="flex items-center gap-2 px-3 py-1 text-sm text-green-400 border border-green-500/40 rounded-md hover:bg-green-500/10 hover:text-green-200 transition-all w-fit h-10"
          >
            <PlusIcon className="w-5 h-5" />
            Nuevo profesor
          </button>
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
                <th className="px-4 py-3 text-center">Categoría</th>
                <th className="px-4 py-3 text-center">ENEA</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300">
              {filteredCoaches.map((p) => (
                <tr
                  key={p.id}
                  className="transition-colors hover:bg-white/5"
                >
                  <td className="px-4 py-2 text-center">
                    {p.nombre} {p.apellido}
                  </td>
                  <td className="px-4 py-2 text-center">{p.dni}</td>
                  <td className="px-4 py-2 text-center">{p.email}</td>
                  <td className="px-4 py-2 text-center">{p.telefono}</td>
                  <td className="px-4 py-2 text-center">{p.categoria}</td>
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

                  <td className="flex gap-2 px-4 py-2 items-center">
                    <button
                      onClick={() => navigate(`/coaches/${p.id}`)}
                      className="flex items-center gap-1 ml-auto px-3 py-1 text-sm text-gray-200 bg-blue-600 rounded-md hover:bg-blue-500 hover:text-gray-100 hover:cursor-pointer transition-all"
                    >
                      <EyeIcon className="w-4 h-4" />
                      Ver
                    </button>

                    <button
                      onClick={() => toggleCoach(p)}
                      className={`flex items-center gap-1 ml-auto px-3 py-1 text-sm text-white rounded w-24 ${
                    p.status === "ACTIVO"
                      ? "flex items-center gap-1 ml-auto px-3 py-1 text-sm text-gray-200 bg-red-700/95 rounded-md hover:bg-red-500 hover:text-gray-100 hover:cursor-pointer transition-all"
                      : "flex items-center gap-1 ml-auto px-3 py-1 text-sm text-gray-200 bg-green-700/95 rounded-md hover:bg-green-500 hover:text-gray-100 hover:cursor-pointer transition-all"
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
      </div>
    </div>
  );
}

export default CoachesList;
