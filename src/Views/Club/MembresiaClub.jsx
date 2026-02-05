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

  const pagarMembresia = async (membresiaId) => {
    const confirm = await Swal.fire({
      title: "¿Confirmar pago?",
      text: "Se actualizará el estado de la membresia a pagado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Pagar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.post(`/clubs/membresias/${membresiaId}/pay`);
      Swal.fire("Listo", "Membresia pagada correctamente", "success");
      fetchMembresias();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo pagar la membresia", "error");
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
              onPay={() => pagarMembresia(membresia.ticketId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MembresiaCard({ membresia, onPay }) {
  return (
    <div className="p-6 shadow-xl bg-white/90 backdrop-blur rounded-2xl">
      <p className="text-sm text-gray-600">Año: {membresia.year}</p>
      <p className="text-lg font-semibold text-gray-800">
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

      {membresia.status === "pagado" && (
        <p className="mt-4 text-sm font-semibold text-green-700">
          Pagado ✔
        </p>
      )}
    </div>
  );
}

export default MembresiaClub;
