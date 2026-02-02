import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import ProtectedRoute from "../Auth/ProtectedRoute";
import { ROLES } from "../Utils/roles";;
//AGREGAR DASHBOARDS DE PERFILES CUANDO EXISTAN



import Home from "../Pages/Home";
import Login from "../Pages/Login";
import ActivateAccount from "../Pages/ActivateAccount";
import ProfileRouter from "../Pages/ProfileRouter";
import Unauthorized from "../Pages/Unauthorized";
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

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            //RUTAS PÚBLICAS
            { index: true, element: <Home />, },
            { path: "login", element: <Login />, },
            { path: "activar-cuenta", element: <ActivateAccount /> },
            { path: "unauthorized", element: <Unauthorized /> },
            { path: "recuperar-clave", element: <RecuperarClave /> },

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
                path: "/players/transfers",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.JUGADOR]}>
                        <PendingTransferRequest />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);
