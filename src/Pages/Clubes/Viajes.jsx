import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import api from "../../Api/Api";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaMoneyBillAlt, FaCheck, FaClock } from 'react-icons/fa';

function Viajes() {
    const today = new Date(); // Crear una instancia de la fecha actual
    const currentMonth = today.getMonth() + 1; // Obtener el mes actual (1 basado)
    const currentYear = today.getFullYear(); // Obtener el año actual

    const [loading, setLoading] = useState(true);
    const [viajes, setViajes] = useState([]);
    const [filter, setFilter] = useState({
        mes: currentMonth,
        anio: currentYear,
    });
    const navigate = useNavigate();

    // Nombres de los meses
    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    useEffect(() => {
        fetchViajes();
    }, [filter]); // Se ejecuta cada vez que cambia el filtro

    const fetchViajes = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const clubId = localStorage.getItem("clubId");

            // Crear las fechas de inicio y fin del mes seleccionado
            const fechaInicio = new Date(filter.anio, filter.mes - 1, 1); // Primer día del mes
            const fechaFin = new Date(filter.anio, filter.mes, 0); // Último día del mes

            // Enviar los parámetros de fechas al backend
            const res = await api.get("/viajes/club", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-club-id": clubId,
                },
                params: {
                    fechaInicio: fechaInicio.toISOString(), // Convertir a formato ISO
                    fechaFin: fechaFin.toISOString(), // Convertir a formato ISO
                },
            });

            setViajes(res.data || []); // Guardamos los viajes completos
        } catch (error) {
            console.error("Error cargando viajes:", error.response ? error.response.data : error);
        } finally {
            setLoading(false);
        }
    };

    const irACrearViaje = () => {
        navigate("/clubs/viajes/crear");
    };

    const editarViaje = async (viaje) => {
        const { value: formValues } = await Swal.fire({
            title: "Editar Viaje",
            html: `
        <div class="space-y-4 w-full">
          <label for="fechaSalida" class="block text-sm font-medium text-gray-200">Fecha de salida</label>
          <input id="fechaSalida" class="w-full px-4 py-2 text-gray-700 border border-gray-500 rounded-md" type="date" value="${viaje.fechaSalida}">
          
          <label for="horaSalida" class="block text-sm font-medium text-gray-200">Hora de salida</label>
          <input id="horaSalida" class="w-full px-4 py-2 text-gray-700 border border-gray-500 rounded-md" type="time" value="${viaje.horaSalida}">
          
          <label for="destino" class="block text-sm font-medium text-gray-200">Destino</label>
          <input id="destino" class="w-full px-4 py-2 text-gray-700 border border-gray-500 rounded-md" type="text" placeholder="Destino" value="${viaje.destino}">
          
          <label for="monto" class="block text-sm font-medium text-gray-200">Monto</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input id="monto" class="w-full pl-8 pr-4 py-2 text-gray-700 border border-gray-500 rounded-md" type="text" placeholder="Monto" value="${viaje.monto.toLocaleString('es-AR')}" />
          </div>

          <label for="cupoMax" class="block text-sm font-medium text-gray-200">Cupo máximo</label>
          <input id="cupoMax" class="w-full px-4 py-2 text-gray-700 border border-gray-500 rounded-md" type="number" placeholder="Cupo máximo" value="${viaje.cupoMax}">
        </div>
      `,
            focusConfirm: false,
            preConfirm: () => {
                const fechaSalida = document.getElementById('fechaSalida').value;
                const horaSalida = document.getElementById('horaSalida').value;
                const destino = document.getElementById('destino').value;
                let monto = document.getElementById('monto').value.replace(/\D/g, '');
                const cupoMax = document.getElementById('cupoMax').value;

                if (!fechaSalida || !horaSalida || !destino || !monto || !cupoMax) {
                    Swal.fire('Error', 'Por favor, completa todos los campos', 'error');
                    return false;
                }

                if (isNaN(monto) || parseFloat(monto) <= 0) {
                    Swal.fire('Error', 'Monto inválido', 'error');
                    return false;
                }

                if (isNaN(cupoMax) || parseInt(cupoMax) <= 0) {
                    Swal.fire('Error', 'Cupo máximo debe ser un número mayor que 0', 'error');
                    return false;
                }

                return {
                    fechaSalida,
                    horaSalida,
                    destino,
                    monto: parseFloat(monto),
                    cupoMax: parseInt(cupoMax),
                };
            },
            confirmButtonText: 'Guardar',
            customClass: {
                popup: 'bg-gray-800 rounded-lg shadow-xl p-6',
                confirmButton: 'bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600',
                title: 'text-gray-200',
                htmlContainer: 'text-gray-200',
            },
        });

        if (formValues) {
            try {
                const token = localStorage.getItem("token");
                const clubId = localStorage.getItem("clubId");

                const response = await api.patch(`/viajes/${viaje.id}`, {
                    ...formValues,
                    clubId,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "X-club-id": clubId,
                    },
                });

                Swal.fire('Éxito', 'Viaje actualizado correctamente', 'success');
                fetchViajes();
            } catch (error) {
                console.error("Error actualizando el viaje:", error);
                Swal.fire('Error', 'No se pudo actualizar el viaje', 'error');
            }
        }
    };

    const verJugadores = async (viajeId) => {
        try {
            const token = localStorage.getItem("token");
            const clubId = localStorage.getItem("clubId");

            const res = await api.get(`/viajes/${viajeId}/jugadores`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-club-id": clubId,
                },
            });

            const jugadores = res.data;

            let jugadoresHtml = "";
            jugadores.forEach(jugador => {
                jugadoresHtml += `
          <div>
            <strong>${jugador.nombre}</strong> ${jugador.apellido} - ${jugador.estado}
          </div>
        `;
            });

            await Swal.fire({
                title: 'Jugadores del Viaje',
                html: jugadoresHtml,
                showCloseButton: true,
                customClass: {
                    popup: 'bg-gray-800 rounded-lg shadow-xl p-6',
                    title: 'text-gray-200',
                    htmlContainer: 'text-gray-200',
                },
            });
        } catch (error) {
            console.error("Error obteniendo jugadores:", error);
            Swal.fire('Error', 'No se pudieron obtener los jugadores', 'error');
        }
    };

    const formatCurrency = (value) => {
        if (!value) return "$0";
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("es-AR");
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-300">Cargando viajes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="select-none relative flex items-center justify-center min-h-[80vh] px-4 bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-4xl p-6 bg-transparent border border-gray-500 shadow-xl backdrop-blur rounded-2xl"
            >
                <h1 className="mb-1 text-2xl font-bold text-gray-200">Viajes del Club</h1>
                <p className="mb-6 text-sm text-gray-300">Aquí están los viajes disponibles para el club</p>

                <div className="flex justify-between items-center">
                    <div className="mb-6 flex gap-4">
                        <select
                            name="mes"
                            value={filter.mes}
                            onChange={handleFilterChange}
                            className="h-10 px-4 py-2 bg-gray-800 border border-gray-500 rounded-md text-gray-200"
                        >
                            {months.map((month, idx) => (
                                <option key={idx + 1} value={idx + 1}>
                                    {month}
                                </option>
                            ))}
                        </select>

                        <select
                            name="anio"
                            value={filter.anio}
                            onChange={handleFilterChange}
                            className="h-10 px-4 py-2 bg-gray-800 border border-gray-500 rounded-md text-gray-200"
                        >
                            {[currentYear, currentYear + 1].map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Botón para crear viaje */}
                    <button
                        onClick={irACrearViaje}
                        className="h-10 px-6 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                    >
                        Crear Viaje
                    </button>
                </div>

                {viajes.length === 0 ? (
                    <p className="mt-10 text-center text-gray-300">No hay viajes creados todavía.</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {viajes.map((viaje) => (
                            <div key={viaje.id} className="p-6 shadow-xl bg-gray-800 backdrop-blur rounded-2xl text-gray-200">
                                <div className="mb-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-400">Fecha: {formatDate(viaje.fechaSalida)}</p>
                                    <span className="px-4 py-1 bg-blue-500 text-white rounded-full text-xs">Activo</span>
                                </div>

                                {/* Monto centralizado y más grande */}
                                <div className="flex justify-center items-center mt-6 text-xl font-bold text-gray-100">
                                    <FaMoneyBillAlt className="mr-2" />
                                    <span>{formatCurrency(viaje.monto)}</span>
                                </div>

                                {/* Contadores de invitados, confirmados y en espera */}
                                <div className="flex justify-between items-center mt-6 text-sm text-gray-400">
                                    <div className="flex items-center">
                                        <FaUsers className="mr-1" />
                                        <span className="font-semibold">Invitados: {viaje.invitados || 0}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaCheck className="mr-1" />
                                        <span className="font-semibold">Confirmados: {viaje.confirmados || 0}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaClock className="mr-1" />
                                        <span className="font-semibold">En espera: {viaje.jugadoresEnEspera?.length || 0}</span>
                                    </div>
                                </div>

                                {/* Botones */}
                                <div className="flex justify-center gap-4 mt-6 px-4 py-4">
                                    <button
                                        onClick={() => editarViaje(viaje)}
                                        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        onClick={() => verJugadores(viaje.id)}
                                        className="px-4 py-2 text-white bg-yellow-600 rounded-md hover:bg-yellow-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm"
                                    >
                                        Listado
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default Viajes;