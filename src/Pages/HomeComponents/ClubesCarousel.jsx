import { motion as Motion } from "framer-motion";
import Alsina from "../../../public/Assets/Asambal/Logos/AlsinaChivilcoy.png"
import Tapalque from "../../../public/Assets/Asambal/Logos/AtleticoTapalque.png"
import Azul from "../../../public/Assets/Asambal/Logos/AzulHandball.png"
import Nuevedejulio from "../../../public/Assets/Asambal/Logos/CDyS9dejulioChacabuco.png"
import EmhChacabuco from "../../../public/Assets/Asambal/Logos/EMHChacabuco.png"
import EmhMercedes from "../../../public/Assets/Asambal/Logos/EmhMercedes.png"
import EmhMonte from "../../../public/Assets/Asambal/Logos/EscMunHandballMonte.png"
import Olavarria from "../../../public/Assets/Asambal/Logos/EstudiantesOlavarria.png"
import Veinticinco from "../../../public/Assets/Asambal/Logos/Handball25DEMAYO.png"
import Independiente from "../../../public/Assets/Asambal/Logos/Independiente.png"
import Bragado from "../../../public/Assets/Asambal/Logos/MarianomorenoBragado.png"
import Riestra from "../../../public/Assets/Asambal/Logos/Riestra.png"
import Lincoln from "../../../public/Assets/Asambal/Logos/RivadaviaLincoln.png"
import RoquePerez from "../../../public/Assets/Asambal/Logos/Roqueperez.png"

const clubes = [
  Alsina,
  Tapalque,
  Azul,
  Nuevedejulio,
  EmhChacabuco,
  EmhMercedes,
  EmhMonte,
  Olavarria,
  Veinticinco,
  Independiente,
  Bragado,
  Riestra,
  Lincoln,
  RoquePerez
]

function ClubesCarousel() {
  return (
    <main className="bg-gradient-to-b from-[#334353] to-white" id="clubes">
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
