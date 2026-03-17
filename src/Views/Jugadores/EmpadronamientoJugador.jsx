import { useEffect, useState } from "react";
import api from "../../Api/Api";
import Swal from "sweetalert2";

const formatMoney = (value) => {
  if (value === undefined || value === null) return "$0";

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(Number(value));
};

const isUnlocked = (activationDate) => {
  if (!activationDate) return true;

  const date =
    activationDate?._seconds
      ? new Date(activationDate._seconds * 1000)
      : new Date(activationDate);

  return new Date() >= date;
};

function EmpadronamientoJugador() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const res = await api.get("/players/empadronamiento/tickets");

      setTickets(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const pagarCuota = async (ticket, cuota) => {
    const confirm = await Swal.fire({
      title: "¿Ir a pagar la cuota?",
      text: `Cuota ${cuota.number} - ${formatMoney(cuota.amount)}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ir a pagar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await api.post("/pagos/crear-preferencia", {
        tipo: "empadronamiento",
        ticketId: ticket.ticketId,
        cuotaNumero: cuota.number
      });

      if (!res.data?.init_point) {
        throw new Error("No se recibió URL de pago");
      }

      window.location.href = res.data.init_point;

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo iniciar el pago", "error");
    }
  };

  if (loading) {
    return (
      <p className="mt-10 text-center text-gray-200">
        Cargando empadronamientos...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/src/Assets/Asambal/fondodashboard.webp')]">
      <div className="px-4 mx-auto max-w-7xl">

        <div className="px-2 py-6">
          <h2 className="text-2xl font-semibold text-gray-200">
            Mis <span className="text-yellow-600">Empadronamientos</span>
          </h2>
        </div>

        <div className="grid gap-6 mt-6 md:grid-cols-2">
          {tickets.map((ticket) => (
            <TicketTimeline
              key={ticket.ticketId}
              ticket={ticket}
              onPay={pagarCuota}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

function TicketTimeline({ ticket, onPay }) {

  const cuotas = [...ticket.cuotas].sort((a, b) => a.number - b.number);

  return (
    <div className="p-6 shadow-xl bg-white/90 backdrop-blur rounded-2xl">

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Empadronamiento
        </p>

        <p className="text-xl font-semibold text-gray-800">
          {ticket.year}
        </p>
      </div>

      <div className="flex flex-col gap-4">

        {cuotas.map((cuota) => {

          const unlocked = isUnlocked(cuota.activationDate);
          const isPaid = cuota.status === "acreditado";
          const isBecado = ticket.becado;

          return (
            <div
              key={cuota.number}
              className={`flex items-center justify-between p-4 rounded-lg border
              ${!unlocked ? "opacity-50" : ""}
              `}
            >

              <div>

                <p className="font-semibold text-gray-700">
                  Cuota {cuota.number}
                </p>

                <p className="text-sm text-gray-600">
                  {formatMoney(cuota.amount)}
                </p>

              </div>

              <div>

                {isBecado && (
                  <span className="text-sm font-semibold text-blue-700">
                    Becado
                  </span>
                )}

                {!isBecado && isPaid && (
                  <span className="text-sm font-semibold text-green-700">
                    Pagado ✔
                  </span>
                )}

                {!isBecado && !isPaid && unlocked && (
                  <button
                    onClick={() => onPay(ticket, cuota)}
                    className="h-9 px-4 text-gray-100 bg-green-700 rounded-lg hover:bg-green-600"
                  >
                    Pagar
                  </button>
                )}

                {!isBecado && !unlocked && (
                  <span className="text-sm text-gray-500">
                    Próximamente
                  </span>
                )}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default EmpadronamientoJugador;