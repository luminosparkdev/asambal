import { motion } from "framer-motion";
import { useRef } from "react";
import api from "../../Api/Api";
import { useAuth } from "../../Auth/AuthContext";
import { showToast } from "../../Utils/toaster";

export default function CuotaCard({ cuota }) {
  const { user } = useAuth();

  const {
    mes,
    anio,
    categoriaNombre,
    monto,
    estado,
    fechaVencimientoActual,
  } = cuota;

  const fileInputRef = useRef();

  const fecha = new Date(fechaVencimientoActual._seconds * 1000);

  const formatPeriodo = (mes, anio) => {
    const meses = [
      "Enero","Febrero","Marzo","Abril",
      "Mayo","Junio","Julio","Agosto",
      "Septiembre","Octubre","Noviembre","Diciembre"
    ];
    return `${meses[mes - 1]} ${anio}`;
  };

  const estadoConfig = {
    ACREDITADO: {
      color: "text-green-400",
      border: "border-green-400",
      label: "Pago acreditado",
    },
    PENDIENTE: {
      color: "text-yellow-400",
      border: "border-yellow-400",
      label: "En revisión",
    },
    RECHAZADO: {
      color: "text-red-400",
      border: "border-red-400",
      label: "Comprobante rechazado",
    },
    VENCIDO: {
      color: "text-red-700",
      border: "border-red-700",
      label: "Cuota vencida",
    },
    ADEUDADO: {
      color: "text-red-500/90",
      border: "border-red-500/90",
      label: "Pendiente de pago",
    },
  };

  const config = estadoConfig[estado] || estadoConfig.ADEUDADO;

  const puedeSubirComprobante =
    estado === "ADEUDADO" || estado === "RECHAZADO";

  const getCountdown = () => {
  if (!fechaVencimientoActual) return null;
  if (estado === "ACREDITADO") return null;

  const now = new Date();
  const vencimiento = new Date(fechaVencimientoActual._seconds * 1000);

  // Normalizamos a inicio de día para evitar bugs por horas
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDue = new Date(
    vencimiento.getFullYear(),
    vencimiento.getMonth(),
    vencimiento.getDate()
  );

  const diffMs = startOfDue - startOfToday;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (estado === "ACREDITADO") return null;

  if (diffDays < 0) {
    return {
      text: "Para notificar el pago deberás contactar al administrador de tu club y solicitarle una prórroga",
      textColor: "text-red-700",
      bgColor: "bg-red-400/90",
    };
  }

  if (diffDays === 0) {
    return {
      text: "Vence hoy",
      textColor: "text-red-700",
      bgColor: "bg-red-400/90",
    };
  }

  if (diffDays === 1) {
    return {
      text: "Vence mañana",
      textColor: "text-red-700",
      bgColor: "bg-red-400/90",
    };
  }

  if (diffDays <= 3) {
    return {
      text: `Vence en ${diffDays} días`,
      textColor: "text-red-700",
      bgColor: "bg-red-400/90",
    };
  }

  if (diffDays <= 7) {
    return {
      text: `Vence en ${diffDays} días`,
      textColor: "text-yellow-700",
      bgColor: "bg-yellow-400/90",
    };
  }

  return {
    text: `Vence en ${diffDays} días`,
    textColor: "text-gray-700",
    bgColor: "bg-gray-400/90",
  };
};


  const countdown = getCountdown();

  const getButtonConfig = () => {
  switch (estado) {
    case "ADEUDADO":
      return {
        show: true,
        label: "Notificar pago",
      };
    case "RECHAZADO":
      return {
        show: true,
        label: "Reintentar pago",
      };
    default:
      return {
        show: false,
      };
  }
};

const buttonConfig = getButtonConfig();

const handleClickUpload = () => {
  fileInputRef.current.click();
};

const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("file", file);

    await api.post(
      `/cuotas/upload-comprobante/${cuota.id}/${user.id}`,
      formData,
    );

    showToast("success", "Comprobante enviado correctamente");

    // 🔥 importante: refrescar cuotas
    window.location.reload();
  } catch (err) {
    console.error(err);
    alert("Error al subir comprobante");
  }
};

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className={`p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-l-4 ${config.border} transition hover:-translate-y-1 hover:shadow-2xl`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">
          {formatPeriodo(mes, anio)}
        </h2>

        <span className={`text-sm font-semibold ${config.color} `}>
          {estado}
        </span>
      </div>

      {/* INFO */}
      <div className="mt-3 text-sm text-gray-700 space-y-1">
        <p><b>Categoría:</b> {categoriaNombre}</p>
        <p><b>Monto:</b> ${monto}</p>
        <p><b>Vence:</b> {fecha.toLocaleDateString()}</p>
      </div>

      {countdown && (
        <div
          className={`mt-3 px-3 py-2 text-sm font-semibold rounded-lg ${countdown.textColor} ${countdown.bgColor}`}
        >
          {countdown.text}
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-4 flex justify-between items-center">
        <span className={`text-xs ${config.color}`}>
          {config.label}
        </span>

        {buttonConfig.show && (
  <button
    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
    onClick={handleClickUpload}
  >
    {buttonConfig.label}
  </button>
)}
<input
  type="file"
  accept="image/*"
  ref={fileInputRef}
  onChange={handleFileChange}
  hidden
/>
      </div>
    </motion.div>
  );
}