import { useNavigate } from "react-router-dom";

function AdminClubDashboard() {
    const navigate = useNavigate();
    return (
        <>
            <h1>Admin Club Dashboard</h1>
            <ul>
                <button onClick={() => navigate("/coaches")}>
                    Gestión de profesores
                </button>
                <li>
                    <button onClick={() => navigate("/players")}>
                        Gestión de jugadores
                    </button>
                </li>
                <button onClick={() => navigate("/coaches/pending-coaches")}>
                    Solicitudes pendientes
                </button>   
                <li>Gestion de categorias</li>
                <li>Gestion de pagos y cuotas</li>
                <li>Gestion de lesiones</li>
                <li>Gestion de membresias</li>
            </ul>
        </>
    );
}

export default AdminClubDashboard;