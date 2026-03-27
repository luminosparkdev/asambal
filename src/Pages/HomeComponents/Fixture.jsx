import { useEffect, useState } from "react";
import api from "../../Api/Api";

function Fixture() {
    const [fechas, setFechas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getFixture = async () => {
            try {
                const res = await api.get("/fixture");

                console.log("RESPUESTA:", res.data);

                let docs = [];

                if (Array.isArray(res.data)) {
                    docs = res.data;
                } else if (res.data.fixture) {
                    docs = res.data.fixture;
                } else {
                    docs = Object.values(res.data);
                }

                const parsed = docs.map((doc, index) => {
                    // partidos (map) → array
                    let partidosArray = [];

                    if (doc.partidos) {
                        partidosArray = Object.keys(doc.partidos).map(
                            (key) => doc.partidos[key]
                        );
                    }

                    return {
                        id: doc.id || index,
                        fechanumero: doc.fechanumero || "0",
                        partidos: partidosArray,
                    };
                });

                // ordenar fechas
                parsed.sort((a, b) => Number(a.fechanumero) - Number(b.fechanumero));

                setFechas(parsed);
            } catch (error) {
                console.error("ERROR CARGANDO FIXTURE:", error);
            } finally {
                setLoading(false);
            }
        };

        getFixture();
    }, []);

    if (loading) return <p className="p-10">Cargando fixture...</p>;

    return (
        <main className="bg-white min-h-screen py-10">
            <section className="max-w-5xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8">
                    FIXTURE
                </h1>

                {fechas.length === 0 && (
                    <p className="text-center">No hay datos</p>
                )}

                {fechas.map((fecha) => (
                    <div key={fecha.id} className="mb-10">
                        <h2 className="text-xl font-semibold mb-4">
                            Fecha {fecha.fechanumero}
                        </h2>

                        <div className="flex flex-col gap-3">
                            {fecha.partidos.map((p, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
                                >
                                    {/* LOCAL */}
                                    <div className="flex items-center gap-2 w-1/3">
                                        {p?.local?.logo && (
                                            <img
                                                src={p.local.logo}
                                                alt=""
                                                className="h-8"
                                            />
                                        )}
                                        <span className="text-sm">
                                            {p?.local?.club || "Sin nombre"}
                                        </span>
                                    </div>

                                    {/* VS */}
                                    <div className="w-1/3 text-center font-bold">
                                        vs
                                    </div>

                                    {/* VISITANTE */}
                                    <div className="flex items-center justify-end gap-2 w-1/3">
                                        <span className="text-sm">
                                            {p?.visitante?.club || "Sin nombre"}
                                        </span>

                                        {/* logo alternativo */}
                                        {p?.visitante?.logoalternativo && (
                                            <img
                                                src={p.visitante.logoalternativo}
                                                alt=""
                                                className="h-5 opacity-70"
                                            />
                                        )}

                                        {p?.visitante?.logo && (
                                            <img
                                                src={p.visitante.logo}
                                                alt=""
                                                className="h-8"
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );
}

export default Fixture;