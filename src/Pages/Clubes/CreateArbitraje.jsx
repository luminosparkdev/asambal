import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import api from "../../Api/Api";
import { useAuth } from "../../Auth/AuthContext";

export default function CreateArbitraje() {

    const [form, setForm] = useState({
        titulo: "",
        descripcion: "",
        categorias: [],
        monto: "",
    });

    const [categoriasDisponibles,
        setCategoriasDisponibles] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [initialLoading,
        setInitialLoading] =
        useState(true);

    const { activeClubId } =
        useAuth();

    useEffect(() => {

        const fetchCategorias =
            async () => {

                try {

                    const res =
                        await api.get(
                            "/categories"
                        );

                    const data =
                        Array.isArray(
                            res.data
                        )
                            ? res.data
                            : res.data.data || [];

                    setCategoriasDisponibles(
                        data.map((cat) => ({
                            id:
                                cat.id ||
                                cat._id,
                            nombre:
                                cat.nombre,
                            genero:
                                cat.genero ||
                                "",
                        }))
                    );

                } catch (err) {

                    console.error(
                        "Error categorías",
                        err
                    );

                    setCategoriasDisponibles(
                        []
                    );

                } finally {

                    setInitialLoading(
                        false
                    );
                }
            };

        fetchCategorias();

    }, []);

    const toggleCategoria = (id) => {

        setForm((prev) => {

            const exists =
                prev.categorias.includes(
                    id
                );

            return {
                ...prev,
                categorias: exists
                    ? prev.categorias.filter(
                        (c) => c !== id
                    )
                    : [
                        ...prev.categorias,
                        id,
                    ],
            };
        });
    };

    const selectAllCategorias = () => {

        setForm((prev) => ({
            ...prev,
            categorias:
                categoriasDisponibles.map(
                    (cat) => cat.id
                ),
        }));
    };

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            if (!activeClubId) {

                return Swal.fire(
                    "Error",
                    "No hay club seleccionado",
                    "error"
                );
            }

            if (!form.titulo.trim()) {

                return Swal.fire(
                    "Error",
                    "Ingresá un título",
                    "error"
                );
            }

            if (
                !form.monto ||
                Number(form.monto) <= 0
            ) {

                return Swal.fire(
                    "Error",
                    "Monto inválido",
                    "error"
                );
            }

            const payload = {
                ...form,
                clubId:
                    activeClubId,
                monto: Number(
                    form.monto
                ),
            };

            try {

                // PREVIEW
                const previewRes =
                    await api.post(
                        "/arbitrajes",
                        {
                            ...payload,
                            preview: true,
                        }
                    );

                const {
                    jugadores,
                    total,
                } = previewRes.data;

                if (jugadores === 0) {

                    return Swal.fire(
                        "Info",
                        "No hay jugadores para este arbitraje",
                        "info"
                    );
                }

                const confirm =
                    await Swal.fire({

                        title:
                            "¿Crear arbitraje?",

                        html: `
                            Se incluirán
                            <b>${jugadores}</b>
                            jugadores
                            <br/>
                            Total:
                            <b>
                                $
                                ${total.toLocaleString("es-AR")}
                            </b>
                        `,

                        icon: "warning",

                        showCancelButton: true,

                        confirmButtonText:
                            "Sí, crear",

                        cancelButtonText:
                            "Cancelar",

                        background:
                            "#0f172a",

                        color:
                            "#e5e7eb",

                        confirmButtonColor:
                            "#16a34a",
                    });

                if (!confirm.isConfirmed)
                    return;

                setLoading(true);

                const res =
                    await api.post(
                        "/arbitrajes",
                        payload
                    );

                await Swal.fire({

                    icon: "success",

                    title:
                        "Arbitraje creado",

                    text:
                        res.data.message,

                    confirmButtonText:
                        "Aceptar",

                    background:
                        "#0f172a",

                    color:
                        "#e5e7eb",

                    confirmButtonColor:
                        "#16a34a",
                });

                setForm({
                    titulo: "",
                    descripcion: "",
                    categorias: [],
                    monto: "",
                });

            } catch (err) {

                console.error(err);

                Swal.fire(
                    "Error",
                    "Error al crear arbitraje",
                    "error"
                );

            } finally {

                setLoading(false);
            }
        };

    if (initialLoading) {

        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">

                <div className="flex flex-col items-center gap-3">

                    <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>

                    <p className="text-gray-300">
                        Cargando...
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4 bg-[url('/src/assets/Asambal/fondodashboard.webp')]">

            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                className="w-full max-w-2xl p-6 border border-gray-500 shadow-xl backdrop-blur rounded-2xl"
            >

                <h1 className="text-2xl font-bold text-gray-200">
                    Crear arbitraje
                </h1>

                <p className="mb-6 text-sm text-gray-300">
                    Configurá un nuevo arbitraje
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                >

                    <input
                        type="text"
                        placeholder="Título"
                        value={form.titulo}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                titulo:
                                    e.target.value,
                            })
                        }
                        className="px-3 py-2 text-gray-200 bg-gray-800 border border-gray-500 rounded"
                    />

                    <textarea
                        placeholder="Descripción"
                        value={form.descripcion}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                descripcion:
                                    e.target.value,
                            })
                        }
                        className="px-3 py-2 text-gray-200 bg-gray-800 border border-gray-500 rounded"
                    />

                    {/* Categorías */}

                    <div>

                        <label className="text-sm text-gray-300">
                            Categorías
                        </label>

                        <button
                            type="button"
                            onClick={
                                selectAllCategorias
                            }
                            className="mx-4 px-4 bg-gray-700 border border-gray-500 rounded text-xs text-blue-400 hover:text-blue-600"
                        >
                            Seleccionar todo
                        </button>

                        <div className="flex flex-wrap gap-2 mt-2">

                            {categoriasDisponibles.map(
                                (cat) => {

                                    const active =
                                        form.categorias.includes(
                                            cat.id
                                        );

                                    return (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() =>
                                                toggleCategoria(
                                                    cat.id
                                                )
                                            }
                                            className={`
                                                px-3 py-1.5
                                                text-xs
                                                rounded-full
                                                border
                                                w-40
                                                ${
                                                    active
                                                        ? "bg-green-600 border-green-500 text-white"
                                                        : "border-gray-500 text-gray-300 hover:bg-gray-700"
                                                }
                                            `}
                                        >
                                            {cat.nombre}
                                        </button>
                                    );
                                }
                            )}

                        </div>

                    </div>

                    {/* MONTO */}

                    <div className="relative">

                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                            $
                        </span>

                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder="Monto"
                            value={
                                form.monto
                                    ? Number(
                                        form.monto
                                    ).toLocaleString(
                                        "es-AR"
                                    )
                                    : ""
                            }
                            onChange={(e) => {

                                const raw =
                                    e.target.value.replace(
                                        /\D/g,
                                        ""
                                    );

                                setForm({
                                    ...form,
                                    monto: raw,
                                });
                            }}
                            className="w-full pl-7 pr-3 py-2 text-gray-200 bg-gray-800 border border-gray-500 rounded outline-none"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-gray-200 bg-green-700 border border-green-500 rounded hover:bg-green-600"
                    >
                        {
                            loading
                                ? "Creando..."
                                : "Crear arbitraje"
                        }
                    </button>

                </form>

            </motion.div>

        </div>
    );
}