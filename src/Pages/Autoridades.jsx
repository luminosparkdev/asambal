import { useRef, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";

/* ================= NODO ================= */
const Node = ({ title, name, color }) => (
  <div className={`px-5 py-3 text-center rounded-xl bg-gray-900/70 border ${color} shadow-lg backdrop-blur-sm`}>
    <p className="text-xs tracking-wide text-gray-400 uppercase">{title}</p>
    <p className="mt-1 font-semibold text-white">{name}</p>
  </div>
);

/* ================= HOOK LINEAS ================= */
function useOrgLines(refs, containerRef) {
  const [lines, setLines] = useState([]);

  useLayoutEffect(() => {
    const calc = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLines = [];

      const rect = (el) => el.getBoundingClientRect();

      const bottom = (el) => {
        const r = rect(el);
        return {
          x: r.left + r.width / 2 - containerRect.left,
          y: r.bottom - containerRect.top
        };
      };

      const top = (el) => {
        const r = rect(el);
        return {
          x: r.left + r.width / 2 - containerRect.left,
          y: r.top - containerRect.top
        };
      };

      const connectTree = (parentRef, childrenRefs) => {
        if (!parentRef.current) return;

        const p = bottom(parentRef.current);

        const children = childrenRefs
          .map(r => r.current)
          .filter(Boolean)
          .map(el => top(el));

        if (!children.length) return;

        const midY = p.y + 40;

        // línea vertical desde padre
        newLines.push({ x1: p.x, y1: p.y, x2: p.x, y2: midY });

        // línea horizontal
        const minX = Math.min(...children.map(c => c.x));
        const maxX = Math.max(...children.map(c => c.x));

        newLines.push({ x1: minX, y1: midY, x2: maxX, y2: midY });

        // líneas verticales a hijos
        children.forEach(c => {
          newLines.push({ x1: c.x, y1: midY, x2: c.x, y2: c.y });
        });
      };

      // conexiones
      connectTree(refs.presidente, [refs.vice]);
      connectTree(refs.vice, [refs.secretario, refs.tesorero]);
      connectTree(refs.secretario, refs.vocales);
      connectTree(refs.secretario, refs.revisores);

      // evitar renders innecesarios
      setLines(prev => {
        if (JSON.stringify(prev) === JSON.stringify(newLines)) return prev;
        return newLines;
      });
    };

    calc();

    const observer = new ResizeObserver(calc);

    Object.values(refs).forEach(r => {
      if (Array.isArray(r)) {
        r.forEach(ref => ref.current && observer.observe(ref.current));
      } else {
        r.current && observer.observe(r.current);
      }
    });

    window.addEventListener("resize", calc);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", calc);
    };
  }, []);

  return lines;
}

/* ================= COMPONENTE ================= */
function Autoridades() {
  const containerRef = useRef(null);

  const refs = {
    presidente: useRef(null),
    vice: useRef(null),
    secretario: useRef(null),
    tesorero: useRef(null),
    vocales: [useRef(null), useRef(null), useRef(null), useRef(null)],
    revisores: [useRef(null), useRef(null), useRef(null), useRef(null)],
  };

  const lines = useOrgLines(refs, containerRef);

  return (
    <div className="relative min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover bg-center text-gray-200">

      {/* overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* CONTENEDOR PRINCIPAL */}
      <div
        ref={containerRef}
        className="relative z-10 max-w-6xl px-4 py-16 mx-auto space-y-20"
      >

        {/* SVG sincronizado */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {lines.map((l, i) => (
            <motion.line
              key={i}
              {...l}
              stroke="#6b7280"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
            />
          ))}
        </svg>

        <h1 className="text-4xl font-bold text-center text-white">
          Autoridades <span className="text-yellow-500">ASAMBAL</span>
        </h1>

        <div className="flex flex-col items-center gap-20">

          {/* PRESIDENTE */}
          <div ref={refs.presidente}>
            <Node title="Presidente" name="Adrián Mansilla" color="border-yellow-500" />
          </div>

          {/* VICE */}
          <div ref={refs.vice}>
            <Node title="Vicepresidente" name="Mercedes Alvarez" color="border-blue-500" />
          </div>

          {/* SECRETARIO + TESORERO */}
          <div className="flex flex-col items-center gap-10 md:flex-row md:gap-32">
            <div ref={refs.secretario}>
              <Node title="Secretario" name="Rodrigo Román Martínez" color="border-green-500" />
            </div>

            <div ref={refs.tesorero}>
              <Node title="Tesorero" name="Gastón Chiramberro" color="border-purple-500" />
            </div>
          </div>

          {/* VOCALES */}
          <div className="w-full">
            <h2 className="mb-6 text-xl font-semibold text-center text-blue-400">
              Vocales
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                "Adriana Ilari",
                "Leonardo González",
                "Juan Gottschalk",
                "Daniela López"
              ].map((n, i) => (
                <div ref={refs.vocales[i]} key={i}>
                  <Node title="Vocal" name={n} color="border-gray-500" />
                </div>
              ))}
            </div>
          </div>

          {/* REVISORES */}
          <div className="w-full">
            <h2 className="mb-6 text-xl font-semibold text-center text-green-400">
              Revisores de Cuentas
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                "Miguel Rodríguez",
                "Mariano Risso",
                "Alejandra Latorre",
                "Luana Blanco Perdomo"
              ].map((n, i) => (
                <div ref={refs.revisores[i]} key={i}>
                  <Node title="Revisor" name={n} color="border-green-500" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Autoridades;