import { motion as Motion } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import hero from "../../../src/Assets/hero.png";

function Hero() {
    return (
        <main>
            <section
                className="relative flex flex-col items-center justify-center bg-center bg-cover h-[70vh]"
                style={{
                    backgroundImage: `url(${hero})`,
                    backgroundPosition: `center 30%`,
                }}
            >
            </section>
            <section className="bg-linear-to-b from-blue-900 to-gray-300 flex justify-center gap-y-4 h-[20vh]">
                <p className="text-xl font-light text-gray-200 mt-14">Explorá nuestra web</p>
                {/* Flechita animada */}
                <Motion.div
                    className="absolute -translate-x-1/2 cursor-pointer bottom-8 left-1/2"
                    animate={{ y: [0, 15, 0] }} // Movimiento hacia abajo y vuelve
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    onClick={() =>
                        window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
                    }
                >
                    <ChevronDownIcon className="w-10 h-10 text-gray-900" />
                </Motion.div>
            </section>
        </main>
    );
}

export default Hero;