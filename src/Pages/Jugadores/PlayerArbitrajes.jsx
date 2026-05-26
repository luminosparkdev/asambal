import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import Swal from "sweetalert2";

import {
    FaMoneyBillAlt,
    FaClock,
    FaCheck,
} from "react-icons/fa";

import api from "../../Api/Api";

function ArbitrajesJugador() {

    const today =
        new Date();

    const currentMonth =
        today.getMonth() + 1;

    const currentYear =
        today.getFullYear();

    const [loading, setLoading] =
        useState(true);

    const [arbitrajes, setArbitrajes] =
        useState([]);

    const [filter, setFilter] =
        useState({
            mes: currentMonth,
            anio: currentYear,
        });

    const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];

    useEffect(() => {

        fetchArbitrajes();

    }, [filter]);

    const fetchArbitrajes = async () => {

        try {

            setLoading(true);

            const token =
                localStorage.getItem(
                    "token"
                );

            const res = await api.get(
                "/arbitrajes/jugador/mis-arbitrajes",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            let data =
                res.data || [];

            data =
                data.filter(
                    (a) => {

                        if (
                            !a.createdAt
                        ) return true;

                        const fecha =
                            new Date(
                                a.createdAt._seconds
                                    ? a.createdAt._seconds * 1000
                                    : a.createdAt
                            );

                        return (
                            fecha.getMonth() + 1 ===
                                Number(filter.mes) &&
                            fecha.getFullYear() ===
                                Number(filter.anio)
                        );
                    }
                );

            setArbitrajes(
                data
            );

        } catch (error) {

            console.error(
                error
            );

            Swal.fire(
                "Error",
                "No se pudieron cargar los arbitrajes",
                "error"
            );

        } finally {

            setLoading(false);
        }
    };

    const notificarPago =
        async (
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
                    localStorage.getItem(
                        "token"
                    );

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

                console.error(
                    error
                );

                Swal.fire(
                    "Error",
                    "No se pudo notificar el pago",
                    "error"
                );
            }
        };

    const formatCurrency =
        (
            value
        ) => {

            return new Intl.NumberFormat(
                "es-AR",
                {
                    style:
                        "currency",
                    currency:
                        "ARS",
                    minimumFractionDigits: 0,
                }
            ).format(
                value || 0
            );
        };

    const getEstadoConfig =
        (
            estado
        ) => {

            switch (
                estado
            ) {

                case "PAGADO":

                    return {
                        color:
                            "bg-green-500",
                        text:
                            "APROBADO",
                        icon:
                            <FaCheck />,
                    };

                case "REVISION":

                    return {
                        color:
                            "bg-blue-500",
                        text:
                            "EN REVISIÓN",
                        icon:
                            <FaClock />,
                    };

                case "RECHAZADO":

                    return {
                        color:
                            "bg-red-500",
                        text:
                            "RECHAZADO",
                        icon:
                            "✕",
                    };

                default:

                    return {
                        color:
                            "bg-yellow-500",
                        text:
                            "PENDIENTE",
                        icon:
                            <FaClock />,
                    };
            }
        };

    const handleFilterChange =
        (
            e
        ) => {

            const {
                name,
                value,
            } = e.target;

            setFilter(
                (
                    prev
                ) => ({
                    ...prev,
                    [name]:
                        value,
                })
            );
        };

    if (loading) {

        return (
            <div className="
            flex items-center
            justify-center
            min-h-screen
            bg-slate-900
            ">

                <div className="
                flex flex-col
                items-center gap-3
                ">

                    <div className="
                    w-10 h-10 border-4
                    border-green-500
                    border-t-transparent
                    rounded-full
                    animate-spin
                    " />

                    <p className="
                    text-gray-300
                    ">
                        Cargando arbitrajes...
                    </p>

                </div>

            </div>
        );
    }

    return (

        <div className="
        select-none relative
        flex items-center
        justify-center
        min-h-[80vh]
        px-4
        bg-[url('/src/assets/Asambal/fondodashboard.webp')]
        ">

            <motion.div

                initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.97,
                }}

                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                }}

                transition={{
                    duration: 0.3,
                }}

                className="
                w-full max-w-5xl
                p-6 bg-transparent
                border border-gray-500
                shadow-xl backdrop-blur
                rounded-2xl
                "
            >

                <h1 className="
                mb-1 text-2xl
                font-bold text-gray-200
                ">
                    Mis Arbitrajes
                </h1>

                <p className="
                mb-6 text-sm text-gray-300
                ">
                    Gestiona tus arbitrajes
                </p>

                <div className="
                mb-6 flex gap-4
                ">

                    <select
                        name="mes"
                        value={filter.mes}
                        onChange={
                            handleFilterChange
                        }
                        className="
                        h-10 px-4 py-2
                        bg-gray-800
                        border border-gray-500
                        rounded-md
                        text-gray-200
                        "
                    >

                        {months.map(
                            (
                                month,
                                idx
                            ) => (

                                <option
                                    key={
                                        idx + 1
                                    }
                                    value={
                                        idx + 1
                                    }
                                >
                                    {month}
                                </option>
                            )
                        )}

                    </select>

                    <select
                        name="anio"
                        value={filter.anio}
                        onChange={
                            handleFilterChange
                        }
                        className="
                        h-10 px-4 py-2
                        bg-gray-800
                        border border-gray-500
                        rounded-md
                        text-gray-200
                        "
                    >

                        {[
                            currentYear,
                            currentYear + 1,
                        ].map(
                            (
                                year
                            ) => (

                                <option
                                    key={
                                        year
                                    }
                                    value={
                                        year
                                    }
                                >
                                    {year}
                                </option>
                            )
                        )}

                    </select>

                </div>

                {
                    arbitrajes.length === 0
                        ? (

                            <p className="
                            mt-10 text-center
                            text-gray-300
                            ">
                                No tienes arbitrajes.
                            </p>

                        )
                        : (

                            <div className="
                            grid gap-6
                            md:grid-cols-2
                            ">

                                {
                                    arbitrajes.map(
                                        (
                                            arbitraje
                                        ) => {

                                            const estado =
                                                getEstadoConfig(
                                                    arbitraje.estado
                                                );

                                            return (

                                                <div
                                                    key={
                                                        arbitraje.id
                                                    }
                                                    className="
                                                    p-6 shadow-xl
                                                    bg-gray-800
                                                    backdrop-blur
                                                    rounded-2xl
                                                    text-gray-200
                                                    "
                                                >

                                                    <div className="
                                                    mb-4 flex
                                                    items-center
                                                    justify-between
                                                    ">

                                                        <span className={`
                                                        px-4 py-1
                                                        text-white
                                                        rounded-full
                                                        text-xs
                                                        flex items-center
                                                        gap-2
                                                        ${estado.color}
                                                        `}>

                                                            {
                                                                estado.icon
                                                            }

                                                            {
                                                                estado.text
                                                            }

                                                        </span>

                                                    </div>

                                                    <h2 className="
                                                    text-xl font-bold
                                                    text-white mb-2
                                                    ">

                                                        {
                                                            arbitraje.titulo
                                                        }

                                                    </h2>

                                                    <p className="
                                                    text-gray-400
                                                    min-h-[50px]
                                                    ">

                                                        {
                                                            arbitraje.descripcion ||
                                                            "Sin descripción"
                                                        }

                                                    </p>

                                                    <div className="
                                                    flex justify-center
                                                    items-center mt-6
                                                    text-2xl font-bold
                                                    text-gray-100
                                                    ">

                                                        <FaMoneyBillAlt
                                                            className="
                                                            mr-2
                                                            "
                                                        />

                                                        <span>

                                                            {
                                                                formatCurrency(
                                                                    arbitraje.monto
                                                                )
                                                            }

                                                        </span>

                                                    </div>

                                                    {
                                                        arbitraje.estado !== "PAGADO" &&
                                                        arbitraje.estado !== "REVISION" && (

                                                            <div className="
                                                            flex gap-4 mt-6
                                                            ">

                                                                <button
                                                                    onClick={() =>
                                                                        notificarPago(
                                                                            arbitraje.id
                                                                        )
                                                                    }
                                                                    className="
                                                                    flex-1 px-4 py-2
                                                                    font-semibold
                                                                    text-white
                                                                    bg-blue-600
                                                                    rounded-lg
                                                                    hover:bg-blue-700
                                                                    "
                                                                >

                                                                    Notificar Pago

                                                                </button>

                                                            </div>
                                                        )
                                                    }

                                                    {
                                                        arbitraje.estado === "REVISION" && (

                                                            <div className="
                                                            mt-6 p-3
                                                            bg-blue-500/20
                                                            border border-blue-500
                                                            rounded-lg
                                                            text-blue-300
                                                            text-sm text-center
                                                            ">

                                                                Tu comprobante
                                                                está siendo revisado
                                                                por el club

                                                            </div>
                                                        )
                                                    }

                                                </div>
                                            );
                                        }
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