import { useEffect, useState, useRef } from "react";
import api from "../../Api/Api";

function Fixture() {
    const [fechas, setFechas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(0);

    const touchStartX = useRef(0);

    useEffect(() => {
        const getFixture = async () => {
            try {
                const res = await api.get("/fixture");

                let docs = Array.isArray(res.data)
                    ? res.data
                    : res.data.fixture || Object.values(res.data);

                const parsed = docs.map((doc, index) => ({
                    id: doc.id || index,
                    fechanumero: doc.fechanumero || "0",
                    fecha: doc.fecha,
                    partidos: doc.partidos ? Object.values(doc.partidos) : [],
                }));

                parsed.sort((a, b) => {
                    const fa = a.fecha?._seconds || 0;
                    const fb = b.fecha?._seconds || 0;
                    return fa - fb;
                });

                const now = Date.now();

                let nextIndex = parsed.findIndex((f) => {
                    if (!f.fecha) return false;
                    return f.fecha._seconds * 1000 >= now;
                });

                if (nextIndex === -1) nextIndex = 0;

                setFechas(parsed);
                setActiveIndex(nextIndex);
                setNextIndex(nextIndex);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getFixture();
    }, []);

    const prev = () => setActiveIndex((i) => Math.max(0, i - 1));
    const next = () => setActiveIndex((i) => Math.min(fechas.length - 1, i + 1));

    // 👉 SWIPE MOBILE
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;

        if (diff > 50) next();
        if (diff < -50) prev();
    };

    if (loading) return <p className="p-10">Cargando fixture...</p>;

    return (
        <main className="bg-white min-h-screen py-10">
            <section className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold mb-6">FIXTURE</h1>

                {/* 🚨 MENSAJE */}
                <div className="mx-4 mb-6 p-4 rounded-xl border border-yellow-300 bg-yellow-50 text-yellow-800 text-sm">
                    <span className="font-semibold">⚠ IMPORTANTE:</span>{" "}
                        El fixture puede sufrir modificaciones por cuestiones organizativas, climáticas o administrativas.
                    </div>

                {/* 🎯 SLIDER */}
                <div
                    className="relative overflow-hidden h-[420px]"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {fechas.map((fecha, index) => {
                        const offset = index - activeIndex;

                        return (
                            <div
                                key={fecha.id}
                                className="absolute top-0 left-0 w-full flex justify-center transition-all duration-500 ease-out"
                                style={{
                                    transform: `translateX(${offset * 100}%) scale(${offset === 0 ? 1 : 0.85})`,
                                    opacity: offset === 0 ? 1 : 0.3,
                                    zIndex: offset === 0 ? 10 : 1,
                                }}
                            >
                                <Card
                                    fecha={fecha}
                                    active={offset === 0}
                                    isProxima={index === nextIndex}
                                />
                            </div>
                        );
                    })}

                    {/* BOTONES */}
                    <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow px-3 py-2 rounded-full"
                    >
                        ←
                    </button>

                    <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow px-3 py-2 rounded-full"
                    >
                        →
                    </button>
                </div>

                {/* DOTS */}
                <div className="flex justify-center mt-6 gap-2">
                    {fechas.map((_, i) => (
                        <div
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                                i === activeIndex
                                    ? "bg-black scale-125"
                                    : "bg-gray-300"
                            }`}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}

function Card({ fecha, active, isProxima }) {
    const now = Date.now();

    const inicio = fecha.fecha?._seconds * 1000;
    const fin = inicio + 1000 * 60 * 60 * 12;

    let estado = "";

    // 🔥 PRIORIDAD: EN VIVO
    if (now >= inicio && now <= fin) {
        estado = "EN VIVO";
    }
    // 🔥 SI NO está en vivo, solo la activa es PRÓXIMA
    else if (isProxima && now < inicio) {
        estado = "PRÓXIMA";
    }
    // 🔥 FINALIZADO
    else if (now > fin) {
        estado = "FINALIZADO";
    }

    const fechaObj = new Date(inicio);
    const fechaFormateada = fechaObj
        .toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
        .replace(/\//g, "-");

    return (
        <div
            className={`
                w-full max-w-md rounded-2xl p-5 transition-all
                ${
                    active
                        ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-2xl"
                        : "bg-gray-100 text-gray-600"
                }
            `}
        >
            {/* HEADER EN UNA LINEA */}
            <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center gap-3">
                    <span className="font-bold">
                        Fecha {fecha.fechanumero}
                    </span>

                    <span className="opacity-70">
                        {fechaFormateada}
                    </span>
                </div>

                {estado && (
                    <span
                        className={`
                            text-[10px] px-2 py-1 rounded-full font-bold
                            ${
                                estado === "EN VIVO"
                                    ? "bg-red-500 text-white animate-pulse"
                                    : estado === "FINALIZADO"
                                    ? "bg-gray-500 text-white"
                                    : "bg-yellow-400 text-black"
                            }
                        `}
                    >
                        {estado}
                    </span>
                )}
            </div>

            {/* CTA */}
            {estado === "EN VIVO" && (
                <a
                    href="https://youtube.com/@Asambal"
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center text-xs bg-red-600 text-white py-2 rounded mb-3 hover:bg-red-700 transition"
                >
                    Ver en YouTube 🔴
                </a>
            )}

            {/* PARTIDOS */}
            <div className="flex flex-col gap-3">
                {fecha.partidos.map((p, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between bg-white/10 p-2 rounded text-xs"
                    >
                        {/* LOCAL */}
                        <div className="flex items-center gap-2 w-1/3">
                            {p?.local?.logo && (
                                <img src={p.local.logo} className="h-6" />
                            )}
                            {p?.local?.logoalternativo && (
                                <img
                                    src={p.local.logoalternativo}
                                    className="h-4 opacity-70"
                                />
                            )}
                            <span className="truncate">
                                {p?.local?.club}
                            </span>
                        </div>

                        <span className="font-bold">VS</span>

                        {/* VISITANTE */}
                        <div className="flex items-center gap-2 w-1/3 justify-end">
                            <span className="truncate">
                                {p?.visitante?.club}
                            </span>
                            {p?.visitante?.logoalternativo && (
                                <img
                                    src={p.visitante.logoalternativo}
                                    className="h-4 opacity-70"
                                />
                            )}
                            {p?.visitante?.logo && (
                                <img src={p.visitante.logo} className="h-6" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Fixture;