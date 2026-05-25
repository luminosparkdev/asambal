import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import Swal from "sweetalert2";

import api from "../../Api/Api";

function ArbitrajesJugador() {

    const [loading, setLoading] =
        useState(true);

    const [arbitrajes, setArbitrajes] =
        useState([]);

    useEffect(() => {

        fetchArbitrajes();

    }, []);

    const fetchArbitrajes = async () => {

        try {

            setLoading(true);

            const token =
                localStorage.getItem("token");

            const res = await api.get(
                "/arbitrajes/jugador/mis-arbitrajes",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            setArbitrajes(
                res.data || []
            );

        } catch (error) {

            console.error(error);

            Swal.fire(
                "Error",
                "No se pudieron cargar los arbitrajes",
                "error"
            );

        } finally {

            setLoading(false);
        }
    };

    const notificarPago = async (
        arbitrajeId
    ) => {

        const { value: file } =
            await Swal.fire({
                title:
                    "Subir comprobante",
                input: "file",
                inputAttributes: {
                    accept:
                        "image/*,.pdf",
                },
                showCancelButton: true,
            });

        if (!file) return;

        try {

            const token =
                localStorage.getItem("token");

            const formData =
                new FormData();

            formData.append(
                "comprobante",
                file
            );

            await api.patch(
                `/arbitrajes/${arbitrajeId}/notificarPago`,
                formData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            Swal.fire(
                "Éxito",
                "Pago notificado correctamente",
                "success"
            );

            fetchArbitrajes();

        } catch (error) {

            console.error(error);

            Swal.fire(
                "Error",
                "No se pudo notificar el pago",
                "error"
            );
        }
    };

    const formatCurrency = (
        value
    ) => {

        return new Intl.NumberFormat(
            "es-AR",
            {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 0,
            }
        ).format(value || 0);
    };

    const getEstadoColor = (
        estado
    ) => {

        switch (estado) {

            case "PAGADO":
                return "bg-green-500";

            case "PENDIENTE":
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
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                className="max-w-5xl mx-auto"
            >

                <h1 className="mb-2 text-3xl font-bold text-white">
                    Mis Arbitrajes
                </h1>

                <p className="mb-8 text-gray-400">
                    Aquí puedes gestionar tus arbitrajes
                </p>

                {
                    arbitrajes.length === 0
                        ? (
                            <div className="p-10 text-center text-gray-400 bg-gray-800 rounded-2xl">

                                No tienes arbitrajes disponibles

                            </div>
                        )
                        : (
                            <div className="grid gap-6 md:grid-cols-2">

                                {
                                    arbitrajes.map(
                                        (
                                            arbitraje
                                        ) => (

                                            <div
                                                key={
                                                    arbitraje.id
                                                }
                                                className="p-6 bg-gray-800 shadow-xl rounded-2xl"
                                            >

                                                <div className="flex items-center justify-between mb-4">

                                                    <span className="text-sm text-gray-400">
                                                        Arbitraje
                                                    </span>

                                                    <span className={`px-3 py-1 text-xs text-white rounded-full ${getEstadoColor(arbitraje.estado)}`}>

                                                        {
                                                            arbitraje.estado
                                                        }

                                                    </span>

                                                </div>

                                                <h2 className="mb-2 text-2xl font-bold text-white">

                                                    {
                                                        arbitraje.titulo
                                                    }

                                                </h2>

                                                <div className="space-y-2 text-gray-300">

                                                    <p>
                                                        {
                                                            arbitraje.descripcion ||
                                                            "Sin descripción"
                                                        }
                                                    </p>

                                                    <p>
                                                        Monto:
                                                        {" "}
                                                        {
                                                            formatCurrency(
                                                                arbitraje.monto
                                                            )
                                                        }
                                                    </p>

                                                </div>

                                                {
                                                    arbitraje.estado !== "PAGADO" && (

                                                        <div className="flex gap-4 mt-6">

                                                            <button
                                                                onClick={() =>
                                                                    notificarPago(
                                                                        arbitraje.id
                                                                    )
                                                                }
                                                                className="flex-1 px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                                            >

                                                                Notificar Pago

                                                            </button>

                                                        </div>
                                                    )
                                                }

                                            </div>
                                        )
                                    )
                                }

                            </div>
                        )
                }

            </motion.div>

        </div>
    );
}

export default ArbitrajesJugador;