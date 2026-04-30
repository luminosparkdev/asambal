import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import ProtectedRoute from "../Auth/ProtectedRoute";
import { ROLES } from "../Utils/roles";;
//AGREGAR DASHBOARDS DE PERFILES CUANDO EXISTAN



import Home from "../Pages/Home";
import Login from "../Pages/Login";
import ActivateAccount from "../Pages/ActivateAccount";
import ProfileRouter from "../Pages/ProfileRouter";
import NotFound from "../Pages/NotFound";
import AdminAsambalDashboard from "../Pages/Asambal/AdminAsambalDashboard";
import ClubList from "../Pages/Asambal/ClubList";
import ClubDetails from "../Views/Asambal/ClubDetails";
import AdminClubDashboard from "../Pages/Clubes/AdminClubDashboard";
import ProfesorDashboard from "../Pages/Profesores/ProfesorDashboard";
import CreatePlayer from "../Pages/Profesores/CreatePlayer";
import PlayersList from "../Pages/Profesores/PlayerList";
import PlayerDetail from "../Pages/Profesores/PlayerDetail";
import EditPlayer from "../Pages/Profesores/EditPlayer";
import CoachesList from "../Pages/Clubes/CoachesList";
import CoachesCreate from "../Pages/Clubes/CoachesCreate";
import CoachesDetail from "../Views/Club/CoachDetail";
import PendingUsers from "../Views/Asambal/PendingUsers";
import PendingCoaches from "../Views/Club/PendingCoaches";
import PendingPlayersClub from "../Views/Club/PendingPlayersClub"
import CreateClub from "../Pages/Asambal/CreateClub";
import RecuperarClave from "../Pages/HomeComponents/RecuperarClave";
import DashboardRouter from "../Pages/DashboardRouter";
import PendingPlayers from "../Views/Profesores/PendingPlayers";
import PlayerDashboard from "../Pages/Jugadores/PlayerDashboard";
import PlayerProfile from "../Pages/Profiles/PlayerProfile";
import PlayerListAsambal from "../Pages/Asambal/PlayerListAsamabal";
import PendingClubRequests from "../Views/Profesores/PendingClubRequests";
import PlayerDetailAsambal from "../Pages/Asambal/PlayerDetailAsambal";
import Becados from "../Pages/Asambal/Becados";
import PlayerScholarshipHistory from "../Pages/Asambal/PlayerScholarshipHistory";
import CoachList from "../Pages/Asambal/CoachList";
import CoachDetail from "../Pages/Asambal/CoachDetail";
import PlayersListClub from "../Pages/Clubes/PlayersListClub";
import PendingTransfer from "../Views/Asambal/PendingTransfer";
import CreatePlayerClub from "../Pages/Clubes/CreatePlayerClub";
import PendingTransferRequest from "../Views/Jugadores/PendingTransferRequest";
import EmpadronamientoJugadoresList from "../Pages/Asambal/EmpadronamientoJugadoresList";
import EmpadronamientoJugadores from "../Pages/Asambal/EmpadronamientoJugadores";
import EmpadronamientoJugador from "../Views/Jugadores/EmpadronamientoJugador";
import ClubSettings from "../Pages/Clubes/ClubSettings";
import ClubHeroSettings from "../Pages/Clubes/ClubHeroSettings";
import Membresias from "../Pages/Asambal/Membresias";
import MembresiasList from "../Pages/Asambal/MembresiasList";
import AdministrarMembresia from "../Pages/Asambal/AdministrarMembresia"
import MembresiaClub from "../Views/Club/MembresiaClub";
import Seguros from "../Pages/Asambal/Seguros";
import ProfeSeguros from "../Pages/Profesores/ProfeSeguros";
import UnderConstruction from "../Pages/UnderContruction";
import Certificado from "../Pages/Jugadores/Certificado";
import PendingCertificados from "../Views/Profesores/PendingCertificados";
import PlayerDetailClub from "../Pages/Clubes/PlayerDetailsClub";
import QuienesSomos from "../Pages/QuienesSomos";
import Autoridades from "../Pages/Autoridades";
import SelectRole from "../Pages/SelectRole";
import { PagoExitoso } from "../Pages/PagoResultado";
import { PagoPendiente } from "../Pages/PagoResultado";
import { PagoFallido } from "../Pages/PagoResultado";
import CreateCuota from "../Pages/Clubes/CreateCuota";
import CuotasList from "../Pages/Clubes/CuotasList";
import CuotasDetail from "../Pages/Clubes/CuotasDetail";
import PlayerCuotasView from "../Pages/Jugadores/PlayerCuotasView"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            //RUTAS PÚBLICAS
            { index: true, element: <Home />, },
            { path: "login", element: <Login />, },
            { path: "activar-cuenta", element: <ActivateAccount /> },
            { path: "recuperar-clave", element: <RecuperarClave /> },
            { path: "quienes-somos", element: <QuienesSomos />},
            { path: "autoridades", element: <Autoridades />},
            { path: "select-role", element: <SelectRole />},
            { path: "pago-exitoso", element: <PagoExitoso />},
            { path: "pago-pendiente", element: <PagoPendiente/>},
            { path: "pago-fallido", element: <PagoFallido />},

            //EN CONTRUCCIÓN ASAMBAL
            { path: "asambal/cashflow", element: <UnderConstruction/> },
            { path: "asambal/reportes", element: <UnderConstruction/> },
            { path: "asambal/ingresos", element: <UnderConstruction/> },
            { path: "asambal/gastos", element: <UnderConstruction/> },
            { path: "asambal/novedades", element: <UnderConstruction/> },
            { path: "asambal/sponsors", element: <UnderConstruction/> },
            { path: "asambal/auditoria", element: <UnderConstruction/> },
            { path: "asambal/configuracion", element: <UnderConstruction/> },

            //EN CONTRUCCIÓN CLUBES
            { path: "/categories", element: <UnderConstruction/> },
            { path: "/injuries", element: <UnderConstruction/> },
            { path: "/clubs/fees/create", element: <CreateCuota/>},
            { path: "/balance", element: <UnderConstruction/> },
            { path: "asambal/sponsors", element: <UnderConstruction/> },
            { path: "/club/profile", element: <UnderConstruction/> },
            { path: "/club/contact", element: <UnderConstruction/> },

            //EN CONTRUCCIÓN PROFESORES
            { path: "admin/liberados", element: <UnderConstruction/> },
            { path: "admin/categorias", element: <UnderConstruction/> },
            { path: "admin/lesiones", element: <UnderConstruction/> },
            { path: "admin/pagos", element: <UnderConstruction/> },
            { path: "admin/inscripciones", element: <UnderConstruction/> },
            { path: "admin/viajes", element: <UnderConstruction/> },
            { path: "admin/arbitrajes", element: <UnderConstruction/> },

            //EN CONTRUCCIÓN JUGADORES
            { path: "players/me/inscripciones", element: <UnderConstruction/> },
            { path: "players/fees", element: <PlayersCuotasView/> },
            { path: "players/me/viajes", element: <UnderConstruction/> },
            { path: "players/me/lesiones", element: <UnderConstruction/> },
            { path: "players/me/tutor", element: <UnderConstruction/> },
            { path: "players/me/configuracion", element: <UnderConstruction/> },

            { path: "*", element: <NotFound /> },

            //RUTAS PROTEGIDAS SIN ROL ESPECÍFICO
            {
                path: "perfil",
                element: (
                    <ProtectedRoute>
                        <ProfileRouter />
                    </ProtectedRoute>
                ),
            },
            {
                path: "dashboard",
                element: (
                    <ProtectedRoute>
                        <DashboardRouter />
                    </ProtectedRoute>
                ),
            },

            //RUTAS PROTEGIDAS CON ROL ESPECÍFICO

            //ADMIN ASAMBAL
            {
                path: "admin",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_ASAMBAL]}>
                        <AdminAsambalDashboard />
                    </ProtectedRoute>
                ),
            },

            {
                path: "/asambal/pendientes",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_ASAMBAL]}>
                        <PendingUsers />
                    </ProtectedRoute>
                ),
            },

            {
                path: "asambal/jugadores",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_ASAMBAL]}>
                        <PlayerListAsambal />
                    </ProtectedRoute>
                ),
            },
            {
                path: "asambal/jugadores/:id",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_ASAMBAL]}>
                        <PlayerDetailAsambal />
                    </ProtectedRoute>
                ),
            },

            {
                path: "clubs",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_ASAMBAL, ROLES.ADMIN_CLUB]}>
                        <ClubList />
                    </ProtectedRoute>
                ),
            },

            {
                path: "clubs/:id",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_ASAMBAL, ROLES.ADMIN_CLUB]}>
                        <ClubDetails />
                    </ProtectedRoute>
                ),
            },
            {
                path: "clubs/create",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_ASAMBAL, ROLES.ADMIN_CLUB]}>
                        <CreateClub />
                    </ProtectedRoute>
                ),
            },
            {
                path: "asambal/profesores",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_ASAMBAL]}>
                        <CoachList />
                    </ProtectedRoute>
                ),
            },

            {
                path: "asambal/profesores/:id",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_ASAMBAL]}>
                        <CoachDetail />
                    </ProtectedRoute>
                ),
            },
            {
                path: "asambal/transferencias",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_ASAMBAL]}>
                        <PendingTransfer />
                    </ProtectedRoute>
                ),
            },
            {
                path: "asambal/becados",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_ASAMBAL]}>
                        <Becados />
                    </ProtectedRoute>
                ),
            },
            {
                path: "asambal/jugadores/:id/becas",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_ASAMBAL]}>
                        <PlayerScholarshipHistory />
                    </ProtectedRoute>
                ),
            },
            {
                path: "asambal/empadronamiento-jugadores/resumen",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_ASAMBAL]}>
                        <EmpadronamientoJugadoresList />
                    </ProtectedRoute>
                ),
            },
            {
                path: "asambal/empadronamiento-jugadores/crear",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_ASAMBAL]}>
                        <EmpadronamientoJugadores />
                    </ProtectedRoute>
                ),
            },
            {
                path: "asambal/membresias/crear",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_ASAMBAL]}>
                        <Membresias />
                    </ProtectedRoute>
                ),
            },
            {
                path: "asambal/membresias/resumen",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_ASAMBAL]}>
                        <MembresiasList />
                    </ProtectedRoute>
                )
            },
            {
                path: "asambal/membresias/:clubId/:year",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_ASAMBAL]}>
                        <AdministrarMembresia />
                    </ProtectedRoute>
                )
            },
            {
                path: "asambal/empadronamiento-profesores",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_ASAMBAL]}>
                        <Seguros />
                    </ProtectedRoute>
                ),
            },

            //ADMIN CLUB
            {
                path: "admin-club",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_CLUB]}>
                        <AdminClubDashboard />
                    </ProtectedRoute>
                ),
            },

            // RUTA PARA FORMULARIO DE CREACION DE JUGADOR DESDE ADMIN CLUB
            {
                path: "clubs/jugadores/create",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_CLUB]}>
                        <CreatePlayerClub />
                    </ProtectedRoute>
                ),
            },

            {
                path: "coaches/pending-coaches",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_CLUB]}>
                        <PendingCoaches />
                    </ProtectedRoute>
                ),
            },
            {
                path: "clubs/pending-players",
                element: (
                   <ProtectedRoute allowedRoles={[ROLES.ADMIN_CLUB]}>
                        <PendingPlayersClub />
                    </ProtectedRoute> 
                )
            },
            {
                path: "coaches",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_CLUB]}>
                        <CoachesList />
                    </ProtectedRoute>
                ),
            },
            {
                path: "coaches/nuevo",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_CLUB]}>
                        <CoachesCreate />
                    </ProtectedRoute>
                ),
            },
            {
                path: "coaches/:id",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_CLUB]}>
                        <CoachesDetail />
                    </ProtectedRoute>
                ),
            },
            {
                path: "clubs/players",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_CLUB]}>
                        <PlayersListClub />
                    </ProtectedRoute>
                ),
            },
            {
                path: "clubs/players/:id",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_CLUB]}>
                        <PlayerDetailClub />
                    </ProtectedRoute>
                )
            },
            {
                path: "club/settings",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_CLUB]}>
                        <ClubSettings />
                    </ProtectedRoute>
                ),
            },
            {
                path: "club/settings/hero",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_CLUB]}>
                        <ClubHeroSettings />
                    </ProtectedRoute>
                ),
            },
            {
                path: "club/membresia",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_CLUB]}>
                        <MembresiaClub />
                    </ProtectedRoute>
                ),
            },
            
            { path: "/clubs/fees", element: <CuotasList/> },
            { path: "clubs/fees/:id", element: <CuotasDetail/>},
            //PROFESOR
            {
                path: "profesor",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.PROFESOR]}>
                        <ProfesorDashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: "pending-players",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.PROFESOR]}>
                        <PendingPlayers />
                    </ProtectedRoute>
                ),
            },
            {
                path: "pending-club-requests",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.PROFESOR]}>
                        <PendingClubRequests />
                    </ProtectedRoute>
                ),
            },
            {
                path: "players",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.PROFESOR]}>
                        <PlayersList />
                    </ProtectedRoute>
                ),
            },
            {
                path: "profesor/jugadores/crear",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.PROFESOR]}>
                        <CreatePlayer />
                    </ProtectedRoute>
                ),
            },
            {
                path: "profesor/jugadores/:id",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.PROFESOR]}>
                        <PlayerDetail />
                    </ProtectedRoute>
                ),
            },
            {
                path: "profesor/jugadores/:id/editar",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.PROFESOR]}>
                        <EditPlayer />
                    </ProtectedRoute>
                ),
            },
            {
                path: "profesor/empadronamientos",
                element: (
                <ProtectedRoute allowedRoles={[ROLES.PROFESOR]}>
                    <ProfeSeguros />
                </ProtectedRoute>
                ),
            },
                        {
                path: "/profesor/alta-medica",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.PROFESOR]}>
                        <PendingCertificados />
                    </ProtectedRoute>
                ),
            },
            // JUGADOR
            {
                path: "jugador",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.JUGADOR]}>
                        <PlayerDashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/players/alta-medica",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.JUGADOR]}>
                        <Certificado />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/players/transfers",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.JUGADOR]}>
                        <PendingTransferRequest />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/players/empadronamientos",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.JUGADOR]}>
                        <EmpadronamientoJugador />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);
