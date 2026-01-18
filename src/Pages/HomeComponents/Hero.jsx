import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import hero from "../../../src/Assets/heroasambal.webp";
import { useState, useEffect } from "react";

function Hero() {
  const [showHandball, setShowHandball] = useState(false);
  const [showAsambal, setShowAsambal] = useState(false);
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    // HANDBALL aparece poco después de SOMOS
    const t0 = setTimeout(() => setShowHandball(true), 900);
    // Cambio a ASAMBAL
    const t1 = setTimeout(() => setShowAsambal(true), 2200);
    // Tagline más tardío
    const t2 = setTimeout(() => setShowTagline(true), 3800);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <main>
      {/* HERO */}
      <section
        className="relative flex items-center justify-center h-[85vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${hero})`,
          backgroundPosition: "center 55%",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* SOMOS */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.6, // más largo
              delay: 0.2,    // casi inmediato
              ease: "easeOut",
            }}
            className="text-5xl md:text-6xl font-bold text-white"
          >
            SOMOS
          </motion.h1>

          {/* HANDBALL / ASAMBAL */}
          <div className="relative h-[90px] mt-2 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {showHandball && !showAsambal && (
                <motion.h2
                  key="handball"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.6, // más corto
                    ease: "easeOut",
                  }}
                  className="text-6xl md:text-7xl font-extrabold text-orange-500"
                >
                  HANDBALL
                </motion.h2>
              )}

              {showAsambal && (
                <motion.h2
                  key="asambal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 1.1, // se mantiene
                    ease: "easeOut",
                  }}
                  className="text-6xl md:text-7xl font-extrabold text-orange-500"
                >
                  ASAMBAL
                </motion.h2>
              )}
            </AnimatePresence>
          </div>

          {/* TAGLINE (espacio reservado) */}
          <div className="h-[40px] mt-4">
            <AnimatePresence>
              {showTagline && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 1.6, // más lenta
                    ease: "easeOut",
                  }}
                  className="text-2xl md:text-3xl text-sky-400 tracking-wider"
                >
                  Pasión, movimiento y comunidad
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* SCROLL */}
      <section className="relative flex flex-col items-center justify-center h-[15vh] bg-gradient-to-b from-[#0F1317] to-[#334353]">
        <p className="text-xl font-light text-gray-200 mb-2">
          Explorá nuestra web
        </p>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="cursor-pointer"
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
        >
          <ChevronDownIcon className="w-10 h-10 text-gray-900" />
        </motion.div>
      </section>
    </main>
  );
}

export default Hero;
