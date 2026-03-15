import { useState } from "react";
import costos from "../../../src/Assets/costos.jpeg";
import comunicado from "../../../src/Assets/comunicado.jpeg";
import torneo from "../../../src/Assets/torneos.jpeg";
import { main } from "framer-motion/client";

const novedades = [
    {
        id: 1,
        title: "Comienza el Torneo Apertura 2026",
        image: torneo,
        text: "Arranca el torneo apertura 2026. Conocé el fixture",
        link: "https://www.instagram.com/p/DV4wol9kekD/?img_index=1"
    },
    {
        id: 2,
        title: "Costos federativos 2026",
        image: costos,
        text: "Conocé los costos de la federación para el año 2026",
        link: "https://www.instagram.com/p/DV4fLGJESqD/"
    },
    {
        id: 3,
        title: "Comunicado oficial",
        image: comunicado,
        text: "Comunicado oficial sobre la inscripción al torneo apertura 2026",
        link: "https://www.instagram.com/p/DVhHXdbEaDC"
    }
];

function Novedades() {
    return (
        <main className="bg-gradient-to-b from-white to-[#334353]" id= "novedades">
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
    </main>
    );
}

function NovedadCard({ title, image, text, link }) {
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

                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-sm font-medium text-blue-700 hover:underline"
                >
                Seguir leyendo
                </a>
            </div>
        </article>
    );
}

export default Novedades;
