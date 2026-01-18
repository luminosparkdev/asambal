import { motion as Motion } from "framer-motion";
import logo from "../../../src/Assets/Asambal/logo.png"

const sponsors = Array(10).fill(logo);

function Sponsors() {
    return (
        <main className="bg-gradient-to-b from-[#334353] to-[#0F1317]">
        <section className="py-10 overflow-hidden text-black mx-auto max-w-7xl">
            <h2 className="mb-12 text-3xl font-bold text-center">
                Sponsors oficiales
            </h2>

            {/* Línea superior */}
            <Motion.div
                className="flex gap-10 mb-8"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                    repeat: Infinity,
                    duration: 40,
                    ease: "linear",
                }}
            >
                {[...sponsors, ...sponsors].map((logo, i) => (
                    <SponsorItem key={i} logo={logo} />
                ))}
            </Motion.div>

            {/* Línea inferior (más rápida y sentido contrario) */}
            <Motion.div
                className="flex gap-10"
                animate={{ x: ["-50%", "0%"] }}
                transition={{
                    repeat: Infinity,
                    duration: 25,
                    ease: "linear",
                }}
            >
                {[...sponsors, ...sponsors].map((logo, i) => (
                    <SponsorItem key={i} logo={logo} />
                ))}
            </Motion.div>
        </section>
    </main>
    );
}

function SponsorItem({ logo }) {
    return (
        <div className="flex items-center justify-center bg-white min-w-50 h-30 backdrop-blur rounded-xl">
            <img
                src={logo}
                alt="Sponsor ASAMBAL"
                className="object-contain h-16"
            />
        </div>
    );
}

export default Sponsors;
