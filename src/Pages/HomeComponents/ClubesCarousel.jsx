import { motion as Motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import Alsina from "../../Assets/Asambal/Logos/AlsinaChivilcoy.png";
import Tapalque from "../../Assets/Asambal/Logos/AtleticoTapalque.png";
import Azul from "../../Assets/Asambal/Logos/AzulHandball.png";
import Nuevedejulio from "../../Assets/Asambal/Logos/CDyS9dejulioChacabuco.png";
import EmhChacabuco from "../../Assets/Asambal/Logos/EMHChacabuco.png";
import EmhMercedes from "../../Assets/Asambal/Logos/EmhMercedes.png";
import EmhMonte from "../../Assets/Asambal/Logos/EscMunHandballMonte.png";
import Olavarria from "../../Assets/Asambal/Logos/EstudiantesOlavarria.png";
import Veinticinco from "../../Assets/Asambal/Logos/Handball25DEMAYO.png";
import Independiente from "../../Assets/Asambal/Logos/Independiente.png";
import Bragado from "../../Assets/Asambal/Logos/MarianomorenoBragado.png";
import Riestra from "../../Assets/Asambal/Logos/Riestra.png";
import Lincoln from "../../Assets/Asambal/Logos/RivadaviaLincoln.png";
import RoquePerez from "../../Assets/Asambal/Logos/Roqueperez.png";

const clubes = [
  Alsina, Tapalque, Azul, Nuevedejulio, EmhChacabuco, EmhMercedes, EmhMonte,
  Olavarria, Veinticinco, Independiente, Bragado, Riestra, Lincoln, RoquePerez,
];

function ClubesCarousel() {
  const carouselRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [x, setX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const speed = 0.3; // px/frame para autoplay

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    let animationFrame;

    const animate = () => {
      if (!dragging) {
        let newX = x - speed;
        if (newX < -width) newX = 0; // loop infinito
        setX(newX);
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [x, dragging, width]);

  return (
    <main className="bg-gradient-to-b from-[#334353] to-white" id="clubes">
      <section className="py-16 overflow-hidden mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-4xl font-bold text-center">CLUBES</h2>

        <Motion.div
          ref={carouselRef}
          className="flex gap-10 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: -width, right: 0 }}
          dragElastic={0.05}
          style={{ x }}
          onDragStart={() => setDragging(true)}
          onDragEnd={() => setDragging(false)}
        >
          {clubes.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center bg-white shadow min-w-[220px] h-32 rounded-xl"
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