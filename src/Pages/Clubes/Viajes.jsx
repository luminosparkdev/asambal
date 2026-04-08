import { useEffect, useState } from "react";
import api from "../../Api/Api";
import Swal from "sweetalert2";

function Viajes() {
    const [loading, setLoading] = useState(true);
    const [viajes, setViajes] = useState([]);

    useEffect(() => {
        fetchViajes();
    }, []);

    const fetchViajes = async () => {
        try {
            setLoading(true);
            const res = await api.get("/club/viajes");
            setViajes(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const crearViaje = async () => {
        const { value: formValues } = await Swal.fire({
            title: "Crear viaje",
            html:
                `<input type="date" id="fecha" class="swal2-input" placeholder="Fecha del viaje">` +
                `<input type="text" id="importe" class="swal2-input" placeholder="Importe $">`,
            focusConfirm: false,
            preConfirm: () => {
                const fecha = document.getElementById("fecha").value;
                const importe = document.getElementById("importe").value;
                if (!fecha || !importe) {
                    Swal.showValidationMessage("Debe completar fecha e importe");
                }
                return { fecha, importe };
            },
            showCancelButton: true,
            confirmButtonText: "Crear",
            cancelButtonText: "Cancelar",
        });

        if (!formValues) return;

        try {
            await api.post("/club/viajes", {
                fecha: formValues.fecha,
                amount: Number(formValues.importe),
            });

            Swal.fire("Listo", "Viaje creado correctamente", "success");
            fetchViajes();
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo crear el viaje", "error");
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

    if (loading) {
        return (
            <p className="mt-10 text-center text-gray-200">
                Cargando viajes...
            </p>
        );
    }

    return (
        <div className="min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
            <div className="px-4 mx-auto max-w-7xl">

                {/* Título */}
                <div className="px-4 py-6">
                    <h2 className="text-2xl font-semibold text-gray-200">
                        Viajes del Club
                    </h2>
                </div>

                {/* Botón Crear Viaje */}
                <div className="mb-6">
                    <button
                        onClick={crearViaje}
                        className="h-10 px-4 text-gray-100 bg-green-700 rounded-lg hover:bg-green-600"
                    >
                        Crear viaje
                    </button>
                </div>

                {/* Listado de viajes */}
                <div className="grid gap-6 md:grid-cols-2">
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
                                    {formatCurrency(viaje.amount)}
                                </p>
                            </div>

                            <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
                                <div>
                                    Enviado: <span className="font-semibold">{viaje.enviado || 0}</span>
                                </div>
                                <div>
                                    Confirmados: <span className="font-semibold">{viaje.confirmados || 0}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Viajes;