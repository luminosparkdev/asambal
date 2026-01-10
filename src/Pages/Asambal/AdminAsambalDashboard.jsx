import { useNavigate } from "react-router-dom";
import AltaClub from "./CreateClub";

function AdminAsambalDashboard() {
  const navigate = useNavigate();
  return (
    <>
      <h1>Admin Asambal Dashboard</h1>

      <ul>
        <li>Gestion de clubes, inscripciones de clubes y membresias</li>
        <li>Gestion de usuarios</li>
        <li>Gestion de roles</li>
        <li>Gestion de pagos</li>
        <li>Gestion de empadronamientos y liberados</li>
        <li>Gestion de administradores</li>
        <li>Gestion de datos</li>
      </ul>

      <section>
        <h2>Gestión institucional</h2>
        <ul>
          <li>
          <button onClick={() => navigate("/asambal/pendientes")}>
            Solicitudes de aprobación
          </button>
          </li>
          <li>
          <button onClick={() => navigate("/clubs")}>
            Gestión de clubes
          </button>
          </li>
          <li>
            <button onClick={() => navigate("/coaches")}>
              Gestión de profesores
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/players")}>
              Gestión de jugadores
            </button>
          </li>

          <li>Alta y gestión de clubes</li>
          <AltaClub />
          <li>Alta de administradores de club</li>
          <li>Supervisión de profesores</li>
        </ul>
      </section>

      <section>
        <h2>Usuarios</h2>
        <ul>
          <li>Crear usuarios (club / profesor / jugador)</li>

          <li>Ver usuarios por rol</li>
          <li>Bloquear / reactivar usuarios</li>
        </ul>
      </section>

      <section>
        <h2>Jugadores</h2>
        <ul>
          <li>Buscar jugadores globalmente</li>
          <li>Ver empadronamientos</li>
          <li>Acciones excepcionales (override)</li>
        </ul>
      </section>

      <section>
        <h2>Viajes y competencias</h2>
        <ul>
          <li>Supervisión de viajes</li>
          <li>Estado de inscripciones</li>
          <li>Pagos globales</li>
        </ul>
      </section>

      <section>
        <h2>Auditoría</h2>
        <ul>
          <li>Historial de acciones</li>
          <li>Logs críticos</li>
        </ul>
      </section>
    </>
  );
}

export default AdminAsambalDashboard;
