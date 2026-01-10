import { useNavigate } from "react-router-dom";
import AltaClub from "./CreateClub";

function AdminAsambalDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-300">
      {/* Título principal (h1 no se usa) */}
      <h2 className="mb-8 text-3xl font-light text-center text-gray-800">
        Dashboard Administrativo
      </h2>

      {/* Checklist de desarrollo comentado */}
      {/*
        <li>Gestión de clubes, inscripciones de clubes y membresías</li>
        <li>Gestión de usuarios</li>
        <li>Gestión de roles</li>
        <li>Gestión de pagos</li>
        <li>Gestión de empadronamientos y liberados</li>
        <li>Gestión de administradores</li>
        <li>Gestión de datos</li>
      */}

      {/* Grid de secciones */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gestión Institucional */}
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="mb-4 text-xl font-semibold">Gestión Institucional</h3>
          <ul className="space-y-3">
            <li>
              <button
                onClick={() => navigate("/asambal/pendientes")}
                className="w-full px-4 py-2 text-left text-white transition-colors bg-blue-700 rounded-lg hover:bg-blue-800"
              >
                Solicitudes de aprobación
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/clubs")}
                className="w-full px-4 py-2 text-left text-white transition-colors bg-blue-700 rounded-lg hover:bg-blue-800"
              >
                Gestión de clubes
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/coaches")}
                className="w-full px-4 py-2 text-left text-white transition-colors bg-blue-700 rounded-lg hover:bg-blue-800"
              >
                Gestión de profesores
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/players")}
                className="w-full px-4 py-2 text-left text-white transition-colors bg-blue-700 rounded-lg hover:bg-blue-800"
              >
                Gestión de jugadores
              </button>
            </li>
            <li>
              <div className="mt-2">
                <AltaClub />
              </div>
            </li>
            <li className="text-gray-700">Alta de administradores de club</li>
            <li className="text-gray-700">Supervisión de profesores</li>
          </ul>
        </div>

        {/* Usuarios */}
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="mb-4 text-xl font-semibold">Usuarios</h3>
          <ul className="space-y-3 text-gray-700">
            <li>Crear usuarios (club / profesor / jugador)</li>
            <li>Ver usuarios por rol</li>
            <li>Bloquear / reactivar usuarios</li>
          </ul>
        </div>

        {/* Jugadores */}
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="mb-4 text-xl font-semibold">Jugadores</h3>
          <ul className="space-y-3 text-gray-700">
            <li>Buscar jugadores globalmente</li>
            <li>Ver empadronamientos</li>
            <li>Acciones excepcionales (override)</li>
          </ul>
        </div>

        {/* Viajes y Competencias */}
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="mb-4 text-xl font-semibold">Viajes y Competencias</h3>
          <ul className="space-y-3 text-gray-700">
            <li>Supervisión de viajes</li>
            <li>Estado de inscripciones</li>
            <li>Pagos globales</li>
          </ul>
        </div>

        {/* Auditoría */}
        <div className="p-6 bg-white shadow rounded-xl md:col-span-2">
          <h3 className="mb-4 text-xl font-semibold">Auditoría</h3>
          <ul className="space-y-3 text-gray-700">
            <li>Historial de acciones</li>
            <li>Logs críticos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminAsambalDashboard;