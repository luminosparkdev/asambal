import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

import {
    FaUsers,
    FaMoneyBillAlt,
    FaCheck,
    FaClock,
    FaPlus,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import api from "../../Api/Api";

function Arbitrajes() {

    const [loading, setLoading] =
        useState(true);

    const [arbitrajes, setArbitrajes] =
        useState([]);

    const navigate =
        useNavigate();

    useEffect(() => {

        fetchArbitrajes();

    }, []);

    const fetchArbitrajes = async () => {

        try {

            setLoading(true);

            const token =
                localStorage.getItem("token");

            const clubId =
                localStorage.getItem("clubId");

            const res = await api.get(
                "/arbitrajes/club",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                        "X-club-id": clubId,
                    },
                }
            );

            console.log(
                "ARBITRAJES RAW:",
                res.data
            );

            const data =
                Array.isArray(res.data)
                    ? res.data
                        .map((a) => ({
                            ...a,
                            id:
                                a.id ||
                                a._id,
                        }))
                        .filter(
                            (a) =>
                                a &&
                                a.id &&
                                a.titulo
                        )
                    : [];

            console.log(
                "ARBITRAJES LIMPIOS:",
                data
            );

            setArbitrajes(
                [...data]
            );

        } catch (error) {

            console.error(
                "Error cargando arbitrajes:",
                error.response?.data || error
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

    const irACrearArbitraje = () => {

        navigate(
            "/clubs/arbitrajes/crear"
        );
    };

    const editarArbitraje = async (
        arbitraje
    ) => {

        const {
            value: formValues
        } = await Swal.fire({

            title:
                "Editar Arbitraje",

            html: `
                <div class="space-y-4 w-full">

                    <label
                        for="titulo"
                        class="block text-sm font-medium text-gray-200"
                    >
                        Título
                    </label>

                    <input
                        id="titulo"
                        class="w-full px-4 py-2 text-gray-700 border border-gray-500 rounded-md"
                        type="text"
                        placeholder="Título"
                        value="${arbitraje.titulo || ""}"
                    >

                    <label
                        for="descripcion"
                        class="block text-sm font-medium text-gray-200"
                    >
                        Descripción
                    </label>

                    <textarea
                        id="descripcion"
                        class="w-full px-4 py-2 text-gray-700 border border-gray-500 rounded-md"
                        placeholder="Descripción"
                    >${arbitraje.descripcion || ""}</textarea>

                    <label
                        for="monto"
                        class="block text-sm font-medium text-gray-200"
                    >
                        Monto
                    </label>

                    <div class="relative">

                        <span
                            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            $
                        </span>

                        <input
                            id="monto"
                            class="w-full pl-8 pr-4 py-2 text-gray-700 border border-gray-500 rounded-md"
                            type="text"
                            placeholder="Monto"
                            value="${arbitraje.monto?.toLocaleString("es-AR") || 0}"
                        />

                    </div>

                </div>
            `,

            focusConfirm: false,

            preConfirm: () => {

                const titulo =
                    document.getElementById(
                        "titulo"
                    ).value;

                const descripcion =
                    document.getElementById(
                        "descripcion"
                    ).value;

                let monto =
                    document.getElementById(
                        "monto"
                    )
                        .value
                        .replace(/\D/g, "");

                if (
                    !titulo ||
                    !descripcion ||
                    !monto
                ) {

                    Swal.fire(
                        "Error",
                        "Completa todos los campos",
                        "error"
                    );

                    return false;
                }

                if (
                    isNaN(monto) ||
                    parseFloat(monto) <= 0
                ) {

                    Swal.fire(
                        "Error",
                        "Monto inválido",
                        "error"
                    );

                    return false;
                }

                return {
                    titulo,
                    descripcion,
                    monto: parseFloat(
                        monto
                    ),
                };
            },

            confirmButtonText:
                "Guardar",

            customClass: {
                popup:
                    "bg-gray-800 rounded-lg shadow-xl p-6",

                confirmButton:
                    "bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600",

                title:
                    "text-gray-200",

                htmlContainer:
                    "text-gray-200",
            },
        });

        if (formValues) {

            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );

                const clubId =
                    localStorage.getItem(
                        "clubId"
                    );

                await api.patch(
                    `/arbitrajes/${arbitraje.id}`,
                    {
                        ...formValues,
                        clubId,
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                            "X-club-id":
                                clubId,
                        },
                    }
                );

                Swal.fire(
                    "Éxito",
                    "Arbitraje actualizado correctamente",
                    "success"
                );

                fetchArbitrajes();

            } catch (error) {

                console.error(
                    "Error actualizando arbitraje:",
                    error
                );

                Swal.fire(
                    "Error",
                    "No se pudo actualizar el arbitraje",
                    "error"
                );
            }
        }
    };

    const verJugadores = async (
        arbitrajeId
    ) => {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );

            const clubId =
                localStorage.getItem(
                    "clubId"
                );

            const res =
                await api.get(
                    `/arbitrajes/${arbitrajeId}/jugadores`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                            "X-club-id":
                                clubId,
                        },
                    }
                );

            const jugadores =
                Array.isArray(res.data)
                    ? res.data
                    : [];

            let jugadoresHtml = "";

            jugadores.forEach(
                (jugador) => {

                    const pagado =
                        jugador.estado ===
                        "PAGADO";

                    const color =
                        pagado
                            ? "#22c55e"
                            : "#f59e0b";

                    jugadoresHtml += `
                        <div class="flex items-center justify-between bg-gray-700 rounded-lg p-3 mb-2">

                            <div>

                                <strong class="text-white">

                                    ${jugador.nombre}
                                    ${jugador.apellido}

                                </strong>

                            </div>

                            <span
                                style="
                                    background:${color};
                                    padding:4px 10px;
                                    border-radius:999px;
                                    color:white;
                                    font-size:12px;
                                    font-weight:bold;
                                "
                            >

                                ${
                                    pagado
                                        ? "PAGADO"
                                        : "PENDIENTE"
                                }

                            </span>

                        </div>
                    `;
                }
            );

            await Swal.fire({

                title:
                    "Jugadores del Arbitraje",

                html:
                    jugadoresHtml,

                width: 700,

                showCloseButton: true,

                customClass: {
                    popup:
                        "bg-gray-800 rounded-lg shadow-xl p-6",

                    title:
                        "text-gray-200",

                    htmlContainer:
                        "text-gray-200",
                },
            });

        } catch (error) {

            console.error(
                "Error obteniendo jugadores:",
                error
            );

            Swal.fire(
                "Error",
                "No se pudieron obtener los jugadores",
                "error"
            );
        }
    };

    const formatCurrency = (
        value
    ) => {

        if (!value) return "$0";

        return new Intl.NumberFormat(
            "es-AR",
            {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 0,
            }
        ).format(value);
    };

    if (loading) {

        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">

                <div className="flex flex-col items-center gap-3">

                    <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>

                    <p className="text-gray-300">
                        Cargando arbitrajes...
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

                className="w-full max-w-5xl p-6 bg-transparent border border-gray-500 shadow-xl backdrop-blur rounded-2xl"
            >

                <div className="flex items-center justify-between mb-6">

                    <div>

                        <h1 className="mb-1 text-2xl font-bold text-gray-200">
                            Arbitrajes del Club
                        </h1>

                        <p className="text-sm text-gray-300">
                            Gestiona los arbitrajes de tus jugadores
                        </p>

                    </div>

                    <button
                        onClick={
                            irACrearArbitraje
                        }
                        className="flex items-center gap-2 h-10 px-6 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                    >

                        <FaPlus />

                        Crear

                    </button>

                </div>

                {arbitrajes.length === 0 ? (

                    <p className="mt-20 text-center text-gray-300 text-lg">
                        No hay arbitrajes creados todavía.
                    </p>

                ) : (

                    <div className="grid gap-6 md:grid-cols-2">

                        {arbitrajes.map(
                            (a) => (

                                <div
                                    key={`${a.id}-${a.titulo}`}
                                    className="p-6 shadow-xl bg-gray-800 backdrop-blur rounded-2xl text-gray-200"
                                >

                                    <div className="mb-4 flex items-center justify-between">

                                        <span className="px-4 py-1 bg-blue-500 text-white rounded-full text-xs">

                                            {a.status ||
                                                "ACTIVO"}

                                        </span>

                                    </div>

                                    <h2 className="text-xl font-bold text-white mb-2">

                                        {a.titulo}

                                    </h2>

                                    <p className="text-gray-400 min-h-[50px]">

                                        {a.descripcion ||
                                            "Sin descripción"}

                                    </p>

                                    <div className="flex justify-center items-center mt-6 text-2xl font-bold text-gray-100">

                                        <FaMoneyBillAlt className="mr-2" />

                                        <span>

                                            {formatCurrency(
                                                a.monto
                                            )}

                                        </span>

                                    </div>

                                    <div className="flex justify-between items-center mt-6 text-sm text-gray-400">

                                        <div className="flex items-center">

                                            <FaUsers className="mr-1" />

                                            <span className="font-semibold">

                                                Total:
                                                {" "}
                                                {a.totalJugadores || 0}

                                            </span>

                                        </div>

                                        <div className="flex items-center">

                                            <FaCheck className="mr-1 text-green-400" />

                                            <span className="font-semibold">

                                                Pagados:
                                                {" "}
                                                {a.totalPagados || 0}

                                            </span>

                                        </div>

                                        <div className="flex items-center">

                                            <FaClock className="mr-1 text-yellow-400" />

                                            <span className="font-semibold">

                                                Pendientes:
                                                {" "}
                                                {a.totalPendientes || 0}

                                            </span>

                                        </div>

                                    </div>

                                    <div className="flex justify-center gap-4 mt-6 px-4 py-4">

                                        <button
                                            onClick={() =>
                                                editarArbitraje(a)
                                            }
                                            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() =>
                                                verJugadores(a.id)
                                            }
                                            className="px-4 py-2 text-white bg-yellow-600 rounded-md hover:bg-yellow-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm"
                                        >
                                            Listado
                                        </button>

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}

            </motion.div>

        </div>
    );
}

export default Arbitrajes;