import { useNavigate } from "react-router-dom";

const sections = [
  {
    title: "Gestión Institucional",
    color: "border-blue-500",
    links: [
      { name: "Clubes", path: "/clubs", icon: "🏢" },
      { name: "Jugadores", path: "/players", icon: "🏃" },
      { name: "Profesores", path: "/coaches", icon: "👨‍🏫" },
      { name: "Administradores", path: "/admins", icon: "👨‍💻" },
    ]
  },
  {
    title: "Operaciones y Validaciones",
    color: "border-orange-400",
    links: [
      { name: "Solicitudes pendientes", path: "/asambal/pendientes", icon: "⏳" },
      { name: "Habilitaciones", path: "/asambal/habilitaciones", icon: "✅" },
    ]
  },
  {
    title: "Afiliaciones",
    color: "border-green-500",
    links: [
      { name: "Membresías", path: "/asambal/membresias", icon: "🥇" },
      { name: "Empadronamientos", path: "/asambal/empadronamientos", icon: "📋" },
      { name: "Becados", path: "/asambal/becados", icon: "🎓" },
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
      { name: "Balance", path: "/balance", icon: "💰" },
      { name: "Configuración", path: "/configuracion", icon: "⚙️" },
    ]
  }
];

function AdminAsambalDashboard() {
  const navigate = useNavigate();

  return (

    <div className="relative min-h-screen p-8 bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover bg-center">

      <div className="absolute inset-0 bg-black/10" />
      <div className="relative z-10 p-8">
        <h2 className="mb-2 text-3xl font-bold text-gray-100">Panel de <span className="text-yellow-600">Control</span></h2>
        <p className="mb-10 text-blue-500 font-bold text-2xl">ASAMBAL</p>
      
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
            <div 
              key={section.title} 
              className={`bg-transparent p-6 rounded-2xl shadow-xl border-l-4 ${section.color}`}>
                <h3 className="mb-4 pl-2 text-lg font-semibold rounded-sm uppercase tracking-wider text-gray-800 bg-gradient-to-r from-gray-200/80 to-transparent">
                  {section.title}
                </h3>
                <div className="flex flex-col gap-3">
                  {section.links.map(link => (
                  <button
                    key={link.name}
                    onClick={() => navigate(link.path)}
                    className="group flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800/80 to-transparent hover:from-gray-700/90 text-gray-200 transition-all"
                    >
                    <span className="text-lg group-hover:scale-110 transition-transform">{link.icon}</span>
                    <span className="text-sm font-medium">{link.name}</span>
                  </button>
                  ))}
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default AdminAsambalDashboard;