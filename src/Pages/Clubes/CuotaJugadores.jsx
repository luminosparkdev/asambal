import { useEffect, useState } from "react";
import api from "../../Api/Api";
import Swal from "sweetalert2";

function CuotaJugadores() {
    const [loading, setLoading] = useState(true);
    const [cuotas, setCuotas] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());

    const [formCuotas, setFormCuotas] = useState([
        { amount: "", activationDate: "" },
        { amount: "", activationDate: "" },
    ]);

    useEffect(() => {
        fetchCuotas();
    }, []);

    const fetchCuotas = async () => {
        try {
            setLoading(true);
            const res = await api.get("/asambal/cuotas-jugadores");
            setCuotas(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const crearCuotas = async () => {
        const confirm = await Swal.fire({
            title: "¿Crear cuotas?",
            text: "Se generarán las cuotas para jugadores.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Crear",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return;

        try {
            await api.post("/asambal/cuotas-jugadores", {
                year,
                cuotas: [
                    {
                        amount: Number(formCuotas[0].amount),
                        activationDate: formCuotas[0].activationDate,
                    },
                    {
                        amount: Number(formCuotas[1].amount),
                        activationDate: addDays(formCuotas[0].activationDate, 45),
                    },
                ],
            });

            Swal.fire("Listo", "Cuotas creadas correctamente", "success");

            setFormCuotas([
                { amount: "", activationDate: "" },
                { amount: "", activationDate: "" },
            ]);

            fetchCuotas();
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudieron crear las cuotas", "error");
        }
    };

    const updateCuota = (index, field, value) => {
        const nuevas = [...formCuotas];
        nuevas[index][field] = value;
        setFormCuotas(nuevas);
    };

    const addDays = (dateString, days) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        date.setDate(date.getDate() + days);
        return date.toISOString().split("T")[0];
    };

    const cuota2Date = addDays(formCuotas[0].activationDate, 45);

    const formatCurrency = (value) => {
        if (!value) return "";
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
        }).format(value);
    };

    const parseCurrency = (value) => {
        return Number(value.replace(/[^\d]/g, ""));
    };

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("es-AR");
    };

    if (loading) {
        return (
            <p className="mt-10 text-center text-gray-200">
                Cargando cuotas...
            </p>
        );
    }

    return (
        <div className="min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
            <div className="px-4 mx-auto max-w-7xl">

                {/* Título */}
                <div className="px-4 py-6">
                    <h2 className="text-2xl font-semibold text-gray-200">
                        Cuotas de jugadores
                        <span className="text-yellow-600"> Anual</span>
                    </h2>
                </div>

                {/* CREAR */}
                {cuotas.length === 0 && (
                    <div className="max-w-xl p-6 shadow-xl bg-white/90 backdrop-blur rounded-2xl">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800">
                            Crear cuotas
                        </h3>

                        <div className="flex flex-col gap-4">

                            <input
                                type="number"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="h-10 px-3 border border-gray-400 rounded-lg"
                                placeholder="Año"
                            />

                            {formCuotas.map((cuota, index) => (
                                <div key={index} className="grid grid-cols-3 gap-3">

                                    <div className="flex items-center text-sm font-medium text-gray-700">
                                        Cuota {index + 1}
                                    </div>

                                    <input
                                        type="text"
                                        value={formatCurrency(cuota.amount)}
                                        onChange={(e) => {
                                            const raw = parseCurrency(e.target.value);
                                            updateCuota(index, "amount", raw);
                                        }}
                                        className="h-10 px-3 border border-gray-400 rounded-lg"
                                        placeholder="$ 0"
                                    />

                                    {index === 0 ? (
                                        <input
                                            type="date"
                                            value={cuota.activationDate || ""}
                                            onChange={(e) =>
                                                updateCuota(index, "activationDate", e.target.value)
                                            }
                                            className="h-10 px-3 border border-gray-400 rounded-lg"
                                        />
                                    ) : (
                                        <div className="flex items-center h-10 px-3 border border-gray-300 rounded-lg bg-gray-100">
                                            {cuota2Date || "dd/mm/aaaa"}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button
                                onClick={crearCuotas}
                                className="h-10 text-gray-100 bg-green-700 rounded-lg hover:bg-green-600"
                            >
                                Crear cuotas
                            </button>
                        </div>
                    </div>
                )}

                {/* LISTADO */}
                {cuotas.length > 0 && (
                    <div className="p-6 mt-6 shadow-xl bg-white/90 backdrop-blur rounded-2xl">

                        <h3 className="mb-4 text-lg font-semibold text-gray-800">
                            Cuotas {year}
                        </h3>

                        <div className="grid grid-cols-3 gap-4">
                            {cuotas.map((cuota) => (
                                <div
                                    key={cuota.number}
                                    className="p-4 border rounded-lg bg-gray-50"
                                >
                                    <p className="text-sm text-gray-600">
                                        Cuota {cuota.number}
                                    </p>

                                    <p className="text-xl font-bold text-gray-800">
                                        {formatCurrency(cuota.amount)}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Habilitada: {formatDate(cuota.activationDate)}
                                    </p>
                                </div>
                            ))}
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}

export default CuotaJugadores;