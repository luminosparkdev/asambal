import { useEffect, useState } from "react";
import api from "../../Api/Api";
import Swal from "sweetalert2";

const formatMoney = (value) => {
    if (!value) return "$0";
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
    }).format(Number(value));
};

const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("es-AR");
};

function ViajesClub() {
    const [loading, setLoading] = useState(true);
    const [viajes, setViajes] = useState([]);

    useEffect(() => {
        fetchViajes();
    }, []);

    const fetchViajes = async () => {
        try {
            setLoading(true);
            const res = await api.get("/club/viajes/tickets");
            setViajes(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const responderViaje = async (viajeId, respuesta) => {
        try {
            await api.post("/club/viajes/responder", { viajeId, respuesta });
            Swal.fire("Listo", `Has ${respuesta === "confirmado" ? "confirmado" : "rechazado"} el viaje`, "success");
            fetchViajes();
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo enviar tu respuesta", "error");
        }
    };

    if (loading) {
        return (
            <p className="mt-10 text-center text-gray-200">
                Cargando tickets de viaje...
            </p>
        );
    }

    return (
        <div className="select-none min-h-screen bg-[url('/src/Assets/Asambal/fondodashboard.webp')]">
            <div className="px-4 mx-auto max-w-7xl">

                <div className="px-2 py-6">
                    <h2 className="text-2xl font-semibold text-gray-200">
                        Mis <span className="text-yellow-600">Tickets de Viaje</span>
                    </h2>
                </div>

                <div className="grid gap-6 mt-6 md:grid-cols-2">
                    {viajes.map((viaje) => (
                        <div
                            key={viaje.id}
                            className="p-6 shadow-xl bg-white/90 backdrop-blur rounded-2xl"
                        >
                            <div className="mb-4">
                                <p className="text-sm text-gray-600">
                                    Fecha: {formatDate(viaje.fecha)}
                                </p>

                                <p className="text-xl font-semibold text-gray-800">
                                    {formatMoney(viaje.amount)}
                                </p>
                            </div>

                            <div className="flex justify-between text-sm text-gray-700 mb-4">
                                <div>
                                    Enviado: <span className="font-semibold">{viaje.enviado || 0}</span>
                                </div>
                                <div>
                                    Confirmados: <span className="font-semibold">{viaje.confirmados || 0}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {viaje.status === "pendiente" && (
                                    <>
                                        <button
                                            onClick={() => responderViaje(viaje.id, "confirmado")}
                                            className="flex-1 h-9 text-gray-100 bg-green-700 rounded-lg hover:bg-green-600"
                                        >
                                            Confirmar
                                        </button>
                                        <button
                                            onClick={() => responderViaje(viaje.id, "rechazado")}
                                            className="flex-1 h-9 text-gray-100 bg-red-600 rounded-lg hover:bg-red-500"
                                        >
                                            Rechazar
                                        </button>
                                    </>
                                )}
                                {viaje.status === "confirmado" && (
                                    <span className="text-sm font-semibold text-green-700">Confirmado ✔</span>
                                )}
                                {viaje.status === "rechazado" && (
                                    <span className="text-sm font-semibold text-red-700">Rechazado ✖</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default ViajesClub;