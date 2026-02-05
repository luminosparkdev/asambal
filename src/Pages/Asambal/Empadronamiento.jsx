import { useEffect, useState } from "react";
import api from "../../Api/Api";
import Swal from "sweetalert2";

function Empadronamiento() {
  const [loading, setLoading] = useState(true);
  const [empadronamiento, setEmpadronamiento] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchEmpadronamientoActivo();
  }, []);

  const fetchEmpadronamientoActivo = async () => {
    try {
      setLoading(true);
      const res = await api.get("/asambal/empadronamiento/activo");
      setEmpadronamiento(res.data || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const crearEmpadronamiento = async () => {
    const confirm = await Swal.fire({
      title: "¿Crear empadronamiento?",
      text: "Se generarán los tickets para todos los jugadores no becados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.post("/asambal/empadronamiento", {
        year,
        amount: Number(amount),
      });

      Swal.fire("Listo", "Empadronamiento creado correctamente", "success");
      setAmount("");
      fetchEmpadronamientoActivo();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo crear el empadronamiento", "error");
    }
  };

  if (loading) {
    return (
      <p className="mt-10 text-center text-gray-200">
        Cargando empadronamiento...
      </p>
    );
  }

const formatCurrency = (value) => {
  if (!value) return "";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(value);
};

const parseCurrency = (value) => {
  return Number(value.replace(/[^\d]/g, ""));
};

  return (
    <div className="min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
      <div className="px-4 mx-auto max-w-7xl">

        {/* Título */}
        <div className="px-2 py-6">
          <h2 className="text-2xl font-semibold text-gray-200">
            Empadronamiento
            <span className="text-yellow-600"> Anual</span>
          </h2>
        </div>

        {/* Crear empadronamiento */}
        {!empadronamiento && (
          <div className="max-w-xl p-6 shadow-xl bg-white/90 backdrop-blur rounded-2xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Crear nuevo empadronamiento
            </h3>

            <div className="flex flex-col gap-4">
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="h-10 px-3 border border-gray-400 rounded-lg"
                placeholder="Año"
              />

<input
  type="text"
  value={formatCurrency(amount)}
  onChange={(e) => {
    const rawValue = parseCurrency(e.target.value);
    setAmount(rawValue);
  }}
  className="h-10 px-3 border border-gray-400 rounded-lg"
  placeholder="$ 0"
/>

              <button
                onClick={crearEmpadronamiento}
                className="h-10 text-gray-100 transition bg-green-700 rounded-lg hover:bg-green-600"
              >
                Crear empadronamiento
              </button>
            </div>
          </div>
        )}

        {/* Empadronamiento activo */}
        {empadronamiento && (
          <div className="grid gap-6 mt-6 md:grid-cols-4">

            <StatCard
              label="Jugadores"
              value={empadronamiento.stats.totalJugadores}
            />
            <StatCard
              label="Becados"
              value={empadronamiento.stats.becados}
            />
            <StatCard
              label="Pendientes"
              value={empadronamiento.stats.pendientes}
            />
            <StatCard
              label="Habilitados"
              value={empadronamiento.stats.habilitados}
            />

          </div>
        )}

      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="p-6 shadow-xl bg-white/90 backdrop-blur rounded-2xl">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

export default Empadronamiento;
