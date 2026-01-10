import { useEffect, useState } from "react";
import axios from "axios";

function PendingUsers() {
  const [users, setUsers] = useState([]);

  const fetchPending = async () => {
    const res = await axios.get("http://localhost:3000/api/asambal/pending-users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setUsers(res.data);
  };

  const handleAction = async (userId, action) => {
    await axios.patch(
      "http://localhost:3000/api/asambal/validate-user",
      { userId, action },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    fetchPending();
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div>
      <h1>Usuarios pendientes</h1>

      {users.map((u) => (
        <div key={u.userId} style={{ border: "1px solid #ccc", padding: 10 }}>
          <p><b>Email:</b> {u.email}</p>
          <p><b>Club:</b> {u.club?.nombre}</p>
          <p><b>Ciudad:</b> {u.club?.ciudad}</p>

          <button onClick={() => handleAction(u.userId, "APPROVE")}>
            Aprobar
          </button>

          <button onClick={() => handleAction(u.userId, "REJECT")}>
            Rechazar
          </button>
        </div>
      ))}
    </div>
  );
}

export default PendingUsers;
