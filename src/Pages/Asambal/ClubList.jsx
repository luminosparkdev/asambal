  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import Swal from "sweetalert2";
  import api from "../../Api/Api";
  import {EyeIcon, CheckCircleIcon, XCircleIcon, PlusIcon} from "@heroicons/react/24/outline"


  function ClubsList() {
    const [clubs, setClubs] = useState([]);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [cityFilter, setCityFilter] = useState("ALL");
    const cities = ["ALL", ...new Set(clubs.map(c => c.ciudad))];

    const filteredClubs = clubs.filter(club => {
      const matchName = club.nombre
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "ALL" || club.status === statusFilter;

      const matchCity =
        cityFilter === "ALL" || club.ciudad === cityFilter;

      return matchName && matchStatus && matchCity;
    });

    const updateClubStatusLocally = (clubId, newStatus) => {
      setClubs(prev =>
        prev.map(c =>
          c.id === clubId
            ? { ...c, status: newStatus }
            : c
        )
      );
    };

    //OBTENER LISTA DE CLUBES
    const fetchClubs = async () => {
      try {
        const res = await api.get(`/clubs`);
        setClubs(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    useEffect(() => {
      fetchClubs();
    }, []);

    //FUNCION PARA AVTIVAR O DESACTIVAR UN CLUB
    const toggleClubStatus = async (club) => {

      const isActive = club.status === "ACTIVO";

      const action = isActive ? "desactivar" : "activar";

      const result = await Swal.fire({
        title: `¿Seguro que quieres ${action} este club?`,
        text: 
          action === "desactivar" 
          ? "El club quedará inactivo en el sistema al igual que los usuarios relacionados" 
          : "El club volverá a estar activo en el sistema",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: action === "desactivar" ? "#d33" : "#3085d6",
        confirmButtonText: `Sí. ${action}`,
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) return;

      const previousStatus = club.status;
      const optimisticStatus = isActive ? "INACTIVO" : "ACTIVO";

      try {

        updateClubStatusLocally(club.id, optimisticStatus);

        await api.patch(`/clubs/${club.id}/toggle`);

      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        timer: 1500,
        text: 
          action === "desactivar" 
          ? "El club ha sido desactivado exitosamente" 
          : "El club ha sido activado exitosamente",
        showConfirmButton: false,
      });
    } catch (err) {
      updateClubStatusLocally(club.id, previousStatus);

      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "No se pudo cambiar el estado del club",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      console.error(err);
    }
  };

  //ACTUALIZAR CLUB EN LA LISTA
  const updateClubInList = (updatedClub) => {
    setClubs(prev =>
      prev.map(c =>
        c.id === updatedClub.id ? updatedClub : c
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
      {/* Título */}
      <div className="px-2 py-6">
        <h2 className="text-2xl font-semibold text-gray-200">Clubes registrados</h2>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      {/* Filtros */}
      <div className="grid grid-cols-1 gap-3 mt-6 md:grid-cols-4 ">

          {/* Buscar */}
        <input
          type="text"
          placeholder="Buscar club..."
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

        {/* Ciudad */}
        <select
          value={cityFilter}
          onChange={e => setCityFilter(e.target.value)}
          className="px-3 py-2 bg-gradient-to-r from-gray-800/80 to-transparent text-gray-200 border border-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200 "
        >
          {cities.map(city => (
            <option key={city} value={city} className="bg-gray-800 text-gray-100 hover:bg-gray-700">
              {city === "ALL" ? "Todas las ciudades" : city}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => navigate("/clubs/create")}
        className="flex items-center gap-2 ml-auto px-3 py-1 text-sm text-green-400 border border-green-500/40 rounded-md hover:bg-green-500/10 hover:text-green-200 transition-all w-fit h-10"
            
        title="Agregar nuevo club"
      >
        <PlusIcon className="w-5 h-5" />
        Nuevo club
      </button>
      </div>

      {/* TABLA */}
      <div className="mt-6 overflow-x-auto rounded-2xl shadow-xl bg-white/90 backdrop-blur">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 text-gray-100">
            <tr>
              <th className="px-4 py-3 text-center">Nombre</th>
              <th className="px-4 py-3 text-center">Ciudad</th>
              <th className="px-4 py-3 text-center">Responsable</th>
              <th className="px-4 py-3 text-center">Teléfono</th>
              <th className="px-4 py-3 text-center">Sede</th>
              <th className="px-4 py-3 text-center">Creación</th>
              <th className="px-4 py-3 text-center">Actualización</th>
              <th className="px-4 py-3 text-center">Estado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {filteredClubs.map(club => (
            <tr key={club.id} className="transition-colors hover:bg-white/5">
              <td className="px-4 py-2 text-center">{club.nombre}</td>
              <td className="px-4 py-2 text-center">{club.ciudad}</td>
              <td className="px-4 py-2 text-center">{club.responsable}</td>
              <td className="px-4 py-2 text-center">{club.telefono}</td>
              <td className="px-4 py-2 text-center">{club.sede}</td>
              <td className="px-4 py-2 text-center">{formatDate(club.createdAt)}</td>
              <td className="px-4 py-2 text-center">{formatDate(club.updatedAt)}</td>

              <td className="px-4 py-2 text-center">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    club.status === "ACTIVO"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {club.status}
                </span>
              </td>

              <td className="flex gap-2 px-4 py-2">
                <button
                  onClick={() => navigate(`/clubs/${club.id}`)}
                  className="flex items-center gap-1 ml-auto px-3 py-1 text-sm text-gray-200 bg-blue-600 rounded-md hover:bg-blue-500 hover:text-gray-100 hover:cursor-pointer transition-all"
                >
                  <EyeIcon className="w-4 h-4" />
                  Ver
                </button>

                <button
                  onClick={() => toggleClubStatus(club)}
                  className={`flex items-center gap-1 ml-auto px-3 py-1 text-sm text-white rounded w-24 ${
                    club.status === "ACTIVO"
                      ? "flex items-center gap-1 ml-auto px-3 py-1 text-sm text-gray-200 bg-red-700/95 rounded-md hover:bg-red-500 hover:text-gray-100 hover:cursor-pointer transition-all"
                      : "flex items-center gap-1 ml-auto px-3 py-1 text-sm text-gray-200 bg-green-700/95 rounded-md hover:bg-green-500 hover:text-gray-100 hover:cursor-pointer transition-all"
                  }`}
                >
                  {club.status === "ACTIVO"
                    ? <><XCircleIcon className="w-4 h-4 text-gray-200 " /><p>Desactivar</p></>
                    : <><CheckCircleIcon className="w-4 h-4 text-gray-200 " /><p>Activar</p></>
                  }
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

  export default ClubsList;
