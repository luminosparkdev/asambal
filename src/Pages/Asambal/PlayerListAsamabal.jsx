import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import Swal from "sweetalert2";
import { EyeIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function PlayerListAsambal() {
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("none");
  const [filterValue, setFilterValue] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState(null);
  const rowsPerPage = 20;

  const fetchStats = async () => {
  try {
    const res = await api.get("/asambal/players/stats");
    setStats(res.data);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchStats();
}, []);

  const getPlayerClubs = (player) =>
    Array.isArray(player.clubs)
      ? player.clubs.map(c => c.nombreClub).filter(Boolean)
      : [];

  const fetchCategorias = async () => {
    try {
      const res = await api.get("/categories");
      setCategorias(res.data);
    } catch (err) {
      console.error("Error fetching categorias:", err);
    }
  };

  const categoriasMap = useMemo(() => {
    const map = {};
    categorias.forEach(cat => {
      map[cat.id] = `${cat.nombre} ${cat.genero}`;
    });
    return map;
  }, [categorias]);

  const getPlayerCategories = (player) =>
    Array.isArray(player.clubs)
      ? player.clubs.map(c => categoriasMap[c.categoriaPrincipal]).filter(Boolean)
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
    fetchStats();
    fetchCategorias();
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

  const filteredPlayers = players
    .filter((player) => {
      const matchSearch =
        player.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        player.apellido?.toLowerCase().includes(search.toLowerCase());

      let matchFilter = true;

      if (filterValue !== "") {
        if (filterType === "estado")
          matchFilter = player.status === filterValue;

        if (filterType === "habilitadoAsambal")
          matchFilter = player.habilitadoAsambal === (filterValue === "true");

        if (filterType === "club")
          matchFilter = player.clubs?.some(
            (c) => c.nombreClub === filterValue
          );

        if (filterType === "categoria")
          matchFilter = player.clubs?.some(
            (c) => (c.categoriaPrincipal || []).includes(filterValue)
          );

        if (filterType === "sexo") matchFilter = player.sexo === filterValue;

        if (filterType === "posicion")
          matchFilter = player.posicion === filterValue;

        if (filterType === "manoHabil") matchFilter = player.manohabil === filterValue;
      }

      return matchSearch && matchFilter;
    })
    // Ordenamos por apellido ascendente al render
    .sort((a, b) => {
      const aApellido = a.apellido?.toUpperCase() || "";
      const bApellido = b.apellido?.toUpperCase() || "";
      return aApellido.localeCompare(bApellido);
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
    "cursor-pointer h-10 px-3 py-2 text-gray-200 border border-gray-500 rounded-lg bg-gradient-to-r from-gray-800/80 to-transparent focus:outline-none focus:ring-1 focus:ring-gray-200";

  // Ordenamos filteredPlayers directamente por apellido (en mayúsculas para consistencia)
  const sortedPlayers = [...filteredPlayers].sort((a, b) =>
    (a.apellido?.toUpperCase() || "").localeCompare(b.apellido?.toUpperCase() || "")
  );

  // Paginación sigue igual
  const totalPages = Math.ceil(sortedPlayers.length / rowsPerPage);

  const paginatedPlayers = sortedPlayers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Para Nombres (primera letra mayúscula de cada palabra)
  const capitalize = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Para Apellidos (todo en mayúsculas)
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
    return dni.toString().replace(/\D/g, ""); // elimina todo lo que no sea número
  };

  const exportToExcel = () => {
    const dataToExport = sortedPlayers.map(player => ({
      Apellido: capitalizeUpper(player.apellido),
      Nombre: capitalize(player.nombre),
      DNI: normalizeDNI(player.dni),
      Club: getPlayerClubs(player).join(", ") || "-",
      Categoría: getPlayerCategories(player).join(", ") || "-",
      Estado: estadoLabels[player.status] || player.status,
      Habilitado: player.habilitadoAsambal ? "Sí" : "No",
      Beca: player.becado
        ? "Becado"
        : !player.habilitadoAsambal
          ? "Becar"
          : "No requerido",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jugadores");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Jugadores_Asambal.xlsx");
  };

  return (
    <div className="select-none min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
      <div className="pb-6 mx-auto max-w-7xl">
        {/* Título */}
        <div className="mx-4 py-6">
          <h2 className="text-2xl font-semibold text-gray-200">
            Listado de jugadores
          </h2>
        </div>

        {stats && (
  <div className="grid gap-4 md:grid-cols-5 mt-4">

    <StatCard label="Registrados" value={stats.total} />
    <StatCard label="Incompletos" value={stats.incompletos} />
    <StatCard label="Pendientes" value={stats.pendientes} />
    <StatCard label="Activos" value={stats.activos} />
    <StatCard label="Habilitados" value={stats.habilitados} />

  </div>
)}

        <div className="mx-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          {/* Filtros */}
          <div className="grid grid-cols-1 gap-3 mt-6 md:grid-cols-4 ">
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
          </div>

          <button
            onClick={exportToExcel}
            className="w-44 h-10 px-3 py-2 cursor-pointer ml-auto text-sm text-green-400 transition-all border rounded-md border-green-500/40 hover:bg-green-500/10 hover:text-green-200"
          >
            Exportar a Excel
          </button>

          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            disabled={filterType === "none"}
            className={`w-44 ${selectClasses} ${filterType === "none" ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            <option className="text-gray-100 bg-gray-800" value="">
              Todos
            </option>

            {(filterOptionsMap[filterType] || []).map((opt) => (
              <option
                key={opt}
                value={opt}
                className="text-gray-100 bg-gray-800"
              >
                {opt === "true" ? "Sí" : opt === "false" ? "No" : opt}
              </option>
            ))}
          </select>
        </div>


        {/* Tabla */}
        <p className="text-sm text-gray-300 mt-2">
  Mostrando {filteredPlayers.length} de {stats?.total || players.length} jugadores
</p>
        <div className="m-4 overflow-x-auto shadow-xl rounded-2xl bg-white/90 backdrop-blur">
          <table className="min-w-full text-sm">
            <thead className="text-gray-100 bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-center select-none">Apellido</th>
                <th className="px-4 py-3 text-center select-none">Nombre</th>
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
              {paginatedPlayers.map((player) => (
                <tr key={player.id}>
                  <td className="px-4 py-2 text-center">{capitalizeUpper(player.apellido)}</td>
                  <td className="px-4 py-2 text-center">{capitalize(player.nombre)}</td>
                  <td className="px-4 py-2 text-center">{normalizeDNI(player.dni)}</td>

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
                        className="cursor-pointer px-3 py-1 text-xs font-medium text-white bg-purple-600 rounded hover:bg-purple-500"
                      >
                        Becar
                      </button>
                    ) : (
                      <span
                        className={"px-3 py-1 rounded-full text-sm font-semibold bg-green-800 text-green-400"}
                      >No requerido</span>
                    )}
                  </td>

                  <td className="px-4 py-2 flex justify-center">
                    <button
                      onClick={() =>
                        navigate(`/asambal/jugadores/${player.id}`)
                      }
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
    </div >
  );
}

import {
  UsersIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const config = {
  Registrados: {
    icon: UsersIcon,
    color: "text-blue-400 border-blue-500/30 hover:bg-blue-500/10",
  },
  Incompletos: {
    icon: ExclamationTriangleIcon,
    color: "text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/10",
  },
  Pendientes: {
    icon: ClockIcon,
    color: "text-orange-400 border-orange-500/30 hover:bg-orange-500/10",
  },
  Activos: {
    icon: CheckCircleIcon,
    color: "text-green-400 border-green-500/30 hover:bg-green-500/10",
  },
  Habilitados: {
    icon: ShieldCheckIcon,
    color: "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10",
  },
};

function StatCard({ label, value, onClick }) {
  const cfg = config[label] || {};
  const Icon = cfg.icon;

  return (
    <div
      onClick={onClick}
      className={`p-5 border rounded-xl bg-gray-800/60 backdrop-blur transition-all duration-200 cursor-pointer
      hover:scale-[1.02] hover:shadow-lg ${cfg.color || "border-gray-500/30"}`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-300">{label}</p>
        {Icon && <Icon className="w-5 h-5" />}
      </div>

      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

export default PlayerListAsambal;
