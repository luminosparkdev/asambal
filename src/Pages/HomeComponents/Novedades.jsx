import { useState } from "react";
import hero from "../../../src/Assets/hero.png";

const novedades = [
    {
        id: 1,
        title: "Comienza el Torneo Apertura 2026",
        image: hero,
        text: "Este fin de semana comienza el Torneo Apertura de ASAMBAL con la participación de más de 20 clubes..."
    },
    {
        id: 2,
        title: "Capacitación para árbitros",
        image: hero,
        text: "Se realizó una nueva jornada de capacitación para árbitros federados con disertantes nacionales..."
    },
    {
        id: 3,
        title: "Inscripción a viajes",
        image: hero,
        text: "Nueva forma de inscribirte..."
    }
];

function Novedades() {
    return (
        <section className="px-4 py-16 mx-auto max-w-7xl">
            <h2 className="mb-10 text-3xl font-bold text-center">
                Novedades
            </h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {novedades.map((item) => (
                    <NovedadCard key={item.id} {...item} />
                ))}
            </div>
        </section>
    );
}

function NovedadCard({ title, image, text }) {
    const [open, setOpen] = useState(false);

    return (
        <article className="overflow-hidden bg-white shadow rounded-xl">
            <img
                src={image}
                alt={title}
                className="object-cover w-full h-48"
            />

            <div className="p-6">
                <h3 className="flex mb-2 text-lg font-bold h-14 items-top">
                    {title}
                </h3>

                <p className={`text-gray-600 text-sm h-16 ${!open && "line-clamp-3"}`}>
                    {text}
                </p>

                <button
                    onClick={() => setOpen(!open)}
                    className="mt-3 text-sm font-medium text-blue-700 hover:underline"
                >
                    {open ? "Mostrar menos" : "Seguir leyendo"}
                </button>
            </div>
        </article>
    );
}

export default Novedades;
