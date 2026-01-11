import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/Api";

function CoachesList() {
  const [coaches, setCoaches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/coaches`)
    .then(res => setCoaches(res.data))
    .catch(err => console.error(err));
  }, []);

  const toggleCoach = async (coach) => {
    // optimistic UI
    setCoaches(prev =>
      prev.map(p =>
        p.id === coach.id
          ? { ...p, isActive: !p.isActive }
          : p
      )
    );

    try {
      await api.patch(`/coaches/${coach.id}/toggle`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h2>Profesores</h2>

      <button onClick={() => navigate("/coaches/nuevo")}>
        Crear profesor
      </button>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>Domicilio</th>
            <th>Categoria</th>
            <th>ENEA</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {coaches.map(p => (
            <tr key={p.id}>
              <td>{p.nombre} {p.apellido}</td>
              <td>{p.dni}</td>
              <td>{p.email}</td>
              <td>{p.telefono}</td>
              <td>{p.domicilio}</td>
              <td>{p.categoria}</td>
              <td>{p.enea}</td>
              <td>{p.isActive ? "Activo" : "Inactivo"}</td>
              <td>
                <button onClick={() => navigate(`/coaches/${p.id}`)}>
                  Ver
                </button>
                <button onClick={() => toggleCoach(p)}>
                  {p.isActive ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default CoachesList;
