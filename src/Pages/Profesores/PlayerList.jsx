import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../Api/Api";
import { EyeIcon, PencilSquareIcon, CheckCircleIcon, XCircleIcon, PlusIcon } from "@heroicons/react/24/outline";

function PlayersList() {
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const categories = ["ALL", ...new Set(players.map(p => p.categoria))];

  const filteredPlayers = players.filter(player => {
    const matchName = `${player.nombre} ${player.apellido}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || player.status === statusFilter;
    const matchCategory = categoryFilter === "ALL" || player.categoria === categoryFilter;
    return matchName && matchStatus && matchCategory;
  });

  const updatePlayerStatusLocally = (playerId, newStatus) => {
    setPlayers(prev =>
      prev.map(p => (p.id === playerId ? { ...p, status: newStatus } : p))
    );
  };

const fetchPlayers = async () => {
  try {
    const res = await api.get("/players/by-coach");
    setPlayers(res.data);
  } catch (err) {
    console.error("Error fetching players:", err.response?.data || err);
  }
};

  useEffect(() => {
    fetchPlayers();
  }, []);

  const togglePlayerStatus = async (player) => {
    const isActive = player.status === "ACTIVO";
    const action = isActive ? "desactivar" : "activar";

    const result = await Swal.fire({
      title: `¿Seguro que quieres ${action} a este jugador?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: action === "desactivar" ? "#d33" : "#3085d6",
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    const previousStatus = player.status;
    const optimisticStatus = isActive ? "INACTIVO" : "ACTIVO";

    try {
      updatePlayerStatusLocally(player.id, optimisticStatus);
      await api.patch(`/players/${player.id}/toggle`);

      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      updatePlayerStatusLocally(player.id, previousStatus);
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "No se pudo cambiar el estado del jugador",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      console.error(err);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
      <div className="px-4 mx-auto max-w-7xl">
        {/* Título */}
        <div className="px-2 py-6">
          <h2 className="text-2xl font-semibold text-gray-200">Jugadores registrados</h2>
        </div>

        {/* Filtros y botón */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="grid grid-cols-1 gap-3 mt-6 md:grid-cols-4">
            <input
              type="text"
              placeholder="Buscar jugador..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 px-3 py-2 text-gray-200 placeholder-gray-200 border border-gray-500 rounded-lg bg-gradient-to-r from-gray-800/80 to-transparent focus:outline-none focus:ring-1 focus:ring-gray-200"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 py-2 text-gray-200 border border-gray-500 rounded-lg bg-gradient-to-r from-gray-800/80 to-transparent focus:outline-none focus:ring-1 focus:ring-gray-200"
            >
              <option value="ALL" className="text-gray-100 bg-gray-800 hover:bg-gray-700">Todos los estados</option>
              <option value="ACTIVO" className="text-gray-100 bg-gray-800 hover:bg-gray-700">Activo</option>
              <option value="INACTIVO" className="text-gray-100 bg-gray-800 hover:bg-gray-700">Inactivo</option>
              <option value="RECHAZADO" className="text-gray-100 bg-gray-800 hover:bg-gray-700">Rechazado</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 px-3 py-2 text-gray-200 border border-gray-500 rounded-lg bg-gradient-to-r from-gray-800/80 to-transparent focus:outline-none focus:ring-1 focus:ring-gray-200"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="text-gray-100 bg-gray-800 hover:bg-gray-700">
                  {cat === "ALL" ? "Todas las categorías" : cat}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => navigate("/profesor/jugadores/crear")}
            className="flex items-center h-10 gap-2 px-3 py-1 ml-auto text-sm text-green-400 transition-all border rounded-md border-green-500/40 hover:bg-green-500/10 hover:text-green-200 w-fit"
            title="Agregar nuevo jugador"
          >
            <PlusIcon className="w-5 h-5" />
            Nuevo jugador
          </button>
        </div>

        {/* Tabla */}
        <div className="mt-6 overflow-x-auto shadow-xl rounded-2xl bg-white/90 backdrop-blur">
<table className="min-w-full text-sm">
  <thead className="text-gray-100 bg-gray-800">
  <tr>
    <th className="px-4 py-3 text-center">Nombre</th>
    <th className="px-4 py-3 text-center">Apellido</th>
    <th className="px-4 py-3 text-center">Edad</th>
    <th className="px-4 py-3 text-center">Categoría</th>
    <th className="px-4 py-3 text-center">Estatura</th>
    <th className="px-4 py-3 text-center">Posición</th>
    <th className="px-4 py-3 text-center">Mano hábil</th>
    <th className="px-4 py-3 text-center">Acciones</th>
  </tr>
</thead>

<tbody className="divide-y divide-gray-300">
  {filteredPlayers.map((player) => (
    <tr key={player.id} className="transition-colors hover:bg-white/5">
      <td className="px-4 py-2 text-center">{player.nombre}</td>
      <td className="px-4 py-2 text-center">{player.apellido}</td>
      <td className="px-4 py-2 text-center">{player.edad}</td>
      <td className="px-4 py-2 text-center">{player.categoria}</td>
      <td className="px-4 py-2 text-center">{player.estatura}</td>
      <td className="px-4 py-2 text-center">{player.posicion}</td>
      <td className="px-4 py-2 text-center">{player.manohabil}</td>
      <td className="flex justify-center gap-2 px-4 py-2">
        <button
          onClick={() => navigate(`/profesor/jugadores/${player.id}`)}
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-200 transition-all bg-blue-600 rounded-md hover:bg-blue-500 hover:text-gray-100"
          title="Ver detalles"
        >
          <EyeIcon className="w-4 h-4" /> Ver
        </button>

        <button
          onClick={() => togglePlayerStatus(player)}
          className={`flex items-center gap-1 px-3 py-1 text-sm text-white rounded w-24 ${
            player.status === "ACTIVO"
              ? "bg-red-700/95 hover:bg-red-500"
              : "bg-green-700/95 hover:bg-green-500"
          }`}
          title={player.status === "ACTIVO" ? "Desactivar jugador" : "Activar jugador"}
        >
          {player.status === "ACTIVO"
            ? <><XCircleIcon className="w-4 h-4 text-gray-200" /> Desactivar</>
            : <><CheckCircleIcon className="w-4 h-4 text-gray-200" /> Activar</>}
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

export default PlayersList;