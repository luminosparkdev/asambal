import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import ProtectedRoute from "../Auth/ProtectedRoute";

import Home from "../Pages/Home";
import Login from "../Pages/Login";
import ActivateAccount from "../Pages/ActivateAccount";
import Profile from "../Pages/Profile";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <Home />, },
            { path: "login", element: <Login />, },
            { path: "activar-cuenta", element: <ActivateAccount />, },
            { path: "perfil", 
              element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);
