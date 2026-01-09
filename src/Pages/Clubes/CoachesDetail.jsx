import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

function CoachDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/coaches/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(res => {
      setCoach(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      navigate("/coaches");
    });
  }, [id, navigate]);

  if (loading) return <p>Cargando...</p>;
  if (!coach) return null;

  const handleChange = (e) => {
    setCoach({
      ...coach,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${API_URL}/coaches/${id}`,
        coach,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate("/coaches");
    } catch (err) {
      console.error(err);
      alert("Error al guardar cambios");
    }
  };

  return (
    <>
      <h2>Detalle del Coach</h2>

      <form onSubmit={handleSubmit}>
        <input name="nombre" value={coach.nombre} onChange={handleChange} />
        <input name="apellido" value={coach.apellido} onChange={handleChange} />
        <input name="dni" value={coach.dni} onChange={handleChange} />
        <input name="email" value={coach.email} onChange={handleChange} />
        <input name="telefono" value={coach.telefono} onChange={handleChange} />
        <input name="domicilio" value={coach.domicilio} onChange={handleChange} />
        <input name="categoria" value={coach.categoria} onChange={handleChange} />
        <input name="enea" value={coach.enea} onChange={handleChange} />

        <button type="submit">Guardar cambios</button>
        <button type="button" onClick={() => navigate("/profesores")}>
          Cancelar
        </button>
      </form>
    </>
  );
}

export default CoachDetails;

