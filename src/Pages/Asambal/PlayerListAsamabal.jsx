import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import Swal from "sweetalert2";
import { EyeIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

function PlayerListAsambal() {
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("none");
  const [filterValue, setFilterValue] = useState("");

  const getPlayerClubs = (player) =>
    Array.isArray(player.clubs)
      ? player.clubs.map(c => c.nombreClub).filter(Boolean)
      : [];

  const getPlayerCategories = (player) =>
    Array.isArray(player.clubs)
      ? [...new Set(player.clubs.flatMap(c => c.categorias || []))]
      : [];

  const unique = (arr) => [...new Set(arr.filter(Boolean))];

  const availableClubs = useMemo(
    () =>
      unique(
        players.flatMap(p =>
          (p.clubs || []).map(c => c.nombreClub)
        )
      ).sort(),
    [players]
  );

  const availableCategories = useMemo(
    () =>
      unique(
        players.flatMap(p =>
          (p.clubs || []).flatMap(c => c.categorias || [])
        )
      ).sort(),
    [players]
  );

  const availableEstados = useMemo(
    () => unique(players.map(p => p.status)).sort(),
    [players]
  );

  const availablePosiciones = useMemo(
    () => unique(players.map(p => p.posicion)).sort(),
    [players]
  );

  const availableManoHabil = useMemo(
    () => unique(players.map(p => p.manohabil)).sort(),
    [players]
  );

  const availableSexo = useMemo(
    () => unique(players.map(p => p.sexo)).sort(),
    [players]
  );

  const availableHabilitado = useMemo(
    () => unique(players.map(p => p.habilitadoAsambal)),
    [players]
  );

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

  const handleGrantScholarship = async (player) => {
    const result = await Swal.fire({
      title: "¿Becar jugador?",
      text: `${player.nombre} ${player.apellido} quedará habilitado hasta el próximo 28 de febrero sin pagar empadronamiento.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, becar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await api.post(`/asambal/players/${player.id}/grant-scholarship`);
      Swal.fire("Listo", "El jugador fue becado", "success");
      fetchPlayers();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo becar al jugador", "error");
    }
  };

  const filteredPlayers = players.filter((player) => {
    const matchSearch = `${player.nombre} ${player.apellido}`
      .toLowerCase()
      .includes(search.toLowerCase());

    let matchFilter = true;

    if (filterValue !== "") {
      if (filterType === "estado")
        matchFilter = player.status === filterValue;

      if (filterType === "habilitadoAsambal")
        matchFilter = player.habilitadoAsambal === (filterValue === "true");

      if (filterType === "club")
        matchFilter = player.clubs?.some(
          c => c.nombreClub === filterValue
        );

      if (filterType === "categoria")
        matchFilter = player.clubs?.some(
          c => (c.categorias || []).includes(filterValue)
        );

      if (filterType === "sexo")
        matchFilter = player.sexo === filterValue;

      if (filterType === "posicion")
        matchFilter = player.posicion === filterValue;

      if (filterType === "manoHabil")
        matchFilter = player.manohabil === filterValue;
    }

    return matchSearch && matchFilter;
  });

  const filterOptionsMap = {
    estado: availableEstados,
    habilitadoAsambal: availableHabilitado.map(v => String(v)),
    club: availableClubs,
    categoria: availableCategories,
    sexo: availableSexo,
    posicion: availablePosiciones,
    manoHabil: availableManoHabil,
  };

  const selectClasses =
    "cursor-pointer px-3 py-2 text-gray-200 border border-gray-500 rounded-lg bg-gradient-to-r from-gray-800/80 to-transparent focus:outline-none focus:ring-1 focus:ring-gray-200";

  return (
    <div className="min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
      <div className="pb-6 mx-auto max-w-7xl">
        {/* Título */}
        <div className="px-2 py-6">
          <h2 className="text-2xl font-semibold text-gray-200">
            Listado de jugadores
          </h2>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          {/* Filtros */}
          <div className="grid grid-cols-1 gap-3 mt-6 md:grid-cols-4 ">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 px-3 text-gray-200 placeholder-gray-200 border border-gray-500 rounded-lg bg-gradient-to-r from-gray-800/80 to-transparent"
            />

            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setFilterValue("");
              }}
              className={selectClasses}
            >
              <option value="none">Seleccionar filtro</option>
              <option value="estado">Estado</option>
              <option value="habilitadoAsambal">Habilitado</option>
              <option value="club">Club</option>
              <option value="categoria">Categoría</option>
              <option value="sexo">Sexo</option>
              <option value="posicion">Posición</option>
              <option value="manoHabil">Mano hábil</option>
            </select>
          </div>
          {filterType !== "none" && (
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className={selectClasses}
            >
              <option value="">Todos</option>

              {(filterOptionsMap[filterType] || []).map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "true" ? "Sí" : opt === "false" ? "No" : opt}
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
                <th className="px-4 py-3 text-center">DNI</th>
                <th className="px-4 py-3 text-center">Club</th>
                <th className="px-4 py-3 text-center">Categoría</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Habilitado</th>
                <th className="px-4 py-3 text-center">Beca</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300">
              {filteredPlayers.map((player) => (
                <tr key={player.id}>
                  <td className="px-4 py-2 text-center">{player.nombre}</td>
                  <td className="px-4 py-2 text-center">{player.apellido}</td>
                  <td className="px-4 py-2 text-center">{player.dni}</td>

                  <td className="px-4 py-2 text-center max-w-40">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {getPlayerClubs(player).join(", ") || "-"}
                    </div>
                  </td>

                  <td className="px-4 py-2 text-center max-w-48">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {getPlayerCategories(player).join(", ") || "-"}
                    </div>
                  </td>

                  <td className="px-4 py-2 text-center">
                    {estadoLabels[player.status] || player.status}
                  </td>

                  <td className="px-4 py-2 text-center">
                    {player.habilitadoAsambal ? "Sí" : "No"}
                  </td>

                  {/* COLUMNA BECA */}
                  <td className="px-4 py-2 text-center">
                    {player.becado ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-purple-700 bg-purple-200 rounded-full">
                        <AcademicCapIcon className="w-4 h-4" />
                        Becado
                      </span>
                    ) : !player.habilitadoAsambal ? (
                      <button
                        onClick={() => handleGrantScholarship(player)}
                        className="px-3 py-1 text-xs font-medium text-white bg-purple-600 rounded hover:bg-purple-500"
                      >
                        Becar
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="px-4 py-2 flex justify-center">
                    <button
                      onClick={() =>
                        navigate(`/asambal/jugadores/${player.id}`)
                      }
                      className="flex items-center gap-1 px-3 py-1 text-sm text-gray-200 bg-blue-600 rounded-md hover:bg-blue-500"
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
