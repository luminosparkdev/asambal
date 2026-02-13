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
    title: "Gestión Institucional",
    color: "border-blue-500",
    links: [
      { name: "Clubes", path: "/clubs", icon: "🏢" },
      { name: "Jugadores", path: "/asambal/jugadores", icon: "🏃" },
      { name: "Profesores", path: "/asambal/profesores", icon: "👨‍🏫" },
      { name: "Transferencias de jugadores", path: "/asambal/transferencias", icon: "⚽" },
      { name: "Solicitudes pendientes", path: "/asambal/pendientes", icon: "⏳" },
    ]
  },
  {
    title: "Afiliaciones",
    color: "border-green-500",
    links: [
      { name: "Membresías", path: "/asambal/membresias", icon: "🥇" },
      { name: "Empadronamientos", path: "/asambal/empadronamientos", icon: "📋" },
      { name: "Becados", path: "/asambal/becados", icon: "🎓" },
      { name: "Seguros de profesores", path: "/asambal/seguros", icon: "📄" },
    ]
  },
  {
    title: "Gestión financiera",
    color: "border-gray-200",
    links: [
      { name: "Cashflow", path: "asambal/cashflow", icon: "📊" },
      { name: "Reportes", path: "/balance", icon: "📈" },
      { name: "Ingresos", path: "/balance", icon: "🏦" },
      { name: "Gastos", path: "/balance", icon: "💸" },
    ]
  },
  {
    title: "Contenido y Prensa",
    color: "border-yellow-400",
    links: [
      { name: "Novedades", path: "/asambal/novedades", icon: "🔔" },
      { name: "Sponsors", path: "/asambal/sponsors", icon: "💰" },
    ]
  },
  {
    title: "Sistema",
    color: "border-red-500",
    links: [
      { name: "Auditoría", path: "/asambal/auditoria", icon: "🔍" },
      { name: "Configuración", path: "/configuracion", icon: "⚙️" },
    ]
  },
];

function AdminAsambalDashboard() {
  const navigate = useNavigate();

  return (

    <div className="relative min-h-screen p-8 bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover bg-center">

      <div className="absolute inset-0 bg-black/10" />
      <div className="relative z-10 px-4 py-8 mx-auto max-w-7xl">
        <h2 className="mb-2 text-3xl font-bold text-gray-100">Panel de <span className="text-yellow-600">Control</span></h2>
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
              className={`bg-transparent p-6 rounded-2xl shadow-xl border-l-4 ${section.color} transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl`}>
                <h3 className="pl-2 mb-4 text-lg font-semibold tracking-wider text-gray-800 uppercase rounded-sm bg-gradient-to-r from-gray-200/80 to-transparent">
                  {section.title}
                </h3>
                <div className="flex flex-col gap-3">
                  {section.links.map(link => (
                  <button
                    key={link.name}
                    onClick={() => navigate(link.path)}
                    className="cursor-pointer flex items-center gap-3 px-4 py-2 text-gray-200 transition-all rounded-lg group bg-gradient-to-r from-gray-800/80 to-transparent hover:from-gray-700/90"
                    >
                    <span className="text-lg group-hover:scale-110 transition-transform whileTap={{ scale: 0.97 }}">{link.icon}</span>
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

export default AdminAsambalDashboard;