import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";


function ClubDetails() {
    const { id } = useParams();
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const navigate = useNavigate();

    const API_URL = "http://localhost:3000/api";

    useEffect(() => {
        axios.get(`${API_URL}/clubs/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        )
            .then(response => {
                setClub(response.data);
                setForm({
                    nombre: response.data.nombre,
                    ciudad: response.data.ciudad,
                    email: response.data.email,
                    telefono: response.data.telefono,
                    sede: response.data.sede,
                    responsable: response.data.responsable,
                });
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        if (!form.nombre?.trim()) return "El nombre es obligatorio";
        if (!form.ciudad?.trim()) return "La ciudad es obligatoria";
        if (!form.responsable?.trim()) return "El responsable es obligatorio";
        if (!form.sede?.trim()) return "La sede es obligatoria";
        if (!form.telefono?.trim()) return "El teléfono es obligatorio";
        if (!form.email?.trim()) return "El email es obligatorio";

        if (!/^[0-9+\-\s()]+$/.test(form.telefono)) {
            return "El teléfono tiene caracteres inválidos";
        }

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email)) {
            return "El email tiene caracteres inválidos";
        }

        return null;
    };

    const handleSave = async () => {
        const previousClub = club;

        //OPTIMISTIC UI
        setClub (prev => ({
            ...prev,
            ...form,
            updatedAt: new Date().toISOString(),
        }))

        try {
            const response = await axios.put(`${API_URL}/clubs/${id}`, form,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            Swal.fire({
                title: "Guardado",
                text: "Club actualizado correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
            });
            navigate("/clubs");
        } catch (error) {
            //ROLLBACK
            setClub(previousClub);
            Swal.fire({
                title: "Error",
                text: "No se pudo actualizar el club",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    };

    const handleToggle = async () => {
        const res = await axios.patch(
            `${API_URL}/clubs/${id}/toggle`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        setClub(prev => ({
            ...prev,
            isActive: res.data.isActive,
        }));
    };


    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!club) {
        return <div>Club no encontrado</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h2>{editing ? "Editar club" : club.nombre}</h2>

            {editing ?(
            <>
            <input name="nombre" value={form.nombre} type="text" onChange={handleChange} />
            <input name="ciudad" value={form.ciudad} type="text" onChange={handleChange} />
            <input name="email" value={form.email} type="text" onChange={handleChange} />
            <input name="responsable" value={form.responsable} type="text" onChange={handleChange} />
            <input name="telefono" value={form.telefono} type="text" onChange={handleChange} />
            <input name="sede" value={form.sede} type="text" onChange={handleChange} />
            <p>Fecha de creacion: {club.createdAt ? new Date(club.createdAt).toLocaleDateString() : "-"}</p>
            <p>Fecha de actualizacion: {club.updatedAt ? new Date(club.updatedAt).toLocaleDateString() : "-"}</p>
            <p>Estado: {club.isActive ? "Activo" : "Inactivo"}</p>
            <button onClick={handleSave}>Guardar</button>
            <button onClick={() => setEditing(false)}>Cancelar</button>
            </>
            ):(
            <>
            <p>Ciudad: {club.ciudad}</p>
            <p>Responsable: {club.responsable}</p>
            <p>Email: {club.email}</p>
            <p>Telefono: {club.telefono}</p>
            <p>Sede: {club.sede}</p>
            <p>Fecha de creacion: {club.createdAt ? new Date(club.createdAt).toLocaleDateString() : "-"}</p>
            <p>Fecha de actualizacion: {club.updatedAt ? new Date(club.updatedAt).toLocaleDateString() : "-"}</p>
            <p>Estado: {club.isActive ? "Activo" : "Inactivo"}</p>
            <button onClick={() => setEditing(true)}>Editar</button>
            <button onClick={ handleToggle}>
                {club.isActive ? "Desactivar" : "Activar"}
            </button>
            </>
            )}
        </div>
    );
}

export default ClubDetails;
