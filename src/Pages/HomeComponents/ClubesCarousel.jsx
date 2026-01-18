import { motion as Motion } from "framer-motion";
import logo from "../../../src/Assets/Asambal/logo.png"

const clubes = Array(12).fill(logo);

function ClubesCarousel() {
  return (
    <main className="bg-gradient-to-b from-[#334353] to-white">
    <section className="py-16 overflow-hidden mx-auto max-w-7xl">
      <h2 className="mb-8 text-4xl font-bold text-center">
        CLUBES
      </h2>

      <Motion.div
        className="flex gap-10 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -1000, right: 0 }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: "linear",
        }}
      >
        {[...clubes, ...clubes].map((logo, index) => (
          <div
            key={index}
            className="flex items-center justify-center bg-white shadow min-w-56 h-30 rounded-xl"
          >
            <img
              src={logo}
              alt="Club de handball ASAMBAL"
              className="object-contain h-20"
              draggable="false"
            />
          </div>
        ))}
      </Motion.div>
    </section>
    </main>
  );
}

export default ClubesCarousel;
