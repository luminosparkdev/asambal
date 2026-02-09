import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../Api/Api";
import { formatLabel } from "../../Utils/formatters";

function ClubDetails() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  // Cargar club
  useEffect(() => {
    api.get(`/clubs/${id}`)
      .then(response => {
        setClub(response.data);
        setForm({
          nombre: response.data.nombre,
          ciudad: response.data.ciudad,
          email: response.data.email,
          telefono: response.data.telefono,
          sede: response.data.sede,
          responsable: response.data.responsable,
        });
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!form.nombre?.trim()) return "El nombre es obligatorio";
    if (!form.ciudad?.trim()) return "La ciudad es obligatoria";
    if (!form.responsable?.trim()) return "El responsable es obligatorio";
    if (!form.sede?.trim()) return "La sede es obligatoria";
    if (!form.telefono?.trim()) return "El teléfono es obligatorio";
    if (!form.email?.trim()) return "El email es obligatorio";

    if (!/^[0-9+\-\s()]+$/.test(form.telefono)) {
      return "El teléfono tiene caracteres inválidos";
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email)) {
      return "El email tiene caracteres inválidos";
    }

    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      Swal.fire({
        title: "Error",
        text: validationError,
        icon: "error",
      });
      return;
    }

    const previousClub = club;

    // Optimistic UI
    setClub(prev => ({
      ...prev,
      ...form,
      updatedAt: new Date().toISOString(),
    }));

    try {
      await api.put(`/clubs/${id}`, form);
      Swal.fire({
        title: "Guardado",
        text: "Club actualizado correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      setEditing(false);
    } catch (error) {
      // Rollback
      setClub(previousClub);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudo actualizar el club",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const handleToggle = async () => {
    const action = club.status === "ACTIVO" ? "desactivar" : "activar";
    const previousStatus = club.status;
    const optimisticStatus = club.status === "ACTIVO" ? "INACTIVO" : "ACTIVO";

    const result = await Swal.fire({
      title: `¿Seguro que quieres ${action} este club?`,
      text: action === "desactivar"
        ? "El club quedará inactivo en el sistema al igual que los usuarios relacionados"
        : "El club volverá a estar activo en el sistema",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: action === "desactivar" ? "#d33" : "#3085d6",
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    // Optimistic update
    setClub(prev => ({ ...prev, status: optimisticStatus }));

    try {
      await api.patch(`/clubs/${id}/toggle`);
      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: action === "desactivar"
          ? "El club ha sido desactivado exitosamente"
          : "El club ha sido activado exitosamente",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      // Rollback
      setClub(prev => ({ ...prev, status: previousStatus }));
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudo cambiar el estado del club",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const formatDate = (date) => date
    ? new Date(date).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "-";

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!club) return <div>Club no encontrado</div>;

return (
  <div className="relative min-h-screen p-8 bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover bg-center">
    <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/*CARD*/}
        <div
          className={`select-none p-8 rounded-2xl shadow-xl bg-transparent border-l-4 transition-all
          ${club.status === "ACTIVO" ? "border-green-500" : "border-red-500"}
          `}
        >
          {/*HEADER*/}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="mb-6 text-2xl font-bold text-gray-200">
                {editing ? "Editar club" : club.nombre}
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Gestión institucional · ASAMBAL
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold
              ${club.status === "ACTIVO"
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"}
              `}
            >
              {club.status}
            </span>
          </div>

          {/*BODY*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
            {[
              { label: "Ciudad", name: "ciudad" },
              { label: "Responsable", name: "responsable" },
              { label: "Email", name: "email" },
              { label: "Teléfono", name: "telefono" },
              { label: "Sede", name: "sede" },
            ].map(({ label, name }) => (
              <div key={name} className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-gray-400">
                  {label}
                </span>

                {editing ? (
                  <input
                    name={name}
                    value={form[name] || ""}
                    onChange={handleChange}
                    className="px-3 py-2 rounded-md bg-gray-800/70 border border-white/10
                             text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-sm">
                    {club[name] || "-"}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* META */}
          <div className="mt-6 text-sm text-gray-400 space-y-1">
            <p>Creado: {formatDate(club.createdAt)}</p>
            <p>Última actualización: {formatDate(club.updatedAt)}</p>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 mt-8">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="cursor-pointer flex-1 py-3 rounded-lg font-semibold text-white
                           bg-blue-600 hover:bg-blue-700 transition"
                >
                  Guardar cambios
                </button>

                <button
                  onClick={() => setEditing(false)}
                  className="cursor-pointer flex-1 py-3 rounded-lg font-semibold text-gray-200
                           bg-gray-700 hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="cursor-pointer flex-1 py-3 rounded-lg font-semibold text-white
                           bg-blue-600 hover:bg-blue-700 transition"
                >
                  Editar
                </button>

                <button
                  onClick={handleToggle}
                  className={`cursor-pointer flex-1 py-3 rounded-lg font-semibold text-white transition
                    ${club.status === "ACTIVO"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"}
                  `}
                >
                  {club.status === "ACTIVO" ? "Desactivar" : "Activar"}
                </button>
              </>
            )}
          </div>
          {/* INSTALACIONES */}
<div className="mt-8 space-y-4">
  <h3 className="text-lg font-semibold text-gray-100">
    🏟️ Instalaciones
  </h3>

  {/* Cancha principal */}
  {club.canchas && (
    <div className="p-4 rounded-xl border border-white/20 bg-black/30 backdrop-blur">
      <h4 className="mb-2 text-sm font-semibold text-blue-400 uppercase">
        Cancha principal
      </h4>

      <div className="grid grid-cols-2 gap-2 text-sm text-gray-200">
        <p><span className="text-gray-400">Dimensiones:</span> {club.canchas.ancho}m × {club.canchas.largo}m</p>
        <p><span className="text-gray-400">Piso:</span> {formatLabel(club.canchas.piso)}</p>
        <p><span className="text-gray-400">Tablero:</span> {formatLabel(club.canchas.tablero)}</p>
        <p><span className="text-gray-400">Techo:</span> {club.canchas.techo ? "Sí" : "No"}</p>
      </div>
    </div>
  )}

  {/* Canchas alternativas */}
  {club.canchasAlternativas?.length > 0 && (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-300 uppercase">
        Canchas alternativas
      </h4>

      <div className="grid gap-3 md:grid-cols-2">
        {club.canchasAlternativas.map((cancha, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-white/20 bg-black/20 backdrop-blur"
          >
            <h5 className="mb-2 text-xs font-semibold text-yellow-400 uppercase">
              Alternativa {i + 1}
            </h5>

            <div className="space-y-1 text-sm text-gray-200">
              <p>Dimensiones: {cancha.ancho}m × {cancha.largo}m</p>
              <p>Piso: {formatLabel(cancha.piso)}</p>
              <p>Tablero: {formatLabel(cancha.tablero)}</p>
              <p>Techo: {cancha.techo ? "Sí" : "No"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>
        </div>
      </div>
    </div>
);

}

export default ClubDetails;
