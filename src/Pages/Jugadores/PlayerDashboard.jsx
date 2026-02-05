import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Secciones del jugador
const sections = [
  {
    title: "Mi Club",
    color: "border-blue-500",
    links: [
      { name: "Alta médica", path: "/players/me/alta-medica", icon: "🏢" },
      { name: "Inscripciones", path: "/players/me/inscripciones", icon: "📝" },
      { name: "Cuotas", path: "/players/me/cuotas", icon: "💰" },
      { name: "Viajes", path: "/players/me/viajes", icon: "✈️" },
    ],
  },
  {
    title: "Asambal",
    color: "border-blue-500",
    links: [
      { name: "Empadronamientos", path: "/players/empadronamientos", icon: "💰" },
      { name: "Pases", path: "/players/transfers", icon: "🔁" },
      { name: "Lesiones", path: "/players/me/lesiones", icon: "🩹" },
    ],
  },
  {
    title: "Sistema",
    color: "border-blue-500",
    links: [
      { name: "Ver tutor", path: "/players/me/tutor", icon: "👨" },
      { name: "Configuración", path: "/players/me/configuracion", icon: "⚙️" },
    ],
  },
];

function PlayerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen p-8 bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover bg-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Contenido */}
      <div className="relative z-10 px-4 py-8 mx-auto max-w-7xl">
        <h2 className="mb-2 text-3xl font-bold text-gray-100">
          Panel de <span className="text-yellow-600">Jugador</span>
        </h2>
        <p className="mb-10 text-2xl font-bold text-blue-500">ASAMBAL</p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {sections.map((section) => (
            <motion.div
              variants={cardVariants}
              key={section.title}
              className={`bg-transparent p-6 rounded-2xl shadow-xl border-l-4 ${section.color} transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl backdrop-blur bg-black/30`}
            >
              <h3 className="pl-2 mb-4 text-lg font-semibold tracking-wider text-gray-800 uppercase rounded-sm bg-gradient-to-r from-gray-200/80 to-transparent">
                {section.title}
              </h3>
              <div className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => navigate(link.path)}
                    className="flex items-center gap-3 px-4 py-2 text-gray-200 transition-all rounded-lg group bg-gradient-to-r from-gray-800/80 to-transparent hover:from-gray-700/90"
                  >
                    <span className="text-lg transition-transform group-hover:scale-110">
                      {link.icon}
                    </span>
                    <span className="text-sm font-medium">{link.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default PlayerDashboard;
