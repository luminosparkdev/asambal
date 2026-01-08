import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";


const API_URL = "http://localhost:3000/api";

function ClubsList() {
  const [clubs, setClubs] = useState([]);
  const navigate = useNavigate();

  //OBTENER LISTA DE CLUBES
  useEffect(() => {
    axios
      .get(API_URL + "/clubs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(res => setClubs(res.data))
      .catch(err => console.error(err));
  }, []);

  //FUNCION PARA AVTIVAR O DESACTIVAR UN CLUB
  const toggleClubStatus = async (club) => {

    if (club.isActive) {
        const result = await Swal.fire({
            title: "¿Desactivar club?",
            text: "El club quedará inactivo en el sistema al igual que los usuarios relacionados",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, desactivar",
            cancelButtonText: "Cancelar",
          });

          if (!result.isConfirmed) return;
    }

    //OPTIMISTIC UI
    setClubs(prev =>
      prev.map(c =>
        c.id === club.id
          ? { ...c, isActive: !c.isActive }
          : c
      )
    );

  try {
    await axios.patch(
      `${API_URL}/clubs/${club.id}/toggle`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  } catch (err) {
    console.error(err);

    //ROLLBACK
    setClubs(prev =>
      prev.map(c =>
        c.id === club.id
          ? { ...c, isActive: club.isActive }
          : c
      )
    );

    Swal.fire({
      title: "Error",
      text: "No se pudo desactivar el club",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  }
};

//ACTUALIZAR CLUB EN LA LISTA
const updateClubInList = (updatedClub) => {
  setClubs(prev =>
    prev.map(c =>
      c.id === updatedClub.id ? updatedClub : c
    )
  );
};


  return (
    <>
      <h2>Clubs registrados</h2>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ciudad</th>
            <th>Responsable</th>
            <th>Telefono</th>
            <th>Sede</th>
            <th>Fecha de creacion</th>
            <th>Fecha de actualizacion</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clubs.map(club => (
            <tr key={club.id}>
              <td>{club.nombre}</td>
              <td>{club.ciudad}</td>
              <td>{club.responsable}</td>
              <td>{club.telefono}</td>
              <td>{club.sede}</td>
              <td>{club.createdAt ? new Date(club.createdAt).toLocaleDateString() : "-"}</td>
              <td>{club.updatedAt ? new Date(club.updatedAt).toLocaleDateString() : "-"}</td>
              <td>{club.isActive ? "Activo" : "Inactivo"}</td>
              <td>
                <button onClick={() => navigate(`/clubs/${club.id}`)}>Ver Detalles</button>
                <button onClick={() => toggleClubStatus(club)}>{club.isActive ? "Desactivar" : "Activar"}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ClubsList;
