import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import Swal from "sweetalert2";

function CoachProfile() {
  const navigate = useNavigate();

  const [coach, setCoach] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const editableFields = ["enea"];

  useEffect(() => {
    api.get("/coaches/me")
      .then((res) => {
        const data = res.data;
        setCoach(data);
        setForm({ enea: data.enea || "" });
        setLoading(false);
      })
      .catch(() => navigate("/dashboard"));
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ enea: e.target.value });
  };

  const handleSave = async () => {
    const previousCoach = coach;

    setCoach((prev) => ({ ...prev, enea: form.enea }));

    try {
      await api.put("/coaches/me", { enea: form.enea });
      Swal.fire({
        icon: "success",
        title: "ENEA actualizada",
        timer: 1500,
        showConfirmButton: false,
      });
      setEditing(false);
    } catch {
      setCoach(previousCoach);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el cambio",
      });
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!coach) return null;

  return (
    <div className="relative min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover">
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div
          className={`p-8 rounded-2xl border-l-4 shadow-xl backdrop-blur bg-black/30
          ${coach.status === "ACTIVO" ? "border-green-500" : "border-red-500"}`}
        >
          {/* HEADER */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-200">
                {coach.nombre} {coach.apellido}
              </h2>
              <p className="text-sm text-gray-400">
                Perfil del profesor · ASAMBAL
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold
              ${coach.status === "ACTIVO"
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"}`}
            >
              {coach.status}
            </span>
          </div>

          {/* BODY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
            {[
              { label: "Nombre", name: "nombre" },
              { label: "Apellido", name: "apellido" },
              { label: "DNI", name: "dni" },
              { label: "Email", name: "email" },
              { label: "Teléfono", name: "telefono" },
              { label: "Domicilio", name: "domicilio" },
              { label: "Categoría", name: "categoria" },
              { label: "ENEA", name: "enea" },
            ].map(({ label, name }) => (
              <div key={name} className="flex flex-col gap-1">
                <span className="text-xs uppercase text-gray-400">{label}</span>
                {editing && editableFields.includes(name) ? (
                  <input
                    name={name}
                    value={form[name] || ""}
                    onChange={handleChange}
                    className="px-3 py-2 rounded-md bg-gray-800/70 border border-white/10
                               text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-sm">{coach[name] || "-"}</span>
                )}
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 mt-8">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Guardar cambios
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Editar ENEA
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoachProfile;
    