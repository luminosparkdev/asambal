import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

function QuienesSomos() {
  return (
    <div className="relative min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover bg-center text-gray-200">

      {/* overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 max-w-6xl px-6 py-16 mx-auto space-y-16">

        {/* HERO */}
        <motion.section initial="hidden" animate="visible" variants={fadeUp}>
          <h1 className="text-4xl font-bold text-white">
            Quiénes <span className="text-yellow-500">Somos</span>
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-3xl">
            La Asociación Amigos del Balonmano del Noroeste de la Provincia de Buenos Aires
            (ASAMBAL) es una organización dedicada a impulsar el desarrollo del handball
            en el interior bonaerense, promoviendo la competencia, la formación y el crecimiento del deporte.
          </p>
        </motion.section>

        {/* HISTORIA */}
        <motion.section variants={fadeUp}>
          <h2 className="mb-4 text-2xl font-semibold text-blue-400">Nuestra Historia</h2>
          <p className="text-gray-300 leading-relaxed">
            ASAMBAL fue creada el 11 de noviembre de 2011 por iniciativa de dirigentes,
            entrenadores y referentes del handball regional con el objetivo de organizar,
            desarrollar y fortalecer la práctica del balonmano en la región.
          </p>

          <p className="mt-4 text-gray-300 leading-relaxed">
            Desde sus inicios, trabajó en la consolidación de un espacio común para las instituciones,
            estableciendo bases organizativas, reglamentarias y deportivas que permitieron garantizar
            la continuidad y crecimiento del deporte.
          </p>
        </motion.section>

        {/* HITO */}
        <motion.section variants={fadeUp}>
          <div className="p-6 border-l-4 border-yellow-500 bg-gray-900/60 rounded-xl">
            <h3 className="text-xl font-semibold text-yellow-400">Hito clave</h3>
            <p className="mt-2 text-gray-300">
              En 2012, ASAMBAL se incorporó oficialmente a la Confederación Argentina de Handball,
              integrándose al sistema federativo nacional y accediendo a competencias oficiales.
            </p>
          </div>
        </motion.section>

        {/* COMPETENCIA */}
        <motion.section variants={fadeUp}>
          <h2 className="mb-4 text-2xl font-semibold text-green-400">
            Competencia y Desarrollo
          </h2>

          <p className="text-gray-300 leading-relaxed">
            La asociación organiza torneos oficiales como el Apertura, Clausura y el Súper 4,
            instancia que define a los mejores equipos del año.
          </p>

          <p className="mt-4 text-gray-300 leading-relaxed">
            Abarca categorías desde Minis hasta Primera División, en ambas ramas,
            promoviendo el desarrollo integral de jugadores, entrenadores y árbitros.
          </p>
        </motion.section>

        {/* CLUBES FUNDADORES */}
        <motion.section variants={fadeUp}>
          <h2 className="mb-4 text-2xl font-semibold text-purple-400">
            Clubes Fundadores
          </h2>

          <ul className="grid gap-3 md:grid-cols-2">
            {[
              "Defensores de Plaza Italia (25 de Mayo)",
              "CEF N°5 (Bolívar)",
              "Bragado Club",
              "Cañuelas FC",
              "Handball Chacabuco",
              "Independiente (Chivilcoy)",
              "Deportivo Alvear",
              "Escuela Bonifacia",
              "Escuela Municipal Riestra",
              "Atlético Tapalqué"
            ].map((club) => (
              <li key={club} className="px-4 py-2 bg-gray-800/60 rounded-lg">
                {club}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* ACTUALES */}
        <motion.section variants={fadeUp}>
          <h2 className="mb-4 text-2xl font-semibold text-yellow-400">
            Instituciones actuales (2026)
          </h2>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Riestra",
              "Estudiantes de Olavarría",
              "Mariano Moreno",
              "Roque Pérez",
              "9 de Julio (Chacabuco)",
              "Handball Chacabuco",
              "Club Alsina",
              "Handball Monte",
              "Handball 25 de Mayo",
              "Handball Mercedes",
              "Independiente (Chivilcoy)",
              "Tapalqué",
              "Azul Handball",
              "Escuela Bonifacia"
            ].map((club) => (
              <div
                key={club}
                className="p-3 text-center bg-gray-800/50 rounded-lg hover:bg-gray-700/60 transition"
              >
                {club}
              </div>
            ))}
          </div>
        </motion.section>

        {/* MISION VISION */}
        <motion.section variants={fadeUp} className="grid gap-6 md:grid-cols-2">
          <div className="p-6 bg-gray-900/60 rounded-xl border border-blue-500/30">
            <h3 className="text-xl font-semibold text-blue-400">Misión</h3>
            <p className="mt-3 text-gray-300">
              Organizar, promover y desarrollar el balonmano en la región,
              fortaleciendo instituciones y formando jugadores, entrenadores y árbitros.
            </p>
          </div>

          <div className="p-6 bg-gray-900/60 rounded-xl border border-yellow-500/30">
            <h3 className="text-xl font-semibold text-yellow-400">Visión</h3>
            <p className="mt-3 text-gray-300">
              Ser una asociación referente del handball argentino,
              reconocida por su organización, competitividad y desarrollo formativo.
            </p>
          </div>
        </motion.section>

      </div>
    </div>
  );
}

export default QuienesSomos;