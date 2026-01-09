import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import ProtectedRoute from "../Auth/ProtectedRoute";
import { ROLES } from "../Utils/roles";;
//AGREGAR DASHBOARDS DE PERFILES CUANDO EXISTAN



import Home from "../Pages/Home";
import Login from "../Pages/Login";
import ActivateAccount from "../Pages/ActivateAccount";
import Profile from "../Pages/Profile";
import Unauthorized from "../Pages/Unauthorized";
import AdminAsambalDashboard from "../Pages/Asambal/AdminAsambalDashboard";
import ClubList from "../Pages/Asambal/ClubList";
import ClubDetails from "../Views/Asambal/ClubDetails";
import AdminClubDashboard from "../Pages/Clubes/AdminClubDashboard";
import ProfesorDashboard from "../Pages/ProfesorDashboard";
import CoachesList from "../Pages/Clubes/CoachesList";
import CoachesCreate from "../Pages/Clubes/CoachesCreate";
import CoachesDetail from "../Pages/Clubes/CoachesDetail";

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

            //RUTAS PROTEGIDAS SIN ROL ESPECÍFICO
            {
                path: "perfil",
                element: (
                    <ProtectedRoute>
                        <Profile />
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

            //ADMIN CLUB
            {
                path: "admin-club",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN_CLUB]}>
                        <AdminClubDashboard />
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
            //PROFESOR
            {
                path: "profesor",
                element: (
                    <ProtectedRoute allowedRoles={[ROLES.PROFESOR]}>
                        <ProfesorDashboard />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);
