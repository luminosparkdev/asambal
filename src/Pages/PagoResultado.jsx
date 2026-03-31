import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/solid";

function PagoResultado({ tipo }) {
  const config = {
    exito: {
      titulo: "Pago realizado",
      mensaje: "Tu pago fue procesado correctamente. Para volver al panel presioná el botón Ir al dashboard",
      icon: CheckCircleIcon,
      color: "text-green-500",
    },
    pendiente: {
      titulo: "Pago en proceso",
      mensaje: "Estamos procesando tu pago. Para volver al panel presioná el botón Ir al dashboard",
      icon: ClockIcon,
      color: "text-yellow-500",
    },
    fallido: {
      titulo: "Pago no completado",
      mensaje: "Hubo un problema al procesar el pago. Para volver al panel presioná el botón Ir al dashboard",
      icon: XCircleIcon,
      color: "text-red-500",
    },
  };

  const data = config[tipo];
  const Icon = data.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/src/assets/Asambal/fondodashboard.webp')] px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <Icon className={`w-16 h-16 mx-auto mb-4 ${data.color}`} />

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          {data.titulo}
        </h1>

        <p className="text-gray-500 mb-6">{data.mensaje}</p>

        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="w-full bg-primary hover:opacity-90 text-white font-medium py-2 px-4 rounded-xl transition"
        >
          Ir al dashboard
        </button>
      </div>
    </div>
  );
}

export default PagoResultado;

export const PagoExitoso = () => <PagoResultado tipo="exito" />;
export const PagoPendiente = () => <PagoResultado tipo="pendiente" />;
export const PagoFallido = () => <PagoResultado tipo="fallido" />;
