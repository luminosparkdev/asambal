import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import api from "../../Api/Api";

function ViajesJugador() {

    const [loading, setLoading] = useState(true);
    const [viajes, setViajes] = useState([]);

    useEffect(() => {
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
                { estado },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Swal.fire(
                "Éxito",
                `Has ${estado === "CONFIRMADO"
                    ? "confirmado"
                    : "rechazado"
                } el viaje`,
                "success"
            );

            fetchViajes();

        } catch (error) {

            console.error(error);

            Swal.fire(
                "Error",
                "No se pudo responder el viaje",
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

        return new Date(date).toLocaleDateString("es-AR");
    };

    const getEstadoColor = (estado) => {

        switch (estado) {

            case "CONFIRMADO":
                return "bg-green-500";

            case "RECHAZADO":
                return "bg-red-500";

            case "EN ESPERA":
                return "bg-yellow-500";

            default:
                return "bg-blue-500";
        }
    };

    if (loading) {

        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-slate-900">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto"
            >

                <h1 className="mb-2 text-3xl font-bold text-white">
                    Mis Viajes
                </h1>

                <p className="mb-8 text-gray-400">
                    Aquí puedes gestionar tus viajes
                </p>

                {
                    viajes.length === 0
                        ? (
                            <div className="p-10 text-center text-gray-400 bg-gray-800 rounded-2xl">
                                No tienes viajes disponibles
                            </div>
                        )
                        : (
                            <div className="grid gap-6 md:grid-cols-2">

                                {
                                    viajes.map((viaje) => (

                                        <div
                                            key={viaje.id}
                                            className="p-6 bg-gray-800 shadow-xl rounded-2xl"
                                        >

                                            <div className="flex items-center justify-between mb-4">

                                                <span className="text-sm text-gray-400">
                                                    {formatDate(viaje.fechaSalida)}
                                                </span>

                                                <span className={`px-3 py-1 text-xs text-white rounded-full ${getEstadoColor(viaje.estado)}`}>
                                                    {viaje.estado}
                                                </span>
                                            </div>

                                            <h2 className="mb-2 text-2xl font-bold text-white">
                                                {viaje.destino}
                                            </h2>

                                            <div className="space-y-2 text-gray-300">

                                                <p>
                                                    Hora salida: {viaje.horaSalida}
                                                </p>

                                                <p>
                                                    Monto: {formatCurrency(viaje.monto)}
                                                </p>

                                            </div>

                                            {
                                                viaje.estado === "INVITADO" && (
                                                    <div className="flex gap-4 mt-6">

                                                        <button
                                                            onClick={() =>
                                                                responderViaje(
                                                                    viaje.id,
                                                                    "CONFIRMADO"
                                                                )
                                                            }
                                                            className="flex-1 px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"
                                                        >
                                                            Aceptar
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                responderViaje(
                                                                    viaje.id,
                                                                    "RECHAZADO"
                                                                )
                                                            }
                                                            className="flex-1 px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
                                                        >
                                                            Rechazar
                                                        </button>

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

export default ViajesJugador;