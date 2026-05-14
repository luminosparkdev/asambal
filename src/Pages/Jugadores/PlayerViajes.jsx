import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";  // Usamos useNavigate para redirigir
import api from "../../Api/Api"; // Asegúrate de que la API está correctamente configurada.

export default function PlayerViajes() {
    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentButton, setShowPaymentButton] = useState(null); // Para controlar si se muestra el botón de pago
    const [playerId, setPlayerId] = useState(localStorage.getItem("playerId")); // ID del jugador que está en localStorage
    const navigate = useNavigate(); // Usamos useNavigate para redirigir

    // Si no se encuentra el playerId, redirigimos al usuario a la página de login
    useEffect(() => {
        // Verificamos si el playerId está presente en localStorage
        if (!playerId) {
            Swal.fire("Error", "No se ha encontrado el ID del jugador. Por favor, inicie sesión.", "error");
            navigate("/login");  // Redirigir al usuario a la página de login
            return;
        }

        const fetchViajes = async () => {
            try {
                setLoading(true);
                // Obtener los viajes para el jugador desde la API
                const res = await api.get(`/jugadores/${playerId}/viajesJugador`);
                
                // Si no hay viajes, mostrar mensaje adecuado
                if (res.data.length === 0) {
                    Swal.fire("Info", "No tienes viajes disponibles en este momento.", "info");
                }
                setViajes(res.data); // Guardamos los viajes
            } catch (err) {
                console.error("Error al obtener los viajes", err);
                Swal.fire("Error", "No se pudieron cargar los viajes", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchViajes();
    }, [playerId, navigate]);  // Agregar navigate como dependencia

    // Función para manejar la inscripción en un viaje
    const handleInscribirse = async (viajeId) => {
        try {
            setLoading(true);
            // Actualizar el estado del jugador a "CONFIRMADO"
            const res = await api.post(`/viajes/${viajeId}/confirmar`, { jugadorId: playerId });
            Swal.fire("Éxito", "¡Has confirmado tu asistencia al viaje!", "success");

            // Actualizamos el estado en el frontend
            setViajes((prev) =>
                prev.map((viaje) =>
                    viaje.viajeId === viajeId
                        ? { ...viaje, estado: "CONFIRMADO" }
                        : viaje
                )
            );
            // Mostramos el botón de "Notificar pago"
            setShowPaymentButton(viajeId);
        } catch (err) {
            console.error("Error inscribiendo al viaje", err);
            Swal.fire("Error", "No se pudo confirmar tu asistencia", "error");
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar el rechazo de un viaje
    const handleRechazar = async (viajeId) => {
        try {
            setLoading(true);
            // Actualizar el estado del jugador a "RECHAZADO"
            const res = await api.post(`/viajes/${viajeId}/rechazar`, { jugadorId: playerId });
            Swal.fire("Rechazado", "Has rechazado el viaje", "info");

            // Actualizamos el estado en el frontend
            setViajes((prev) =>
                prev.map((viaje) =>
                    viaje.viajeId === viajeId
                        ? { ...viaje, estado: "RECHAZADO" }
                        : viaje
                )
            );
        } catch (err) {
            console.error("Error rechazando el viaje", err);
            Swal.fire("Error", "No se pudo rechazar el viaje", "error");
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar la notificación de pago
    const handleNotificarPago = async (viajeId) => {
        try {
            const { value: file } = await Swal.fire({
                title: "Adjuntar comprobante de pago",
                input: "file",
                inputAttributes: {
                    accept: "image/*,application/pdf",
                    "aria-label": "Selecciona el comprobante de pago",
                },
                showCancelButton: true,
            });

            if (!file) return; // Si no se selecciona un archivo, no hacemos nada

            // Enviar el archivo al backend
            const formData = new FormData();
            formData.append("comprobante", file);
            const res = await api.post(`/viajes/${viajeId}/notificarPago`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            Swal.fire("Éxito", res.data.message, "success");
        } catch (err) {
            console.error("Error al notificar el pago", err);
            Swal.fire("Error", "No se pudo adjuntar el comprobante de pago", "error");
        }
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
        <div className="flex items-center justify-center min-h-[80vh] px-4 bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
            <div className="w-full max-w-4xl p-6 border border-gray-500 shadow-xl backdrop-blur rounded-2xl">
                <h1 className="text-2xl font-bold text-gray-200">Viajes disponibles</h1>
                <p className="mb-6 text-sm text-gray-300">Selecciona un viaje para confirmar tu participación.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {viajes.length > 0 ? (
                        viajes.map((viaje) => (
                            <div
                                key={viaje.viajeId}
                                className="max-w-xs w-full bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-600"
                            >
                                <h3 className="text-xl font-semibold text-gray-100">{viaje.destino}</h3>
                                <p className="mt-2 text-sm text-gray-300">
                                    <strong>Fecha:</strong> {new Date(viaje.fechaSalida).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-300">
                                    <strong>Hora:</strong> {viaje.horaSalida}
                                </p>
                                <p className="mt-2 text-sm text-gray-300">
                                    <strong>Estado:</strong> {viaje.estado}
                                </p>

                                {/* Botones para inscribirse, rechazar y notificar pago */}
                                {viaje.estado === "INVITADO" && (
                                    <div className="flex justify-end mt-4 gap-4">
                                        <button
                                            className="px-4 py-2 bg-green-600 text-gray-200 rounded-lg hover:bg-green-500"
                                            onClick={() => handleInscribirse(viaje.viajeId)}
                                        >
                                            Inscribirse
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-red-600 text-gray-200 rounded-lg hover:bg-red-500"
                                            onClick={() => handleRechazar(viaje.viajeId)}
                                        >
                                            Rechazar
                                        </button>
                                    </div>
                                )}

                                {viaje.estado === "CONFIRMADO" && showPaymentButton === viaje.viajeId && (
                                    <div className="flex justify-end mt-4">
                                        <button
                                            className="px-4 py-2 bg-blue-600 text-gray-200 rounded-lg hover:bg-blue-500"
                                            onClick={() => handleNotificarPago(viaje.viajeId)}
                                        >
                                            Notificar Pago
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-300">No hay viajes disponibles.</p>
                    )}
                </div>
            </div>
        </div>
    );
}