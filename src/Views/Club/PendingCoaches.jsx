import { useEffect, useState } from "react";
import api from "../../Api/Api";

function PendingCoaches() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    const res = await api.get("/coaches/pending-coaches");
    setCoaches(res.data);
    setLoading(false);
  };

  const handleAction = async (coachId, action) => {
    await api.patch("/coaches/validate-coach", { coachId, action });
    setCoaches((prev) => prev.filter((c) => c.id !== coachId));
    fetchPending();
        },
      }
    );

    setCoaches((prev) => prev.filter((c) => c.id !== coachId));
    fetchPending();
  };

  useEffect(() => {
    fetchPending();
  }, []);

  if (loading) return <p>Cargando solicitudes...</p>;

  if (coaches.length === 0) {
    return <p>No hay profesores pendientes 🎉</p>;
  }

  return (
    <div>
      <h1>Profesores pendientes</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : coaches.map((c) => (
        <div key={c.id} style={{ border: "1px solid #ccc", padding: 10 }}>
          <p><b>Email:</b> {c.email}</p>
          <p><b>Nombre:</b> {c.nombre}</p>
          <p><b>Categoria:</b> {c.categoria}</p>
          <p><b>ENEA:</b> {c.enea}</p>

          <button onClick={() => handleAction(c.id, "APPROVE")}>
            Aprobar
          </button>

          <button onClick={() => handleAction(c.id, "REJECT")}>
            Rechazar
          </button>
        </div>
      ))}
    </div>
  );
}

export default PendingCoaches;
