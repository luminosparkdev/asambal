import { motion as Motion } from "framer-motion";
import logo from "../../../src/Assets/Asambal/logo.png"
import hero from "../../../src/Assets/hero.png";

const clubes = Array(12).fill(logo);

function ClubesCarousel() {
  return (
    <main>
    <section className="flex flex-col items-center justify-center h-screen bg-center bg-cover" style={{ backgroundImage: `url(${hero})` }} >
    </section>

    <section className="py-16 overflow-hidden">
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
            />
          </div>
        ))}
      </Motion.div>
    </section>
    </main>
  );
}

export default ClubesCarousel;
