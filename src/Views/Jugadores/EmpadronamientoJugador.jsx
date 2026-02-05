import { useEffect, useState } from "react";
import api from "../../Api/Api";
import Swal from "sweetalert2";

function EmpadronamientoJugador() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/players/tickets");
      console.log("🧾 tickets response:", res.data);
      console.log("🎟️ tickets state:", tickets);
      setTickets(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const pagarTicket = async (ticketId) => {
    const confirm = await Swal.fire({
      title: "¿Confirmar pago?",
      text: "Se actualizará el estado del ticket a pagado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Pagar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.post(`/players/tickets/${ticketId}/pay`);
      Swal.fire("Listo", "Ticket pagado correctamente", "success");
      fetchTickets();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo pagar el ticket", "error");
    }
  };

  if (loading) {
    return (
      <p className="mt-10 text-center text-gray-200">
        Cargando tickets...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="px-2 py-6">
          <h2 className="text-2xl font-semibold text-gray-200">
            Mis <span className="text-yellow-600">Empadronamientos</span>
          </h2>
        </div>

        <div className="grid gap-6 mt-6 md:grid-cols-3">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.ticketId}
              ticket={ticket}
              onPay={() => pagarTicket(ticket.ticketId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TicketCard({ ticket, onPay }) {
  return (
    <div className="p-6 shadow-xl bg-white/90 backdrop-blur rounded-2xl">
      <p className="text-sm text-gray-600">Año: {ticket.year}</p>
      <p className="text-lg font-semibold text-gray-800">
        ${ticket.amount.toLocaleString("es-AR")}
      </p>
      <p className="text-sm text-gray-600">Estado: {ticket.status}</p>

      {ticket.status === "pendiente" && (
        <button
          onClick={onPay}
          className="w-full h-10 mt-4 text-gray-100 bg-green-700 rounded-lg hover:bg-green-600"
        >
          PAGAR
        </button>
      )}

      {ticket.status === "pagado" && (
        <p className="mt-4 text-sm font-semibold text-green-700">
          Pagado ✔
        </p>
      )}
    </div>
  );
}

export default EmpadronamientoJugador;
