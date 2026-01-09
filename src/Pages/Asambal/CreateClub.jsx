import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api"; 

function CreateClub() {
  const navigate = useNavigate();
  const [clubName, setClubName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("TOKEN:", localStorage.getItem("token"));

    await axios.post(API_URL + "/clubs", {
      clubName,
      adminEmail,
      city,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  );

    alert("Club creado correctamente");
  };

  return (
    <>
      <h2>Crear club</h2>
      <form onSubmit={handleSubmit}>
        <input required
          placeholder="Nombre del club"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
        />

        <input required
          placeholder="Email admin club"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
        />

        <input required
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button type="submit">Crear</button>
      </form>
    </>
  );
}

export default CreateClub;
