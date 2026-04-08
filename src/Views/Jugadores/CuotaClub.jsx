import { useEffect, useState } from "react";
import api from "../../Api/Api";
import Swal from "sweetalert2";

const formatMoney = (value) => {
    if (value === undefined || value === null) return "$0";

    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
    }).format(Number(value));
};

const isUnlocked = (activationDate) => {
    if (!activationDate) return true;

    const date =
        activationDate?._seconds
            ? new Date(activationDate._seconds * 1000)
            : new Date(activationDate);

    return new Date() >= date;
};

function CuotaClub() {
    const [loading, setLoading] = useState(true);
    const [cuotas, setCuotas] = useState([]);

    useEffect(() => {
        fetchCuotas();
    }, []);

    const fetchCuotas = async () => {
        try {
            setLoading(true);
            // Endpoint para traer las cuotas del club
            const res = await api.get("/club/cuotas");
            setCuotas(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const pagarCuota = async (cuota) => {
        const confirm = await Swal.fire({
            title: "¿Ir a pagar la cuota?",
            text: `${cuota.monthName || `Cuota ${cuota.number}`} - ${formatMoney(cuota.amount)}`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ir a pagar",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await api.post("/pagos/crear-preferencia", {
                tipo: "club",
                cuotaId: cuota.id,
            });

            if (!res.data?.init_point) {
                throw new Error("No se recibió URL de pago");
            }

            window.location.href = res.data.init_point;
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo iniciar el pago", "error");
        }
    };

    if (loading) {
        return (
            <p className="mt-10 text-center text-gray-200">
                Cargando cuotas del club...
            </p>
        );
    }

    return (
        <div className="select-none min-h-screen bg-[url('/src/Assets/Asambal/fondodashboard.webp')]">
            <div className="px-4 mx-auto max-w-7xl">

                <div className="px-2 py-6">
                    <h2 className="text-2xl font-semibold text-gray-200">
                        Mis <span className="text-yellow-600">Cuotas del Club</span>
                    </h2>
                </div>

                <div className="grid gap-6 mt-6 md:grid-cols-2">
                    {cuotas.map((cuota) => {

                        const unlocked = isUnlocked(cuota.activationDate);
                        const isPaid = cuota.status === "acreditado";
                        const isBecado = cuota.becado;

                        return (
                            <div
                                key={cuota.id}
                                className="p-6 shadow-xl bg-white/90 backdrop-blur rounded-2xl"
                            >
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600">
                                        {cuota.monthName || `Cuota ${cuota.number}`} {cuota.year}
                                    </p>

                                    <p className="text-xl font-semibold text-gray-800">
                                        {formatMoney(cuota.amount)}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    {isBecado && (
                                        <span className="text-sm font-semibold text-blue-700">
                                            Becado
                                        </span>
                                    )}

                                    {!isBecado && isPaid && (
                                        <span className="text-sm font-semibold text-green-700">
                                            Pagado ✔
                                        </span>
                                    )}

                                    {!isBecado && !isPaid && unlocked && (
                                        <button
                                            onClick={() => pagarCuota(cuota)}
                                            className="cursor-pointer h-9 px-4 text-gray-100 bg-green-700 rounded-lg hover:bg-green-600"
                                        >
                                            Pagar
                                        </button>
                                    )}

                                    {!isBecado && !unlocked && (
                                        <span className="text-sm text-gray-500">
                                            Próximamente
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}

export default CuotaClub;