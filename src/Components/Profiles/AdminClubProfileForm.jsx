import { useState, useEffect } from "react";
import axios from "axios";

function AdminClubProfileForm({ userId, clubId }) {
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

  const getClubData = async () => {
  const res = await axios.get(
    `http://localhost:3000/api/clubs/${clubId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  setNombre(res.data.nombre);
  setCiudad(res.data.ciudad);
};

useEffect(() => {
  getClubData();
}, [clubId]);

  const submitProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    await axios.post(`http://localhost:3000/api/clubs/${clubId}/complete-profile`, {
      adminUserId: userId,
      responsable,
      sede,
      telefono,
      canchas,
      canchasAlternativas,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

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
        disabled
      />

      <input
        value={ciudad}
        disabled
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
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        placeholder="Telefono"
        required
      />

      <h2>Cancha Principal</h2>

      <input type="number" placeholder="Ancho"
        onChange={(e) => setCanchas({ ...canchas, ancho: e.target.value })} />

      <input type="number" placeholder="Largo"
        onChange={(e) => setCanchas({ ...canchas, largo: e.target.value })} />

      <input placeholder="Piso"
        onChange={(e) => setCanchas({ ...canchas, piso: e.target.value })} />

      <input placeholder="Tablero"
        onChange={(e) => setCanchas({ ...canchas, tablero: e.target.value })} />

      <input placeholder="Techo"
        onChange={(e) => setCanchas({ ...canchas, techo: e.target.value })} />

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

