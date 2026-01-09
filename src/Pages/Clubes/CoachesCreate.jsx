import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

function CoachCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    DNI: "",
    email: "",
    telefono: "",
    domicilio: "",
    categoria: "",
    enea: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/coaches`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate("/coaches");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error al crear profesor");
    }
  };

  return (
    <>
      <h2>Crear Coach</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
        />

        <input
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={handleChange}
        />

        <input
          name="dni"
          placeholder="DNI"
          value={form.dni}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="telefono"
          placeholder="Telefono"
          value={form.telefono}
          onChange={handleChange}
        />

        <input
          name="domicilio"
          placeholder="Domicilio"
          value={form.domicilio}
          onChange={handleChange}
        />

        <input
          name="categoria"
          placeholder="Categoria"
          value={form.categoria}
          onChange={handleChange}
        />

        <input
          name="enea"
          placeholder="ENEA"
          value={form.enea}
          onChange={handleChange}
        />

        <button type="submit">Guardar</button>
        <button type="button" onClick={() => navigate("/coaches")}>
          Cancelar
        </button>
      </form>
    </>
  );
}

export default CoachCreate;

