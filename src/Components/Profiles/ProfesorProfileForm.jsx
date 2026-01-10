import { useState } from "react";
import axios from "axios";

function ProfesorProfileForm({ userId }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [enea, setEnea] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submitProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    await axios.post("http://localhost:3000/api/coaches/complete-profile", {
      coachId: userId,
      nombre: nombre,
      apellido,
      email,
      telefono,
      domicilio,
      categoria,
      enea,
    });

    setSuccess(true);
    setLoading(false);

    if (success) {
      return <p>Perfil enviado. Pendiente de validación por ASAMBAL.</p>;
    }
  };

  return (
    <form onSubmit={submitProfile}>
      <h2>Datos del club</h2>

      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
        required
      />  

      <input
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        placeholder="Apellido"
        required
      />

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />

      <input
        value={ telefono}
        onChange={(e) => setTelefono(e.target.value)}
        placeholder="Telefono"
        required
      />  

      <input
        value={domicilio}
        onChange={(e) => setDomicilio(e.target.value)}
        placeholder="Domicilio"
        required
      />

      <input
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        placeholder="Categoria"
        required
      />

      <input
        value={enea}
        onChange={(e) => setEnea(e.target.value)}
        placeholder="ENEA"
        required
      />

      <button disabled={loading}>
        {loading ? "Enviando..." : "Enviar"}
      </button> 

      <h2>Perfil enviado. Pendiente de validación por el administrador.</h2>
    </form>
  );
}

export default ProfesorProfileForm;

