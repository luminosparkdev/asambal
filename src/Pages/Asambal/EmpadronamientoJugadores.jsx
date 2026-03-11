import { useEffect, useState } from "react";
import api from "../../Api/Api";
import Swal from "sweetalert2";

function EmpadronamientoJugadores() {
  const [loading, setLoading] = useState(true);
  const [empadronamientoJugadores, setEmpadronamientoJugadores] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [cuotas, setCuotas] = useState([
    {amount: "", activationDate: ""},
    {amount: "", activationDate: ""},
  ]);

  useEffect(() => {
    fetchEmpadronamientoJugadoresActivo();
  }, []);

  const fetchEmpadronamientoJugadoresActivo = async () => {
    try {
      setLoading(true);
      const res = await api.get("/asambal/empadronamiento-jugadores/activo");
      setEmpadronamientoJugadores(res.data || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const crearEmpadronamientoJugadores = async () => {
    const confirm = await Swal.fire({
      title: "¿Crear empadronamiento de jugadores?",
      text: "Se generarán los tickets para todos los jugadores.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.post("/asambal/empadronamiento-jugadores", {
        year,
        cuotas: [
    {
      amount: Number(cuotas[0].amount),
      activationDate: cuotas[0].activationDate
    },
    {
      amount: Number(cuotas[1].amount),
      activationDate: addDays(cuotas[0].activationDate, 45)
    }
  ]
      });

      Swal.fire("Listo", "Empadronamiento de jugadores creado correctamente", "success");
      setCuotas([
        { amount: "", activationDate: "" },
        { amount: "", activationDate: "" },
      ]);
      fetchEmpadronamientoJugadoresActivo();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo crear el empadronamiento de jugadores", "error");
    }
  };

  if (loading) {
    return (
      <p className="mt-10 text-center text-gray-200">
        Cargando empadronamiento de jugadores...
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

const updateCuota = (index, field, value) => {
  const nuevasCuotas = [...cuotas];
  nuevasCuotas[index][field] = value;
  setCuotas(nuevasCuotas);
};

const addDays = (dateString, days) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  date.setDate(date.getDate() + days);

  return date.toISOString().split("T")[0];
};

const cuota2Date = addDays(cuotas[0].activationDate, 45);

const formatDate = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(timestamp._seconds * 1000);

  return date.toLocaleDateString("es-AR");
};

  return (
    <div className="min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
      <div className="px-4 mx-auto max-w-7xl">

        {/* Título */}
        <div className="px-2 py-6">
          <h2 className="text-2xl font-semibold text-gray-200">
            Empadronamiento de jugadores
            <span className="text-yellow-600"> Anual</span>
          </h2>
        </div>

        {/* Crear empadronamiento de jugadores */}
        {!empadronamientoJugadores && (
          <div className="max-w-xl p-6 shadow-xl bg-white/90 backdrop-blur rounded-2xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Crear nuevo empadronamiento de jugadores
            </h3>

            <div className="flex flex-col gap-4">
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="h-10 px-3 border border-gray-400 rounded-lg"
                placeholder="Año"
              />

              {cuotas.map((cuota, index) => (
              <div key={index} className="grid grid-cols-3 gap-3">

              <div className="flex items-center text-sm font-medium text-gray-700">
                Cuota {index + 1}
              </div>

              <input
                type="text"
                value={formatCurrency(cuota.amount)}
                onChange={(e) => {
                  const raw = parseCurrency(e.target.value);
                updateCuota(index, "amount", raw);
                }}
                className="h-10 px-3 border border-gray-400 rounded-lg"
                placeholder="$ 0"
              />

              {index === 0 ? (
      <input
        type="date"
        value={cuota.activationDate || ""}
        onChange={(e) =>
          updateCuota(index, "activationDate", e.target.value)
        }
        className="h-10 px-3 border border-gray-400 rounded-lg"
      />
    ) : (
      <div className="flex items-center h-10 px-3 border border-gray-300 rounded-lg bg-gray-100">
        {cuota2Date || "dd/mm/aaaa"}
      </div>
    )}
            </div>
            ))}

            <button
              onClick={crearEmpadronamientoJugadores}
              className="h-10 text-gray-100 transition bg-green-700 rounded-lg hover:bg-green-600"
            >
              Crear empadronamiento de jugadores
            </button>
          </div>
        </div>
        )}

        {/* Empadronamiento de jugadores activo */}
        {empadronamientoJugadores && (
  <div className="flex flex-col gap-6 mt-6">

    {/* CUOTAS */}
    <div className="p-6 shadow-xl bg-white/90 backdrop-blur rounded-2xl">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Empadronamiento de jugadores {empadronamientoJugadores.year}
      </h3>

      <div className="grid grid-cols-3 gap-4">
        {empadronamientoJugadores.cuotas.map((cuota) => (
          <div
            key={cuota.number}
            className="p-4 border rounded-lg bg-gray-50"
          >
            <p className="text-sm text-gray-600">
              Cuota {cuota.number}
            </p>

            <p className="text-xl font-bold text-gray-800">
              {formatCurrency(cuota.amount)}
            </p>

            <p className="text-sm text-gray-500">
              Habilitada: {formatDate(cuota.activationDate)}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* STATS */}
   {/* <div className="grid gap-6 md:grid-cols-3">
      <StatCard
        label="Jugadores"
        value={membresias.stats.totalJugadores}
      />
      <StatCard
        label="Pendientes"
        value={membresias.stats.pendientes}
      />
      <StatCard
        label="Habilitados"
        value={membresias.stats.habilitados}
      />
    </div>*/}

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

export default EmpadronamientoJugadores;
