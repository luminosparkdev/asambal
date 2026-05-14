import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import api from "../../Api/Api";
import { useAuth } from "../../Auth/AuthContext";

export default function CreateTrip() {
    const [form, setForm] = useState({
        fechaSalida: "",
        horaSalida: "",
        destino: "",
        categorias: [],
        profes: [],
        monto: "",
        cupoMax: "",
    });

    const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
    const [profesDisponibles, setProfesDisponibles] = useState([]);
    const [loading, setLoading] = useState(false);

    const { activeClubId } = useAuth();

    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const res = await api.get("/categories");

                const data = Array.isArray(res.data)
                    ? res.data
                    : res.data.data || [];

                setCategoriasDisponibles(
                    data.map((cat) => ({
                        id: cat.id || cat._id,
                        nombre: cat.nombre,
                        genero: cat.genero || cat.sexo || "",
                    }))
                );
            } catch (err) {
                console.error("Error categorías", err);
                setCategoriasDisponibles([]);
            }
        };

        const fetchProfes = async () => {
            try {
                const res = await api.get("/coaches/club");

                const data = Array.isArray(res.data)
                    ? res.data
                    : res.data.data || [];

                setProfesDisponibles(
                    data
                        .filter((p) => p.status === "ACTIVO")
                        .map((p) => ({
                            id: p.id || p._id,
                            nombre: `${p.nombre} ${p.apellido}`,
                        }))
                );
            } catch (err) {
                console.error("Error profes", err);
                setProfesDisponibles([]);
            }
        };

        const loadAll = async () => {
            setInitialLoading(true);

            await Promise.all([fetchCategorias(), fetchProfes()]);

            setInitialLoading(false);
        };

        loadAll();
    }, []);

    const toggleCategoria = (id) => {
        setForm((prev) => {
            const exists = prev.categorias.includes(id);
            return {
                ...prev,
                categorias: exists
                    ? prev.categorias.filter((c) => c !== id)
                    : [...prev.categorias, id],
            };
        });
    };

    const toggleProfe = (id) => {
        setForm((prev) => {
            const exists = prev.profes.includes(id);
            return {
                ...prev,
                profes: exists
                    ? prev.profes.filter((p) => p !== id)
                    : [...prev.profes, id],
            };
        });
    };

    const selectAllCategorias = () => {
        setForm((prev) => ({
            ...prev,
            categorias: categoriasDisponibles.map((cat) => cat.id),
        }));
    };

    const selectAllProfes = () => {
        setForm((prev) => ({
            ...prev,
            profes: profesDisponibles.map((p) => p.id),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!activeClubId) {
            return Swal.fire("Error", "No hay club seleccionado", "error");
        }

        if (!form.fechaSalida || !form.horaSalida) {
            return Swal.fire("Error", "Completá fecha y hora de salida", "error");
        }

        if (!form.destino.trim()) {
            return Swal.fire("Error", "Ingresá un destino", "error");
        }

        if (form.categorias.length === 0) {
            return Swal.fire("Error", "Seleccioná al menos una categoría", "error");
        }

        if (!form.cupoMax || Number(form.cupoMax) <= 0) {
            return Swal.fire("Error", "El cupo debe ser mayor a 0", "error");
        }

        const payload = {
            ...form,
            clubId: activeClubId,
            monto: Number(form.monto || 0),
            cupoMax: Number(form.cupoMax),

            categoriasDetalle: categoriasDisponibles
                .filter((c) => form.categorias.includes(c.id))
                .map((c) => ({
                    id: c.id,
                    nombre: c.nombre,
                    genero: c.genero,
                })),
        };

        try {
            // 🔮 PREVIEW
            const previewRes = await api.post("/viajes/crear", {
                ...payload,
                preview: true,
            });

            const { jugadores, profes, total } = previewRes.data;

            if (total === 0) {
                return Swal.fire("Info", "No hay participantes para este viaje", "info");
            }

            const confirm = await Swal.fire({
                title: "¿Crear viaje?",
                html: `
          Se invitarán <b>${jugadores}</b> jugadores<br/>
          y <b>${profes}</b> profes
        `,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, crear",
                cancelButtonText: "Cancelar",
                background: "#0f172a",
                color: "#e5e7eb",
                confirmButtonColor: "#16a34a",
            });

            if (!confirm.isConfirmed) return;

            setLoading(true);

            const res = await api.post("/viajes/crear", payload);

            await Swal.fire({
                icon: "success",
                title: "Viaje creado",
                text: res.data.message,
                confirmButtonText: "Aceptar",
                background: "#0f172a",
                color: "#e5e7eb",
                confirmButtonColor: "#16a34a",
            });

            setForm({
                fechaSalida: "",
                horaSalida: "",
                destino: "",
                categorias: [],
                profes: [],
                monto: "",
                cupoMax: "",
            });

        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Error al crear el viaje", "error");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl p-6 border border-gray-500 shadow-xl backdrop-blur rounded-2xl"
            >
                <h1 className="text-2xl font-bold text-gray-200">Crear viaje</h1>
                <p className="mb-6 text-sm text-gray-300">Configurá un nuevo viaje</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex gap-3">
                        <input
                            type="date"
                            value={form.fechaSalida}
                            onChange={(e) => setForm({ ...form, fechaSalida: e.target.value })}
                            className="w-full px-3 py-2 text-gray-200 bg-gray-800 border border-gray-500 rounded"
                        />

                        <input
                            type="time"
                            value={form.horaSalida}
                            onChange={(e) => setForm({ ...form, horaSalida: e.target.value })}
                            className="w-full px-3 py-2 text-gray-200 bg-gray-800 border border-gray-500 rounded"
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Destino"
                        value={form.destino}
                        onChange={(e) => setForm({ ...form, destino: e.target.value })}
                        className="px-3 py-2 text-gray-200 bg-gray-800 border border-gray-500 rounded"
                    />

                    {/* Categorías */}
                    <div>
                        <label className="text-sm text-gray-300">Categorías</label>
                        <button
                            type="button"
                            onClick={selectAllCategorias}
                            className="mx-4 px-4 bg-gray-700 border border-gray-500 rounded text-xs text-blue-400 hover:text-blue-600"
                        >
                            Seleccionar todo
                        </button>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {categoriasDisponibles.map((cat) => {
                                const active = form.categorias.includes(cat.id);
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => toggleCategoria(cat.id)}
                                        className={`px-3 py-1.5 text-xs rounded-full border w-40
                      ${active
                                                ? "bg-green-600 border-green-500 text-white"
                                                : "border-gray-500 text-gray-300 hover:bg-gray-700"}`}
                                    >
                                        {cat.nombre} {cat.genero ? `• ${cat.genero}` : ""}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Profes */}
                    <div>
                        <label className="text-sm text-gray-300">Profes</label>
                        <button
                            type="button"
                            onClick={selectAllProfes}
                            className="mx-4 px-4 bg-gray-700 border border-gray-500 rounded text-xs text-blue-400 hover:text-blue-600"
                        >
                            Seleccionar todo
                        </button>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {profesDisponibles.map((p) => {
                                const active = form.profes.includes(p.id);
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => toggleProfe(p.id)}
                                        className={`px-3 py-1.5 text-xs rounded-full border
                      ${active
                                                ? "bg-blue-600 border-blue-500 text-white"
                                                : "border-gray-500 text-gray-300 hover:bg-gray-700"}`}
                                    >
                                        {p.nombre}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {/* MONTO */}
                        <div className="relative w-1/2">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                                $
                            </span>
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="Monto"
                                value={
                                    form.monto
                                        ? Number(form.monto).toLocaleString("es-AR")
                                        : ""
                                }
                                onChange={(e) => {
                                    const raw = e.target.value.replace(/\D/g, "");
                                    setForm({
                                        ...form,
                                        monto: raw,
                                    });
                                }}
                                className="w-full pl-7 pr-3 py-2 text-gray-200 bg-gray-800 border border-gray-500 rounded outline-none"
                            />
                        </div>

                        {/* CUPOS */}
                        <div className="w-1/2">
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="Cantidad de asientos"
                                value={form.cupoMax}
                                onChange={(e) => {
                                    const raw = e.target.value.replace(/\D/g, "");
                                    setForm({
                                        ...form,
                                        cupoMax: raw,
                                    });
                                }}
                                className="w-full px-3 py-2 text-gray-200 bg-gray-800 border border-gray-500 rounded outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-gray-200 bg-green-700 border border-green-500 rounded hover:bg-green-600"
                    >
                        {loading ? "Creando..." : "Crear viaje"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}