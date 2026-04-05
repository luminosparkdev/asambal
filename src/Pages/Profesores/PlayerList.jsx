import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../Api/Api";
import { EyeIcon, PlusIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function PlayersList() {
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("none");
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  useEffect(() => {
    fetchPlayers();
    fetchCategorias();
  }, []);

  const fetchPlayers = async () => {
    try {
      const res = await api.get("/players/by-coach");
      setPlayers(res.data);
    } catch (err) {
      console.error("Error fetching players:", err.response?.data || err);
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await api.get("/categories");
      setCategorias(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const categoriasMap = useMemo(() => {
    const map = {};
    categorias.forEach(cat => {
      map[cat.id] = `${cat.nombre} ${cat.genero}`;
    });
    return map;
  }, [categorias]);

  const getPlayerClubs = (player) =>
    Array.isArray(player.clubs)
      ? player.clubs.map(c => c.nombreClub).filter(Boolean)
      : [];

  const getPlayerCategories = (player) =>
    Array.isArray(player.clubs)
      ? player.clubs.map(c => categoriasMap[c.categoriaPrincipal]).filter(Boolean)
      : [];

  const unique = (arr) => [...new Set(arr.filter(Boolean))];

  // Opciones de filtros
  const availableClubs = useMemo(
    () => unique(players.flatMap(p => (p.clubs || []).map(c => c.nombreClub))).sort(),
    [players]
  );

  const availableCategories = useMemo(
    () => unique(players.flatMap(p => (p.clubs || []).map(c => categoriasMap[c.categoriaPrincipal]))).sort(),
    [players, categoriasMap]
  );

  const availableEstados = useMemo(() => unique(players.map(p => p.status)).sort(), [players]);
  const availableSexo = useMemo(() => unique(players.map(p => p.sexo)).sort(), [players]);
  const availablePosiciones = useMemo(() => unique(players.map(p => p.posicion)).sort(), [players]);
  const availableManoHabil = useMemo(() => unique(players.map(p => p.manohabil)).sort(), [players]);
  const availableHabilitado = useMemo(() => unique(players.map(p => p.habilitadoAsambal)), [players]);

  const estadoLabels = {
    INCOMPLETO: "Incompleto",
    PENDIENTE: "Pendiente",
    ACTIVO: "Activo",
    INACTIVO: "Inactivo",
    RECHAZADO: "Rechazado",
  };

  const capitalize = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const capitalizeUpper = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .filter(Boolean)
      .map(word => word.toUpperCase())
      .join(" ");
  };

  const normalizeDNI = (dni) => {
    if (!dni) return "";
    return dni.toString().replace(/\D/g, "");
  };

  const filteredPlayers = players
    .filter(player => {
      const matchSearch =
        player.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        player.apellido?.toLowerCase().includes(search.toLowerCase());

      let matchFilter = true;
      if (filterValue !== "") {
        if (filterType === "estado") matchFilter = player.status === filterValue;
        if (filterType === "club") matchFilter = player.clubs?.some(c => c.nombreClub === filterValue);
        if (filterType === "categoria") matchFilter = player.clubs?.some(c => categoriasMap[c.categoriaPrincipal] === filterValue);
        if (filterType === "sexo") matchFilter = player.sexo === filterValue;
        if (filterType === "posicion") matchFilter = player.posicion === filterValue;
        if (filterType === "manoHabil") matchFilter = player.manohabil === filterValue;
        if (filterType === "habilitadoAsambal") matchFilter = player.habilitadoAsambal === (filterValue === "true");
      }

      return matchSearch && matchFilter;
    })
    .sort((a, b) => (a.apellido?.toUpperCase() || "").localeCompare(b.apellido?.toUpperCase() || ""));

  const totalPages = Math.ceil(filteredPlayers.length / rowsPerPage);
  const paginatedPlayers = filteredPlayers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const filterOptionsMap = {
    estado: availableEstados,
    club: availableClubs,
    categoria: availableCategories,
    sexo: availableSexo,
    posicion: availablePosiciones,
    manoHabil: availableManoHabil,
    habilitadoAsambal: availableHabilitado.map(v => String(v)),
  };

  const selectClasses =
    "cursor-pointer h-10 px-3 py-2 text-gray-200 border border-gray-500 rounded-lg bg-gradient-to-r from-gray-800/80 to-transparent focus:outline-none focus:ring-1 focus:ring-gray-200";

  const exportToExcel = () => {
    const dataToExport = filteredPlayers.map(player => ({
      Apellido: capitalizeUpper(player.apellido),
      Nombre: capitalize(player.nombre),
      DNI: normalizeDNI(player.dni),
      Club: getPlayerClubs(player).join(", ") || "-",
      Categoría: getPlayerCategories(player).join(", ") || "-",
      Estado: estadoLabels[player.status] || player.status,
      Habilitado: player.habilitadoAsambal ? "Sí" : "No",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jugadores");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Jugadores.xlsx");
  };

  return (
    <div className="select-none min-h-screen bg-[url('/src/Assets/Asambal/fondodashboard.webp')]">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="px-2 py-6">
          <h2 className="text-2xl font-semibold text-gray-200">Jugadores registrados</h2>
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="grid grid-cols-1 gap-3 mt-6 md:grid-cols-4">
            <input
              type="text"
              placeholder="Buscar"
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
              <option className="text-gray-100 bg-gray-800 hover:bg-gray-700" value="none">Seleccionar filtro</option>
              <option className="text-gray-100 bg-gray-800 hover:bg-gray-700" value="estado">Estado</option>
              <option className="text-gray-100 bg-gray-800 hover:bg-gray-700" value="habilitadoAsambal">Habilitado</option>
              <option className="text-gray-100 bg-gray-800 hover:bg-gray-700" value="club">Club</option>
              <option className="text-gray-100 bg-gray-800 hover:bg-gray-700" value="categoria">Categoría</option>
              <option className="text-gray-100 bg-gray-800 hover:bg-gray-700" value="sexo">Sexo</option>
              <option className="text-gray-100 bg-gray-800 hover:bg-gray-700" value="posicion">Posición</option>
              <option className="text-gray-100 bg-gray-800 hover:bg-gray-700" value="manoHabil">Mano hábil</option>
            </select>

            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              disabled={filterType === "none"}
              className={`${selectClasses} ${filterType === "none" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <option className="text-gray-100 bg-gray-800" value="">Todos</option>
              {(filterOptionsMap[filterType] || []).map(opt => (
                <option key={opt} value={opt} className="text-gray-100 bg-gray-800">
                  {opt === "true" ? "Sí" : opt === "false" ? "No" : opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate("/profesor/jugadores/crear")}
              className="cursor-pointer flex items-center h-10 gap-2 px-3 py-1 text-sm text-green-400 border rounded-md border-green-500/40 hover:bg-green-500/10 hover:text-green-200"
            >
              <PlusIcon className="w-5 h-5" /> Nuevo jugador
            </button>

            <button
              onClick={exportToExcel}
              className="w-44 h-10 px-3 py-2 cursor-pointer text-sm text-green-400 border rounded-md border-green-500/40 hover:bg-green-500/10 hover:text-green-200"
            >
              Exportar a Excel
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="mt-6 overflow-x-auto shadow-xl rounded-2xl bg-white/90 backdrop-blur">
          <table className="min-w-full text-sm">
            <thead className="text-gray-100 bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-center">Apellido</th>
                <th className="px-4 py-3 text-center">Nombre</th>
                <th className="px-4 py-3 text-center">DNI</th>
                <th className="px-4 py-3 text-center">Club</th>
                <th className="px-4 py-3 text-center">Categoría</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Habilitado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300">
              {paginatedPlayers.map(player => (
                <tr key={player.id} className="transition-colors hover:bg-white/5">
                  <td className="px-4 py-2 text-center">{capitalizeUpper(player.apellido)}</td>
                  <td className="px-4 py-2 text-center">{capitalize(player.nombre)}</td>
                  <td className="px-4 py-2 text-center">{normalizeDNI(player.dni)}</td>
                  <td className="px-4 py-2 text-center max-w-40">{getPlayerClubs(player).join(", ") || "-"}</td>
                  <td className="px-4 py-2 text-center max-w-48">{getPlayerCategories(player).join(", ") || "-"}</td>
                  <td className="px-4 py-2 text-center">{estadoLabels[player.status] || player.status}</td>
                  <td className="px-4 py-2 text-center">{player.habilitadoAsambal ? "Sí" : "No"}</td>
                  <td className="px-4 py-2 flex justify-center">
                    <button
                      onClick={() => navigate(`/profesor/jugadores/${player.id}`)}
                      className="cursor-pointer flex items-center gap-1 px-3 py-1 text-sm text-gray-200 bg-blue-600 rounded-md hover:bg-blue-500"
                    >
                      <EyeIcon className="w-4 h-4" />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="w-full h-px bg-gray-300"></div>

          {/* Paginación */}
          <div className="flex justify-center items-center gap-4 py-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="cursor-pointer px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="cursor-pointer px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayersList;