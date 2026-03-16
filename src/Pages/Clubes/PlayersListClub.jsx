import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../Api/Api";
import { EyeIcon, CheckCircleIcon, XCircleIcon, PlusIcon } from "@heroicons/react/24/outline";

function PlayersListClub() {
  const [players, setPlayers] = useState([]);
  const [categorias, setCategorias] = useState([]); // <-- Nuevo estado para categorías
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Traer categorías al cargar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await api.get("/categories");
        setCategorias(res.data);
      } catch (err) {
        console.error("Error al traer categorias:", err);
        Swal.fire("Error", "No se pudieron cargar las categorías", "error");
      }
    };

    fetchCategorias();
  }, []);

  // Traer jugadores del club
  const fetchPlayers = async () => {
    try {
      const res = await api.get("/clubs/players-by-club");
      setPlayers(res.data);
    } catch (err) {
      console.error("Error fetching players:", err.response?.data || err);
      Swal.fire("Error", "No se pudieron cargar los jugadores", "error");
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Obtener todas las categorías únicas de categoriaPrincipal para el filtro
  const categories = [
    "ALL",
    ...new Set(
      players.flatMap(player =>
        player.clubs?.map(club => {
          // Buscar la categoria completa por ID
          const cat = categorias.find(c => c.id === club.categoriaPrincipal);
          if (cat) return `${cat.genero} ${cat.nombre}`;
          return null;
        }).filter(Boolean)
      )
    ),
  ];

  // Función auxiliar para mostrar la categoriaPrincipal como "genero nombre"
  const getCategoriaPrincipalTexto = (club) => {
    const cat = categorias.find(c => c.id === club.categoriaPrincipal);
    if (!cat) return "Sin categoría";
    return `${cat.genero} ${cat.nombre}`;
  };

  // Filtrado por búsqueda, estado y categoría
  const filteredPlayers = players.filter(player => {
    const matchName = `${player.nombre} ${player.apellido}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || player.status === statusFilter;
    const matchCategory = categoryFilter === "ALL" || player.clubs.some(club => {
      const cat = categorias.find(c => c.id === club.categoriaPrincipal);
      if (!cat) return false;
      return `${cat.genero} ${cat.nombre}` === categoryFilter;
    });
    return matchName && matchStatus && matchCategory;
  });

  // Paginación
  const totalItems = filteredPlayers.length;
  const totalPages = itemsPerPage === "Todos" ? 1 : Math.ceil(totalItems / itemsPerPage);
  const startIndex = itemsPerPage === "Todos" ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = itemsPerPage === "Todos" ? totalItems : startIndex + itemsPerPage;
  const paginatedPlayers = filteredPlayers.slice(startIndex, endIndex);

  // Actualizar estado local de jugador (optimista)
  const updatePlayerStatusLocally = (playerId, newStatus) => {
    setPlayers(prev =>
      prev.map(p => (p.id === playerId ? { ...p, status: newStatus } : p))
    );
  };

  // Toggle estado de jugador (ACTIVO / INACTIVO)
  const togglePlayerStatus = async (player) => {
    const isActive = player.status === "ACTIVO";
    const action = isActive ? "desactivar" : "activar";

    const result = await Swal.fire({
      title: `¿Seguro que quieres ${action} a este jugador?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isActive ? "#d33" : "#3085d6",
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

  const selectClasses =
    "h-10 px-3 text-gray-200 border border-gray-500 rounded-lg bg-slate-800";

  return (
    <div className="min-h-screen bg-[url('../public/assets/Asambal/fondodashboard.webp')] select-none">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between px-2 py-6">
          <h2 className="text-2xl font-semibold text-gray-200">Jugadores de mi club</h2>
          <button
            onClick={() => navigate("/clubs/jugadores/create")}
            className="flex items-center h-10 gap-2 px-3 py-1 text-sm text-green-400 transition-all border rounded-md cursor-pointer border-green-500/40 hover:bg-green-500/10 hover:text-green-200"
          >
            <PlusIcon className="w-5 h-5" />
            Nuevo jugador
          </button>
        </div>

        {/* Filtros + Mostrar por página */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <input
              type="text"
              placeholder="Buscar jugador..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="h-10 px-3 py-2 text-gray-200 placeholder-gray-200 border border-gray-500 rounded-lg bg-gradient-to-r from-gray-800/80 to-transparent focus:outline-none focus:ring-1 focus:ring-gray-200"
            />

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className={selectClasses}
            >
              <option value="ALL">Todos los estados</option>
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
              <option value="RECHAZADO">Rechazado</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className={selectClasses}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "ALL" ? "Todas las categorías" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Mostrar por página */}
          <div className="flex items-center gap-2 mt-2 md:mt-0 md:ml-auto">
            <label className="text-gray-200">Mostrar por página:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                const val = e.target.value === "Todos" ? "Todos" : Number(e.target.value);
                setItemsPerPage(val);
                setCurrentPage(1);
              }}
              className={selectClasses}
            >
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={60}>60</option>
              <option value="Todos">Todos</option>
            </select>
          </div>
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
                <th className="px-4 py-3 text-center">Club</th>
                <th className="px-4 py-3 text-center">Estatura</th>
                <th className="px-4 py-3 text-center">Posición</th>
                <th className="px-4 py-3 text-center">Mano hábil</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300">
              {paginatedPlayers.map((player) => (
                <tr key={player.id} className="transition-colors hover:bg-white/5">
                  <td className="px-4 py-2 text-center">{player.nombre}</td>
                  <td className="px-4 py-2 text-center">{player.apellido}</td>
                  <td className="px-4 py-2 text-center">{player.edad || "-"}</td>

                  <td className="px-4 py-2 text-center">
                    {player.clubs?.map((club, i) => (
                      <div key={i}>{getCategoriaPrincipalTexto(club)}</div>
                    ))}
                  </td>

                  <td className="px-4 py-2 text-center">
                    {player.clubs?.map((club, i) => (
                      <div key={i}>{club.nombreClub}</div>
                    ))}
                  </td>

                  <td className="px-4 py-2 text-center">{player.estatura || "-"}</td>
                  <td className="px-4 py-2 text-center">{player.posicion || "-"}</td>
                  <td className="px-4 py-2 text-center">{player.manohabil || "-"}</td>

                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate(`/club/jugadores/${player.id}`)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-gray-200 transition-all bg-blue-600 rounded-md cursor-pointer hover:bg-blue-500 hover:text-gray-100"
                        title="Ver detalles"
                      >
                        <EyeIcon className="w-5 h-5" /> Ver
                      </button>

                      <button
                        onClick={() => togglePlayerStatus(player)}
                        className={`cursor-pointer flex items-center justify-center gap-1 px-3 py-1 text-sm text-white rounded w-32 ${player.status === "ACTIVO"
                          ? "bg-red-700/95 hover:bg-red-500"
                          : "bg-green-700/95 hover:bg-green-500"
                        }`}
                        title={player.status === "ACTIVO" ? "Desactivar jugador" : "Activar jugador"}
                      >
                        {player.status === "ACTIVO"
                          ? <><XCircleIcon className="w-5 h-5 text-gray-200" /> Desactivar</>
                          : <><CheckCircleIcon className="w-5 h-5 text-gray-200" /> Activar</>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className={`px-4 py-2 text-green-400 border border-green-400 rounded-md hover:bg-green-400/20 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Anterior
            </button>

            <span className="text-green-400">Página {currentPage} de {totalPages}</span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className={`px-4 py-2 text-green-400 border border-green-400 rounded-md hover:bg-green-400/20 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayersListClub;