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

const sections = [
  {
    title: "Gestión Deportiva",
    color: "border-blue-500",
    links: [
      { name: "Categorías", path: "/categories", icon: "🏷️" },
      { name: "Profesores", path: "/coaches", icon: "👨‍🏫" },
      { name: "Jugadores", path: "/players", icon: "🏃" },
      { name: "Lesiones", path: "/injuries", icon: "🤕" },
    ],
  },
  {
    title: "Administración y Finanzas",
    color: "border-green-500",
    links: [
      { name: "Cuotas y pagos", path: "/fees", icon: "💳" },
      { name: "Balance", path: "/balance", icon: "📊" },
      { name: "Membresía ASAMBAL", path: "/membership", icon: "🥇" },
    ],
  },
  {
    title: "Comunicación e Imagen",
    color: "border-yellow-400",
    links: [
      { name: "Noticias del club", path: "/club/news", icon: "📰" },
      { name: "Perfil del club", path: "/club/profile", icon: "🏟️" },
      { name: "Datos de contacto", path: "/club/contact", icon: "📞" },
    ],
  },
  {
    title: "Sistema",
    color: "border-red-500",
    links: [
      { name: "Solicitudes pendientes", path: "/coaches/pending-coaches", icon: "⏳" },
      { name: "Configuración", path: "/club/settings", icon: "⚙️" },
    ],
  },
];


function AdminClubDashboard() {
    const navigate = useNavigate();
    return (
        <div className="relative min-h-screen p-8 bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <h2 className="mb-2 text-3xl font-bold text-gray-100">
          Panel de <span className="text-blue-500">Gestión</span>
        </h2>
        <p className="mb-10 text-gray-300 text-lg">
          Administración del club
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {sections.map((section) => (
            <motion.div
              key={section.title}
              variants={cardVariants}
              className={`bg-transparent p-6 rounded-2xl shadow-xl border-l-4 ${section.color} transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl`}
            >
              <h3 className="mb-4 pl-2 text-lg font-semibold uppercase tracking-wider text-gray-800 bg-gradient-to-r from-gray-200/80 to-transparent">
                {section.title}
              </h3>

              <div className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => navigate(link.path)}
                    className="group flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800/80 to-transparent hover:from-gray-700/90 text-gray-200 transition-all"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">
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

export default AdminClubDashboard;