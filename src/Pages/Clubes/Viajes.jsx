import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import api from "../../Api/Api";
import { useNavigate } from "react-router-dom";
import {
    FaUsers,
    FaMoneyBillAlt,
    FaCheck,
    FaClock
} from "react-icons/fa";

function Viajes() {

    const today = new Date();

    const currentMonth =
        today.getMonth() + 1;

    const currentYear =
        today.getFullYear();

    const [loading, setLoading] =
        useState(true);

    const [viajes, setViajes] =
        useState([]);

    const [filter, setFilter] =
        useState({
            mes: currentMonth,
            anio: currentYear,
        });

    const navigate = useNavigate();

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

        fetchViajes();

    }, [filter]);

    const fetchViajes = async () => {

        try {

            setLoading(true);

            const token =
                localStorage.getItem("token");

            const clubId =
                localStorage.getItem("clubId");

            const fechaInicio =
                new Date(
                    filter.anio,
                    filter.mes - 1,
                    1
                );

            const fechaFin =
                new Date(
                    filter.anio,
                    filter.mes,
                    0
                );

            const res = await api.get(
                "/viajes/club",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                        "X-club-id":
                            clubId,
                    },
                    params: {
                        fechaInicio:
                            fechaInicio.toISOString(),
                        fechaFin:
                            fechaFin.toISOString(),
                    },
                }
            );

            setViajes(res.data || []);

        } catch (error) {

            console.error(
                "Error cargando viajes:",
                error.response
                    ? error.response.data
                    : error
            );

        } finally {

            setLoading(false);
        }
    };

    const irACrearViaje = () => {

        navigate(
            "/clubs/viajes/crear"
        );
    };

    const editarViaje = async (
        viaje
    ) => {

        const { value: formValues } =
            await Swal.fire({

                title: "Editar Viaje",

                html: `
<div class="space-y-4 w-full">

<label
for="fechaSalida"
class="block text-sm font-medium text-gray-200"
>
Fecha de salida
</label>

<input
id="fechaSalida"
class="w-full px-4 py-2 text-gray-700 border border-gray-500 rounded-md"
type="date"
value="${viaje.fechaSalida?.split("T")[0] || ""}"
>

<label
for="horaSalida"
class="block text-sm font-medium text-gray-200"
>
Hora de salida
</label>

<input
id="horaSalida"
class="w-full px-4 py-2 text-gray-700 border border-gray-500 rounded-md"
type="time"
value="${viaje.horaSalida}"
>

<label
for="destino"
class="block text-sm font-medium text-gray-200"
>
Destino
</label>

<input
id="destino"
class="w-full px-4 py-2 text-gray-700 border border-gray-500 rounded-md"
type="text"
value="${viaje.destino}"
>

<label
for="monto"
class="block text-sm font-medium text-gray-200"
>
Monto
</label>

<div class="relative">

<span class="
absolute left-3 top-1/2
transform -translate-y-1/2
text-gray-500
">
$
</span>

<input
id="monto"
class="
w-full pl-8 pr-4 py-2
text-gray-700 border
border-gray-500 rounded-md
"
type="text"
value="${viaje.monto?.toLocaleString("es-AR") || 0}"
>

</div>

<label
for="cupoMax"
class="block text-sm font-medium text-gray-200"
>
Cupo máximo
</label>

<input
id="cupoMax"
class="w-full px-4 py-2 text-gray-700 border border-gray-500 rounded-md"
type="number"
value="${viaje.cupoMax}"
>

</div>
`,
                focusConfirm: false,

                preConfirm: () => {

                    const fechaSalida =
                        document.getElementById(
                            "fechaSalida"
                        ).value;

                    const horaSalida =
                        document.getElementById(
                            "horaSalida"
                        ).value;

                    const destino =
                        document.getElementById(
                            "destino"
                        ).value;

                    let monto =
                        document.getElementById(
                            "monto"
                        ).value.replace(/\D/g, "");

                    const cupoMax =
                        document.getElementById(
                            "cupoMax"
                        ).value;

                    if (
                        !fechaSalida ||
                        !horaSalida ||
                        !destino ||
                        !monto ||
                        !cupoMax
                    ) {

                        Swal.fire(
                            "Error",
                            "Completa todos los campos",
                            "error"
                        );

                        return false;
                    }

                    return {
                        fechaSalida,
                        horaSalida,
                        destino,
                        monto:
                            parseFloat(monto),
                        cupoMax:
                            parseInt(cupoMax),
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
                    `/viajes/${viaje.id}`,
                    formValues,
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
                    "Viaje actualizado correctamente",
                    "success"
                );

                fetchViajes();

            } catch (error) {

                console.error(
                    "Error actualizando:",
                    error
                );

                Swal.fire(
                    "Error",
                    "No se pudo actualizar",
                    "error"
                );
            }
        }
    };

    const verJugadores = async (
        viajeId
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

            const res = await api.get(
                `/viajes/${viajeId}/jugadores`,
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
                res.data || [];

            const prioridadEstado = {
                INVITADO: 1,
                PENDIENTE: 2,
                CONFIRMADO: 3,
            };

            const jugadoresMap =
                new Map();

            jugadores.forEach(
                (jugador) => {

                    const key = `
${(jugador.nombre || "")
                            .trim()
                            .toLowerCase()}
${(jugador.apellido || "")
                            .trim()
                            .toLowerCase()}
`;

                    const existente =
                        jugadoresMap.get(
                            key
                        );

                    if (!existente) {

                        jugadoresMap.set(
                            key,
                            jugador
                        );

                        return;
                    }

                    const prioridadNueva =
                        prioridadEstado[
                        jugador.estado
                        ] || 0;

                    const prioridadExistente =
                        prioridadEstado[
                        existente.estado
                        ] || 0;

                    if (
                        prioridadNueva >
                        prioridadExistente
                    ) {

                        jugadoresMap.set(
                            key,
                            jugador
                        );
                    }
                }
            );

            const jugadoresUnicos =
                Array.from(
                    jugadoresMap.values()
                );

            const visibles =
                jugadoresUnicos.filter(
                    (j) =>
                        j.estado ===
                        "PENDIENTE" ||
                        j.estado ===
                        "CONFIRMADO"
                );

            let jugadoresHtml = `
<div class="overflow-x-auto">

<table class="w-full text-sm text-left text-gray-700 border-collapse">

<thead class="bg-gray-700 text-gray-100">

<tr>

<th class="p-3">Jugador</th>

<th class="p-3">Fecha Nac.</th>

<th class="p-3">DNI</th>

<th class="p-3">Comprobante</th>

<th class="p-3">Estado</th>

<th class="p-3 text-center">Acciones</th>

</tr>

</thead>

<tbody>
`;

            visibles.forEach(
                (jugador) => {

                    let estadoColor =
                        "bg-yellow-500";

                    if (
                        jugador.estado ===
                        "CONFIRMADO"
                    ) {

                        estadoColor =
                            "bg-green-500";
                    }

                    jugadoresHtml += `
<tr class="border-b border-gray-700">

<td class="p-3">
${jugador.nombre || ""}
${jugador.apellido || ""}
</td>

<td class="p-3">
${jugador.fechanacimiento
                            ? new Date(
                                jugador.fechanacimiento
                            ).toLocaleDateString(
                                "es-AR"
                            )
                            : "-"
                        }
</td>

<td class="p-3">
${jugador.dni || "-"}
</td>

<td class="p-3">

${jugador.comprobanteUrl
                            ? `
<a
href="${jugador.comprobanteUrl}"
target="_blank"
class="
px-3 py-1
bg-blue-600
rounded-md
text-white
text-xs
"
>
Ver archivo
</a>
`
                            : "-"
                        }

</td>

<td class="p-3">

<span class="
px-3 py-1
rounded-full
text-white
text-xs
font-bold
${estadoColor}
">
${jugador.estado}
</span>

</td>

<td class="p-3">

${jugador.estado ===
                            "PENDIENTE"
                            ? `
<div class="
flex
justify-center
gap-2
">

<button
onclick="window.aprobarPago('${viajeId}','${jugador.id}')"
class="
px-3 py-1
bg-green-600
rounded-md
text-white
text-xs
"
>
✓
</button>

<button
onclick="window.rechazarPago('${viajeId}','${jugador.id}')"
class="
px-3 py-1
bg-red-600
rounded-md
text-white
text-xs
"
>
X
</button>

</div>
`
                            : `
<div class="
flex justify-center
">
<span class="
px-3 py-1
bg-green-700
text-green-100
rounded-full
text-xs
font-semibold
shadow-md
border border-green-500
">
✓ Pago aprobado
</span>
</div>
`
                        }

</td>

</tr>
`;
                }
            );

            jugadoresHtml += `
</tbody>
</table>
</div>
`;

            window.aprobarPago =
                async (
                    viajeId,
                    jugadorId
                ) => {

                    try {

                        await api.patch(
                            `/viajes/${viajeId}/validar/${jugadorId}`,
                            {
                                estado:
                                    "CONFIRMADO",
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
                            "OK",
                            "Pago aprobado",
                            "success"
                        );

                        verJugadores(
                            viajeId
                        );

                    } catch (error) {

                        console.error(
                            error
                        );

                        Swal.fire(
                            "Error",
                            "No se pudo aprobar",
                            "error"
                        );
                    }
                };

            window.rechazarPago =
                async (
                    viajeId,
                    jugadorId
                ) => {

                    try {

                        await api.patch(
                            `/viajes/${viajeId}/validar/${jugadorId}`,
                            {
                                estado:
                                    "RECHAZADO",
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
                            "OK",
                            "Pago rechazado",
                            "success"
                        );

                        verJugadores(
                            viajeId
                        );

                    } catch (error) {

                        console.error(
                            error
                        );

                        Swal.fire(
                            "Error",
                            "No se pudo rechazar",
                            "error"
                        );
                    }
                };

            await Swal.fire({

                title:
                    "Jugadores del Viaje",

                html: jugadoresHtml,

                width: 1100,

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

    const formatDate = (
        date
    ) => {

        if (!date) return "";

        return new Date(date)
            .toLocaleDateString(
                "es-AR"
            );
    };

    const handleFilterChange = (
        e
    ) => {

        const { name, value } =
            e.target;

        setFilter((prev) => ({
            ...prev,
            [name]: value,
        }));
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
                        Cargando viajes...
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
                w-full max-w-4xl
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
                    Viajes del Club
                </h1>

                <p className="
                mb-6 text-sm text-gray-300
                ">
                    Aquí están los viajes
                    disponibles para el club
                </p>

                <div className="
                flex justify-between
                items-center
                ">

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
                                (year) => (

                                    <option
                                        key={year}
                                        value={year}
                                    >
                                        {year}
                                    </option>
                                )
                            )}

                        </select>

                    </div>

                    <button
                        onClick={
                            irACrearViaje
                        }
                        className="
                        h-10 px-6 py-2
                        text-white
                        bg-green-500
                        rounded-md
                        hover:bg-green-600
                        "
                    >
                        Crear
                    </button>

                </div>

                {viajes.length === 0 ? (

                    <p className="
                    mt-10 text-center
                    text-gray-300
                    ">
                        No hay viajes creados.
                    </p>

                ) : (

                    <div className="
                    grid gap-6
                    md:grid-cols-2
                    ">

                        {viajes.map(
                            (viaje) => (

                                <div
                                    key={viaje.id}
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

                                        <p className="
                                        text-sm
                                        text-gray-400
                                        ">
                                            Fecha:
                                            {" "}
                                            {formatDate(
                                                viaje.fechaSalida
                                            )}
                                        </p>

                                        <span className="
                                        px-4 py-1
                                        bg-blue-500
                                        text-white
                                        rounded-full
                                        text-xs
                                        ">
                                            Activo
                                        </span>

                                    </div>

                                    <div className="
                                    flex justify-center
                                    items-center mt-6
                                    text-xl font-bold
                                    text-gray-100
                                    ">

                                        <FaMoneyBillAlt
                                            className="
                                            mr-2
                                            "
                                        />

                                        <span>
                                            {formatCurrency(
                                                viaje.monto
                                            )}
                                        </span>

                                    </div>

                                    <div className="
                                    flex justify-between
                                    items-center mt-6
                                    text-sm text-gray-400
                                    ">

                                        <div className="
                                        flex items-center
                                        ">

                                            <FaUsers
                                                className="
                                                mr-1
                                                "
                                            />

                                            <span className="
                                            font-semibold
                                            ">
                                                Invitados:
                                                {" "}
                                                {viaje.invitados || 0}
                                            </span>

                                        </div>

                                        <div className="
                                        flex items-center
                                        ">

                                            <FaCheck
                                                className="
                                                mr-1
                                                "
                                            />

                                            <span className="
                                            font-semibold
                                            ">
                                                Confirmados:
                                                {" "}
                                                {viaje.confirmados || 0}
                                            </span>

                                        </div>

                                        <div className="
                                        flex items-center
                                        ">

                                            <FaClock
                                                className="
                                                mr-1
                                                "
                                            />

                                            <span className="
                                            font-semibold
                                            ">
                                                Espera:
                                                {" "}
                                                {viaje.jugadoresEnEspera?.length || 0}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="
                                    flex justify-center
                                    gap-4 mt-6
                                    px-4 py-4
                                    ">

                                        <button
                                            onClick={() =>
                                                editarViaje(
                                                    viaje
                                                )
                                            }
                                            className="
                                            px-4 py-2
                                            text-white
                                            bg-blue-600
                                            rounded-md
                                            hover:bg-blue-700
                                            "
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() =>
                                                verJugadores(
                                                    viaje.id
                                                )
                                            }
                                            className="
                                            px-4 py-2
                                            text-white
                                            bg-yellow-600
                                            rounded-md
                                            hover:bg-yellow-700
                                            "
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

export default Viajes;