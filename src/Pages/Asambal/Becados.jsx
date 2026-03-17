import { useEffect, useState } from "react";
import api from "../../Api/Api";
import Swal from "sweetalert2";
import { XCircleIcon } from "@heroicons/react/24/outline";

function Becados() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterClub, setFilterClub] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    fetchBecados();
  }, []);

  const fetchBecados = async () => {
    try {
      setLoading(true);
      const res = await api.get("/asambal/players-with-scholarship");
      setPlayers(res.data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar los becados", "error");
    } finally {
      setLoading(false);
    }
  };

  const revokeScholarship = async (playerId) => {
    const confirm = await Swal.fire({
      title: "¿Quitar beca?",
      text: "El jugador quedará inhabilitado para jugar hasta pagar el empadronamiento.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, quitar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.post(`/asambal/becas/${playerId}/revoke-scholarship`);
      Swal.fire("Listo", "La beca fue revocada", "success");
      fetchBecados();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo revocar la beca", "error");
    }
  };

  if (loading) {
    return (
      <p className="mt-10 text-center text-gray-200">
        Cargando becados...
      </p>
    );
  }

  const availableClubs = [
  ...new Set(
    players
      .flatMap(p => p.clubs || [])
      .map(c => c.nombreClub)
      .filter(Boolean)
  ),
].sort();

const availableCategories = [
  ...new Set(
    players
      .flatMap(p => p.clubs || [])
      .flatMap(c => c.categorias || [])
      .filter(Boolean)
  ),
].sort();

const filteredPlayers = players.filter((player) => {
  const fullName = `${player.nombre} ${player.apellido}`.toLowerCase();

  const matchSearch =
    search === "" || fullName.includes(search.toLowerCase());

  const matchClub =
    filterClub === "" ||
    player.clubs?.some(c => c.nombreClub === filterClub);

  const matchCategory =
    filterCategory === "" ||
    player.clubs?.some(c =>
      (c.categorias || []).includes(filterCategory)
    );

  return matchSearch && matchClub && matchCategory;
});

const selectClasses =
    "h-10 px-3 text-gray-200 border border-gray-500 rounded-lg bg-slate-700";


  return (
    <div className="min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
      <div className="px-4 mx-auto max-w-7xl">

        {/* Título */}
        <div className="px-2 py-6">
          <h2 className="text-2xl font-semibold text-gray-200">
            Jugadores
            <span className="text-yellow-600"> Becados</span>
          </h2>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <input
                type="text"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 px-3 text-gray-200 placeholder-gray-200 border border-gray-500 rounded-lg bg-gradient-to-r from-gray-800/80 to-transparent"
            />

            <select
                value={filterClub}
                onChange={(e) => setFilterClub(e.target.value)}
                className={selectClasses}
            >
                <option value="">Todos los clubes</option>
                {availableClubs.map((club) => (
                    <option key={club} value={club}>
                        {club}
                    </option> 
                ))}
            </select>

            <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={selectClasses}
            >
                <option value="">Todas las categorías</option>
                {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>
        </div>

        {filteredPlayers.length === 0 ? (
          <p className="text-gray-300">
            No hay jugadores con beca activa.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto shadow-xl rounded-2xl bg-white/90 backdrop-blur">
            <table className="min-w-full text-sm">
              <thead className="text-gray-100 bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-center">Jugador</th>
                  <th className="px-4 py-3 text-center">Club</th>
                  <th className="px-4 py-3 text-center">Categorías</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-300">
                {filteredPlayers.map((player) => (
                  <tr key={player.id}>
                    <td className="px-4 py-2 text-center">
                      {player.nombre} {player.apellido}
                    </td>

                    <td className="px-4 py-2 text-center max-w-40">
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {player.clubs?.[0]?.nombreClub || "—"}
                      </div>
                    </td>

                    <td className="px-4 py-2 text-center max-w-64">
                      <div className="flex flex-wrap justify-center gap-1">
                        {(player.clubs || [])
                          .flatMap(c => c.categorias || [])
                          .map((cat, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full"
                            >
                              {cat}
                            </span>
                          ))}
                      </div>
                    </td>

                    <td className="px-4 py-2">
                      <div className="flex justify-center">
                        <button
                          onClick={() => revokeScholarship(player.id)}
                          className="flex items-center gap-1 px-3 py-1 w-32 text-sm text-gray-200 bg-red-700/95 rounded-md hover:bg-red-500 transition-all"
                        >
                          <XCircleIcon className="w-4 h-4" />
                          <span>Quitar beca</span>  
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Becados;
