import { useEffect, useState } from "react";
import api from "../../Api/Api";
import Swal from "sweetalert2";
import { PlusIcon } from "@heroicons/react/24/outline";

function Empadronamiento() {
  const currentYear = new Date().getFullYear();

  // Estados
  const [tickets, setTickets] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [clubFilter, setClubFilter] = useState("");
  const [search, setSearch] = useState("");

  // ========================================
  // FETCH
  // ========================================
  const fetchTickets = async () => {
    try {
      setLoadingTickets(true);
      const res = await api.get("/asambal/empadronamiento/tickets");
      setTickets(res.data || []);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar los tickets", "error");
    } finally {
      setLoadingTickets(false);
    }
  };

const fetchClubs = async () => {
  try {
    setLoadingClubs(true);
    const res = await api.get("/clubs");
    console.log("Respuesta clubs:", res.data); // <-- esto
    setClubs(res.data || []);
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "No se pudieron cargar los clubes", "error");
  } finally {
    setLoadingClubs(false);
  }
};

  useEffect(() => {
    fetchTickets();
    fetchClubs();
  }, []);

  // ========================================
  // SWAL - NUEVO EMPADRONAMIENTO
  // ========================================
  const seleccionarTipo = async () => {
    const result = await Swal.fire({
      title: "Nuevo empadronamiento!",
      text: "Seleccionar tipo de emisión",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Emitir ticket a jugadores",
      denyButtonText: "Emitir ticket a club",
      cancelButtonText: "Cancelar",
      background: "#0f172a",
      color: "#e5e7eb",
      confirmButtonColor: "#16a34a",
      denyButtonColor: "#2563eb",
      cancelButtonColor: "#dc2626",
    });

    if (result.isConfirmed) abrirFormulario("jugadores");
    if (result.isDenied) abrirFormulario("club");
  };

  const abrirFormulario = async (tipo) => {
    const { value: formValues } = await Swal.fire({
      title: tipo === "jugadores" ? "Emitir a jugadores" : "Emitir a club",
      html: `
        <input id="swal-year" class="swal2-input" type="number" value="${currentYear}" readonly>
        <input id="swal-amount" class="swal2-input" type="text" placeholder="$ 0">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
      background: "#0f172a",
      color: "#e5e7eb",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      didOpen: () => {
        const amountInput = Swal.getPopup().querySelector("#swal-amount");
        amountInput.addEventListener("input", (e) => {
          let value = e.target.value.replace(/[^\d]/g, "");
          e.target.value = value ? "$ " + Number(value).toLocaleString("es-AR") : "";
        });
      },
      preConfirm: () => {
        const year = Number(Swal.getPopup().querySelector("#swal-year").value);
        const amountRaw = Swal.getPopup().querySelector("#swal-amount").value.replace(/[^\d]/g, "");
        const amount = Number(amountRaw);

        if (!amount) Swal.showValidationMessage("Ingresar un monto válido");
        return { year, amount };
      },
    });

    if (!formValues) return;

    try {
      if (tipo === "jugadores") {
        await api.post("/asambal/empadronamiento", formValues);
      } else if (tipo === "club") {
        await api.post("/asambal/empadronamiento/club", formValues);
      }

      await Swal.fire({
        icon: "success",
        title: "Empadronamiento creado",
        text: "Se generaron los tickets correctamente.",
        confirmButtonText: "Aceptar",
        background: "#0f172a",
        color: "#e5e7eb",
        confirmButtonColor: "#16a34a",
      });

      fetchTickets(); // actualizar tabla
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "No se pudo crear el empadronamiento";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
        confirmButtonText: "Aceptar",
        background: "#0f172a",
        color: "#e5e7eb",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  // ========================================
  // FILTROS
  // ========================================
  const ticketsFiltrados = tickets
    .filter((t) => (clubFilter ? t.clubId === Number(clubFilter) : true))
    .filter((t) => `${t.nombre} ${t.apellido}`.toLowerCase().includes(search.toLowerCase()));

const obtenerNombreClub = (clubId) => {
  console.log("clubId a buscar:", clubId);
console.log("Lista de clubes:", clubs.map(c => c.id));
  const club = clubs.find(c => c.id === clubId);
  return club ? club.nombre : "Sin club";
  
};


  // ========================================
  // RENDER
  // ========================================
  if (loadingTickets || loadingClubs) {
    return <p className="mt-10 text-center text-gray-200">Cargando tickets de empadronamiento...</p>;
  }

  return (
    <div className="min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
      <div className="pb-6 mx-auto max-w-7xl">
        {/* Header */}
        <div className="px-2 py-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-2xl font-semibold text-gray-200">
            Empadronamiento <span className="text-yellow-600">Jugadores</span>
          </h2>
          <button
            onClick={seleccionarTipo}
            className="cursor-pointer flex items-center gap-2 h-10 px-3 text-sm text-green-400 transition-all border rounded-md border-green-500/40 hover:bg-green-500/10 hover:text-green-200"
          >
            <PlusIcon className="w-5 h-5" /> Nuevo empadronamiento
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 px-2">
          <select value={clubFilter} onChange={(e) => setClubFilter(e.target.value)} className="h-10 px-3 border rounded-lg">
            <option value="">Todos los clubes</option>
            {clubs.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 px-3 border rounded-lg" />
        </div>

        {/* Tabla de tickets */}
        <div className="mt-6 overflow-x-auto shadow-xl rounded-2xl bg-white/90 backdrop-blur">
          <table className="min-w-full text-sm">
            <thead className="text-gray-100 bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-center">Nombre</th>
                <th className="px-4 py-3 text-center">Club</th>
                <th className="px-4 py-3 text-center">Monto</th>
                <th className="px-4 py-3 text-center">Año</th>
                <th className="px-4 py-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {ticketsFiltrados.map((t) => (
                <tr key={t.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 text-center">{t.nombre}</td>
                  <td className="px-4 py-2 text-center"> {obtenerNombreClub(t.clubId)}</td>
                  <td className="px-4 py-2 text-center">{t.amount.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</td>
                  <td className="px-4 py-2 text-center">{t.year}</td>
                  <td className="px-4 py-2 text-center">{t.status}</td>
                </tr>
              ))}
              {ticketsFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-center text-gray-500">No hay tickets de empadronamiento</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Empadronamiento;
