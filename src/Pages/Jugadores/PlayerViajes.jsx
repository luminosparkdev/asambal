import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
    FaMapMarkerAlt,
    FaClock,
    FaMoneyBillAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../Api/Api";

export default function PlayerViajes() {

    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {

            Swal.fire(
                "Error",
                "Debes iniciar sesión",
                "error"
            );

            navigate("/login");

            return;
        }

        fetchViajes();

    }, []);

    const fetchViajes = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await api.get(
                "/viajes/jugador/mis-viajes",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setViajes(res.data || []);

        } catch (error) {

            console.error(error);

            Swal.fire(
                "Error",
                "No se pudieron cargar los viajes",
                "error"
            );

        } finally {

            setLoading(false);
        }
    };

    const responderViaje = async (viajeId, estado) => {

        try {

            const token = localStorage.getItem("token");

            await api.patch(
                `/viajes/${viajeId}/responder`,
                {
                    estado,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Swal.fire({
                icon: "success",
                title:
                    estado === "ACEPTADO"
                        ? "Viaje aceptado"
                        : "Viaje rechazado",
                timer: 1800,
                showConfirmButton: false,
            });

            setViajes((prev) =>
                prev.map((viaje) =>
                    viaje.viajeId === viajeId
                        ? {
                            ...viaje,
                            estado,
                        }
                        : viaje
                )
            );

        } catch (error) {

            console.error(error);

            Swal.fire(
                "Error",
                error?.response?.data?.message ||
                "No se pudo responder el viaje",
                "error"
            );
        }
    };

    const handleNotificarPago = async (viajeId) => {

        try {

            const token = localStorage.getItem("token");

            const { value: file } = await Swal.fire({
                title: "Adjuntar comprobante",
                input: "file",
                inputAttributes: {
                    accept: "image/*,application/pdf",
                },
                showCancelButton: true,
            });

            if (!file) return;

            const formData = new FormData();

            formData.append("comprobante", file);

            await api.patch(
                `/viajes/${viajeId}/notificarPago`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setViajes((prev) =>
                prev.map((viaje) =>
                    viaje.viajeId === viajeId
                        ? {
                            ...viaje,
                            pagoNotificado: true,
                            estado: "PENDIENTE",
                        }
                        : viaje
                )
            );

            Swal.fire(
                "Éxito",
                "Comprobante enviado correctamente",
                "success"
            );

        } catch (error) {

            console.error(error);

            Swal.fire(
                "Error",
                error?.response?.data?.message ||
                "No se pudo enviar el comprobante",
                "error"
            );
        }
    };

    const formatCurrency = (value) => {

        return new Intl.NumberFormat(
            "es-AR",
            {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 0,
            }
        ).format(value || 0);
    };

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleDateString("es-AR");
    };

    const getEstadoColor = (estado) => {

        switch (estado) {

            case "ACEPTADO":
                return "bg-green-600";

            case "CONFIRMADO":
                return "bg-green-600";

            case "RECHAZADO":
                return "bg-red-600";

            case "EN ESPERA":
                return "bg-yellow-500";

            case "PENDIENTE":
                return "bg-orange-500";

            default:
                return "bg-blue-600";
        }
    };

    if (loading) {

        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>

                    <p className="text-gray-300">
                        Cargando viajes...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="select-none relative flex items-center justify-center min-h-[80vh] px-4 bg-[url('/src/assets/Asambal/fondodashboard.webp')]">

            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.97
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                }}
                transition={{
                    duration: 0.3
                }}
                className="w-full max-w-5xl p-6 bg-transparent border border-gray-500 shadow-xl backdrop-blur rounded-2xl"
            >

                <h1 className="mb-1 text-2xl font-bold text-gray-200">
                    Mis Viajes
                </h1>

                <p className="mb-6 text-sm text-gray-300">
                    Gestiona tus invitaciones y confirmaciones
                </p>

                {
                    viajes.length === 0
                        ? (
                            <p className="mt-10 text-center text-gray-300">
                                No tienes viajes disponibles.
                            </p>
                        )
                        : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                                {
                                    viajes.map((viaje) => (

                                        <div
                                            key={viaje.viajeId}
                                            className="p-5 bg-gray-800 border border-gray-700 shadow-xl rounded-2xl"
                                        >

                                            <div className="flex items-center justify-between mb-4">

                                                <span className="text-sm text-gray-400">
                                                    {formatDate(viaje.fechaSalida)}
                                                </span>

                                                <span className={`px-3 py-1 text-xs text-white rounded-full ${getEstadoColor(viaje.estado)}`}>
                                                    {viaje.estado}
                                                </span>

                                            </div>

                                            <h2 className="mb-4 text-2xl font-bold text-white">
                                                {viaje.destino}
                                            </h2>

                                            <div className="space-y-3 text-gray-300">

                                                <div className="flex items-center gap-2">
                                                    <FaMapMarkerAlt />

                                                    <span>
                                                        {viaje.destino}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <FaClock />

                                                    <span>
                                                        {viaje.horaSalida}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <FaMoneyBillAlt />

                                                    <span>
                                                        {formatCurrency(viaje.monto)}
                                                    </span>
                                                </div>

                                            </div>

                                            {
                                                viaje.estado === "INVITADO" && (

                                                    <div className="flex gap-3 mt-6">

                                                        <button
                                                            onClick={() =>
                                                                responderViaje(
                                                                    viaje.viajeId,
                                                                    "ACEPTADO"
                                                                )
                                                            }
                                                            className="flex-1 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                                                        >
                                                            Aceptar
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                responderViaje(
                                                                    viaje.viajeId,
                                                                    "RECHAZADO"
                                                                )
                                                            }
                                                            className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                                                        >
                                                            Rechazar
                                                        </button>

                                                    </div>
                                                )
                                            }

                                            {
                                                viaje.estado === "ACEPTADO" && (

                                                    <div className="mt-6">

                                                        {
                                                            viaje.pagoNotificado ? (

                                                                <button
                                                                    disabled
                                                                    className="w-full px-4 py-2 font-semibold text-white bg-gray-600 cursor-not-allowed rounded-lg"
                                                                >
                                                                    Comprobante enviado
                                                                </button>

                                                            ) : (

                                                                <button
                                                                    onClick={() =>
                                                                        handleNotificarPago(
                                                                            viaje.viajeId
                                                                        )
                                                                    }
                                                                    className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                                                >
                                                                    Notificar Pago
                                                                </button>

                                                            )
                                                        }

                                                    </div>
                                                )
                                            }

                                        </div>
                                    ))
                                }

                            </div>
                        )
                }

            </motion.div>

        </div>
    );
}