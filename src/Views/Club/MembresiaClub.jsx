import { useEffect, useState } from "react";
import api from "../../Api/Api";
import Swal from "sweetalert2";

function MembresiaClub() {
  const [loading, setLoading] = useState(true);
  const [membresias, setMembresias] = useState([]);

  useEffect(() => {
    fetchMembresias();
  }, []);

  const fetchMembresias = async () => {
    try {
      setLoading(true);
      const res = await api.get("/clubs/membresias");
      console.log("🧾 membresias response:", res.data);
      console.log("🎟️ membresias state:", membresias);
      setMembresias(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const notificarPago = async (membresia) => {

  const confirm = await Swal.fire({
    title: "¿Notificar pago?",
    text: "Se avisará a Asambal para validar la cuota",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Notificar",
    cancelButtonText: "Cancelar"
  });

  if (!confirm.isConfirmed) return;

  try {

    await api.patch(`/clubs/membresias/ticket/${membresia.ticketId}/notificar`);

    await Swal.fire({
      icon: "success",
      title: "Pago notificado",
      timer: 1500,
      showConfirmButton: false
    });

    fetchMembresias();

  } catch (error) {

    console.error(error);

    Swal.fire("Error", "No se pudo notificar el pago", "error");

  }
};

  if (loading) {
    return (
      <p className="mt-10 text-center text-gray-200">
        Cargando membresias...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="px-2 py-6">
          <h2 className="text-2xl font-semibold text-gray-200">
            Mis <span className="text-yellow-600">Membresías</span>
          </h2>
        </div>

        <div className="grid gap-6 mt-6 md:grid-cols-3">
          {membresias.map((membresia) => (
            <MembresiaCard
              key={membresia.ticketId}
              membresia={membresia}
              onNotify={()=> notificarPago(membresia)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MembresiaCard({ membresia, onNotify }) {
  return (
    <div className="p-6 shadow-xl bg-white/90 backdrop-blur rounded-2xl">
      <p className="text-sm text-gray-600">Año: {membresia.year}</p>
      <p className="text-sm text-gray-600">Cuota: {membresia.cuotaNumber}</p>
      <p className="text-sm text-gray-600">Vence: {membresia.dueDate}</p>
      <p className="text-lg font-semibold text-gray-800">Importe:
        ${membresia.amount.toLocaleString("es-AR")}
      </p>
      <p className="text-sm text-gray-600">Estado: {membresia.status}</p>

      {membresia.status === "pendiente" && (
        <button
          onClick={onPay}
          className="w-full h-10 mt-4 text-gray-100 bg-green-700 rounded-lg hover:bg-green-600"
        >
          PAGAR
        </button>
      )}

      {membresia.status === "adeudada" && (
        <button
          onClick={onNotify}
          className="w-full h-10 mt-4 text-gray-100 bg-blue-700 rounded-lg hover:bg-blue-600"
        >
        NOTIFICAR PAGO
        </button>
      )}
    </div>
  );
}

export default MembresiaClub;
