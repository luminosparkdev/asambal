import { useState } from "react";
import axios from "axios";

function AdminClubProfileForm({ userId }) {
  const [nombre, setNombre] = useState("");
  const [responsable, setResponsable] = useState("");
  const [sede, setSede] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [canchasAlternativas, setCanchasAlternativas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [canchas, setCanchas] = useState({
    ancho: "",
    largo: "",
    piso: "",
    tablero: "",
    techo: "",
  });

  const submitProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    await axios.post("http://localhost:3000/api/admin-club/complete-profile", {
      adminUserId: userId,
      nombre: nombre,
      responsable,
      sede,
      telefono,
      canchas: {
        ancho: canchas.ancho,
        largo: canchas.largo,
        piso: canchas.piso,
        tablero: canchas.tablero,
        techo: canchas.techo,
        alternativas: {
          cancha1: canchasAlternativas[0] || null,
          cancha2: canchasAlternativas[1] || null,
        },
      },
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
        value={responsable}
        onChange={(e) => setResponsable(e.target.value)}
        placeholder="Responsable"
        required
      />

      <input
        value={sede}
        onChange={(e) => setSede(e.target.value)}
        placeholder="Sede"
        required
      />

      <input
        value={ciudad}
        onChange={(e) => setCiudad(e.target.value)}
        placeholder="Ciudad"
        required
      />  

      <input
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        placeholder="Telefono"
        required
      />

      <h2>Cancha Principal</h2>

      <input type="number" placeholder="Ancho"
        onChange={(e) => setCancha({ ...cancha, ancho: e.target.value })} />

      <input type="number" placeholder="Largo"
        onChange={(e) => setCancha({ ...cancha, largo: e.target.value })} />

      <input placeholder="Piso"
        onChange={(e) => setCancha({ ...cancha, piso: e.target.value })} />

      <input placeholder="Tablero"
        onChange={(e) => setCancha({ ...cancha, tablero: e.target.value })} />

      <input placeholder="Techo"
        onChange={(e) => setCancha({ ...cancha, techo: e.target.value })} />

      <button
        type="button"
        onClick={() => {
          if (canchasAlternativas.length < 2) {
            setCanchasAlternativas([
              ...canchasAlternativas,
              { ancho: "", largo: "", piso: "", tablero: "", techo: "" }
            ]);
            }
        }}
      >
        + Agregar cancha alternativa
      </button>

      {canchasAlternativas.map((canchaAlt, index) => (
          <div key={index}>
          <h4>Cancha alternativa {index + 1}</h4>

          <input type="number" placeholder="Ancho"
            onChange={(e) => {
              const copy = [...canchasAlternativas];
              copy[index].ancho = e.target.value;
              setCanchasAlternativas(copy);
            }} />

          <input type="number" placeholder="Largo"
            onChange={(e) => {
              const copy = [...canchasAlternativas];
              copy[index].largo = e.target.value;
              setCanchasAlternativas(copy);
            }} />

          <input placeholder="Piso"
            onChange={(e) => {
              const copy = [...canchasAlternativas];
              copy[index].piso = e.target.value;
              setCanchasAlternativas(copy);
            }} />

          <input placeholder="Tablero"
            onChange={(e) => {
              const copy = [...canchasAlternativas];
              copy[index].tablero = e.target.value;
              setCanchasAlternativas(copy);
            }} />

            <input placeholder="Techo"
            onChange={(e) => {
              const copy = [...canchasAlternativas];
              copy[index].techo = e.target.value;
              setCanchasAlternativas(copy);
            }} />
          </div>
        ))}

      <button disabled={loading}>
        {loading ? "Enviando..." : "Enviar"}
      </button>

    </form>
  );
}

export default AdminClubProfileForm;

