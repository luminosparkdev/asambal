import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import Swal from "sweetalert2";

function CoachDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [coach, setCoach] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/coaches/${id}`)
      .then(res => {
        const data = res.data;
        setCoach(data);
        setForm({
          nombre: data.nombre,
          apellido: data.apellido,
          dni: data.dni,
          email: data.email,
          telefono: data.telefono,
          domicilio: data.domicilio,
          categoria: data.categoria,
          enea: data.enea,
        });
        setLoading(false);
      })
      .catch(() => navigate("/coaches"));
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const previousCoach = coach;

    // Optimistic UI
    setCoach(prev => ({ ...prev, ...form }));

    try {
      await api.put(`/coaches/${id}`, form);
      Swal.fire({
        icon: "success",
        title: "Profesor actualizado",
        timer: 1500,
        showConfirmButton: false,
      });
      setEditing(false);
    } catch (err) {
      setCoach(previousCoach);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar los cambios",
      });
    }
  };

  const handleToggle = async () => {
    const isActive = coach.status === "ACTIVO";
    const action = isActive ? "desactivar" : "activar";
    const previousStatus = coach.status;
    const optimisticStatus = isActive ? "INACTIVO" : "ACTIVO";

    const result = await Swal.fire({
      title: `¿Seguro que quieres ${action} este profesor?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    setCoach(prev => ({ ...prev, status: optimisticStatus }));

    try {
      await api.patch(`/coaches/${id}/toggle`);
      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      setCoach(prev => ({ ...prev, status: previousStatus }));
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cambiar el estado",
      });
    }
  };

  const formatDate = (date) => date
    ? new Date(date).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "-";

  if (loading) return <p>Cargando...</p>;
  if (error) return <div>Error: {error.message}</div>;
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
                {editing ? "Editar profesor" : `${coach.nombre} ${coach.apellido}`}
              </h2>
              <p className="text-sm text-gray-400">
                Gestión de profesores · ASAMBAL
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
              { label: "Email", name: "email", readonly:true},
              { label: "Teléfono", name: "telefono" },
              { label: "Domicilio", name: "domicilio" },
              { label: "Categoría", name: "categoria" },
              { label: "ENEA", name: "enea" },
            ].map(({ label, name }) => (
              <div key={name} className="flex flex-col gap-1">
                <span className="text-xs uppercase text-gray-400">{label}</span>
                {editing ? (
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

          <div className="mt-6 text-sm text-gray-400 space-y-1">
            <p>Creado: {formatDate(coach.createdAt)}</p>
            <p>Última actualización: {formatDate(coach.updatedAt)}</p>
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
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Editar
                </button>
                <button
                  onClick={handleToggle}
                  className={`flex-1 py-3 rounded-lg text-white font-semibold
                  ${coach.status === "ACTIVO"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"}`}
                >
                  {coach.status === "ACTIVO" ? "Desactivar" : "Activar"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoachDetails;

