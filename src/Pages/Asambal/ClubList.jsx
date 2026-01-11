  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  import Swal from "sweetalert2";


  const API_URL = "http://localhost:3000/api";

  function ClubsList() {
    const [clubs, setClubs] = useState([]);
    const navigate = useNavigate();

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
        const res = await axios.get(`${API_URL}/clubs`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setClubs(res.data);
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

        await axios.patch(
          `${API_URL}/clubs/${club.id}/toggle`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
      );

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


  return (
  <div className="flex flex-col h-screen p-6 bg-gray-100">
    {/* Título */}
    <h2 className="mb-4 text-2xl font-semibold text-gray-800">Clubs registrados</h2>

    {/* Contenedor de tabla con scroll */}
    <div className="flex-1 overflow-auto">
      <table className="min-w-full overflow-hidden bg-white rounded-lg shadow-lg">
        <thead className="text-white bg-blue-900">
          <tr>
            <th className="px-4 py-2 text-sm font-medium text-left">Nombre</th>
            <th className="px-4 py-2 text-sm font-medium text-left">Ciudad</th>
            <th className="px-4 py-2 text-sm font-medium text-left">Responsable</th>
            <th className="px-4 py-2 text-sm font-medium text-left">Teléfono</th>
            <th className="px-4 py-2 text-sm font-medium text-left">Sede</th>
            <th className="px-4 py-2 text-sm font-medium text-left">Creación</th>
            <th className="px-4 py-2 text-sm font-medium text-left">Actualización</th>
            <th className="px-4 py-2 text-sm font-medium text-left">Estado</th>
            <th className="px-4 py-2 text-sm font-medium text-left">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {clubs.map((club) => (
            <tr key={club.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-700">{club.nombre}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{club.ciudad}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{club.responsable}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{club.telefono}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{club.sede}</td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {club.createdAt ? new Date(club.createdAt).toLocaleDateString() : "-"}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {club.updatedAt ? new Date(club.updatedAt).toLocaleDateString() : "-"}
              </td>
              <td className={`py-2 px-4 text-sm font-medium ${club.status === "ACTIVO" ? "text-green-600" : "text-red-600"}`}>
                {club.status === "ACTIVO" ? "Activo" : "Inactivo"}
              </td>
              <td className="flex gap-2 px-4 py-2">
                <button
                  onClick={() => navigate(`/clubs/${club.id}`)}
                  className="px-3 py-1 text-sm text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Ver Detalles
                </button>
                <button
                  onClick={() => toggleClubStatus(club)}
                  className={`px-3 py-1 rounded-md text-sm transition ${
                    club.status === "ACTIVO" ? "bg-red-600 text-white hover:bg-red-700" : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {club.status === "ACTIVO" ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Botón flotante para agregar club */}
    <div className="flex justify-end mt-4">
      <button
        onClick={() => navigate("/clubs/create")}
        className="flex items-center justify-center w-12 h-12 text-2xl text-white transition bg-blue-600 rounded-full shadow-lg hover:bg-blue-700"
        title="Agregar nuevo club"
      >
        +
      </button>
    </div>
  </div>
  );
  }

  export default ClubsList;
