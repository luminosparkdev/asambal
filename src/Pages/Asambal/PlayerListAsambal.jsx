import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import { EyeIcon } from "@heroicons/react/24/outline";

function PlayerListAsambal() {
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("none");
  const [filterValue, setFilterValue] = useState("");

  // Opciones de filtros estáticas
  const filterOptions = {
    none: [],
    estado: ["INCOMPLETO", "PENDIENTE", "ACTIVO", "INACTIVO", "RECHAZADO"],
    habilitado: [true, false],
    club: ["Lumino", "Euro Racing", "Independiente"], // reemplazar por todos los clubes posibles
    categoria: [
      "Mini Masculino","Mini Femenino","Infantil Masculino","Infantil Femenino",
      "Infantil Mixto","Alevines Masculino","Alevines Femenino","Menor Masculino",
      "Menor Femenino","Cadete Masculino","Cadete Femenino","Juvenil Masculino",
      "Juvenil Femenino","Junior Masculino","Junior Femenino","Segunda Masculino",
      "Intermedia Femeninio","Mayor Masculino","Mayor Femenino"
    ],
    sexo: ["Masculino", "Femenino"],
    posicion: ["Arquero", "Ala", "Central", "Pivot", "Extremo"],
    manoHabil: ["Derecha", "Izquierda", "Ambidiestro"],
  };

  // Map para mostrar estados de manera amigable
  const estadoLabels = {    
    INCOMPLETO: "Incompleto",
    PENDIENTE: "Pendiente",
    ACTIVO: "Activo",
    INACTIVO: "Inactivo",
    RECHAZADO: "Rechazado",
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const res = await api.get("/asambal/players");
      setPlayers(res.data);
    } catch (err) {
      console.error("Error fetching players:", err.response?.data || err);
    }
  };

  // Filtrado de jugadores
  const filteredPlayers = players.filter((player) => {
    const matchSearch = `${player.nombre} ${player.apellido}`
      .toLowerCase()
      .includes(search.toLowerCase());

    let matchFilter = true;

    if (filterValue !== "" && filterValue !== "Todos") {
      if (filterType === "estado") matchFilter = player.status === filterValue;
      if (filterType === "habilitado")
        matchFilter = player.habilitadoParaJugar === filterValue;
      if (filterType === "club") matchFilter = player.clubName === filterValue;
      if (filterType === "categoria") matchFilter = player.categoria === filterValue;
      if (filterType === "sexo") matchFilter = player.sexo === filterValue;
      if (filterType === "posicion") matchFilter = player.posicion === filterValue;
      if (filterType === "manoHabil") matchFilter = player.manohabil === filterValue;
    }

    return matchSearch && matchFilter;
  });

  const selectClasses =
    "h-10 px-3 text-gray-200 border border-gray-500 rounded-lg bg-slate-700";

  return (
    <div className="min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
      <div className="px-4 mx-auto max-w-7xl">
        {/* Título */}
        <div className="px-2 py-6">
          <h2 className="text-2xl font-semibold text-gray-200">
            Listado de
            <span className="text-yellow-600"> Jugadores</span>
          </h2>
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 px-3 text-gray-200 placeholder-gray-200 border border-gray-500 rounded-lg bg-gradient-to-r from-gray-800/80 to-transparent focus:outline-none focus:ring-1 focus:ring-gray-200"
          />

          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setFilterValue("");
            }}
            className={selectClasses}
          >
            <option value="none">Sin filtro</option>
            <option value="estado">Estado</option>
            <option value="habilitado">Habilitado para jugar</option>
            <option value="club">Club</option>
            <option value="categoria">Categoría</option>
            <option value="sexo">Sexo</option>
            <option value="posicion">Posición</option>
            <option value="manoHabil">Mano hábil</option>
          </select>

          {filterType !== "none" && (
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className={selectClasses}
            >
              <option value="">Todos</option>
              {(filterOptions[filterType] || []).map((opt) => (
                <option key={opt} value={opt}>
                  {filterType === "estado"
                    ? estadoLabels[opt] || opt
                    : typeof opt === "boolean"
                    ? opt
                      ? "Sí"
                      : "No"
                    : opt}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Tabla */}
        <div className="mt-6 overflow-x-auto shadow-xl rounded-2xl bg-white/90 backdrop-blur">
          <table className="min-w-full text-sm">
            <thead className="text-gray-100 bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-center">Nombre</th>
                <th className="px-4 py-3 text-center">Apellido</th>
                <th className="px-4 py-3 text-center">Club</th>
                <th className="px-4 py-3 text-center">Categoría</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Habilitado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300">
              {filteredPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-white/5">
                  <td className="px-4 py-2 text-center">{player.nombre}</td>
                  <td className="px-4 py-2 text-center">{player.apellido}</td>
                  <td className="px-4 py-2 text-center">{player.clubName}</td>
                  <td className="px-4 py-2 text-center">{player.categoria}</td>
                  <td className="px-4 py-2 text-center">
                    {estadoLabels[player.status] || player.status}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {player.habilitadoParaJugar ? (
                      <span className="font-semibold text-green-600">Sí</span>
                    ) : (
                      <span className="font-semibold text-red-600">No</span>
                    )}
                  </td>
                  <td className="flex justify-center gap-2 px-4 py-2">
                    <button
                      onClick={() =>
                        navigate(`/asambal/jugadores/${player.id}`)
                      }
                      className="flex items-center gap-1 px-3 py-1 text-sm text-gray-200 transition-all bg-blue-600 rounded-md hover:bg-blue-500"
                    >
                      <EyeIcon className="w-4 h-4" />
                      Ver
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

export default PlayerListAsambal;
