import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api"; 

function CreateClub() {
  const [clubName, setClubName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [venue, setVenue] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [manager, setManager] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("TOKEN:", localStorage.getItem("token"));

    await axios.post(API_URL + "/clubs", {
      clubName,
      adminEmail,
      venue,
      telephone: phone,
      city,
      manager,
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
          placeholder="Venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
        />

        <input required
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input required
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input  
          placeholder="Manager"
          value={manager}
          onChange={(e) => setManager(e.target.value)}
        />

        <button type="submit">Crear</button>
      </form>
    </>
  );
}

export default CreateClub;
