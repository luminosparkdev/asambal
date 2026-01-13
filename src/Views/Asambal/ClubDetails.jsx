import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../Api/Api";

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
  <div className="p-4 min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')]">
    <h2 className="mb-6 text-2xl font-bold text-gray-200">
      {editing ? "Editar club" : club.nombre}
    </h2>

    {editing ? (
      <div className="flex flex-col gap-4">
        <input
          name="nombre"
          value={form.nombre}
          type="text"
          onChange={handleChange}
          placeholder="Nombre"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="ciudad"
          value={form.ciudad}
          type="text"
          onChange={handleChange}
          placeholder="Ciudad"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="email"
          value={form.email}
          type="text"
          onChange={handleChange}
          placeholder="Email"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="responsable"
          value={form.responsable}
          type="text"
          onChange={handleChange}
          placeholder="Responsable"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="telefono"
          value={form.telefono}
          type="text"
          onChange={handleChange}
          placeholder="Teléfono"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="sede"
          value={form.sede}
          type="text"
          onChange={handleChange}
          placeholder="Sede"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="mt-2 space-y-1 text-gray-200">
          <p><span className="font-semibold">Fecha de creación:</span> {formatDate(club.createdAt)}</p>
          <p><span className="font-semibold">Fecha de actualización:</span> {formatDate(club.updatedAt)}</p>
          <p><span className="font-semibold">Estado:</span> 
            <span className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${
              club.status === "ACTIVO" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {club.status}
            </span>
          </p>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Guardar
          </button>
          <button
            onClick={() => setEditing(false)}
            className="flex-1 px-4 py-2 font-semibold text-gray-200 transition-colors bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </div>
    ) : (
      <div className="flex flex-col gap-3 text-gray-200">
        <p><span className="font-semibold">Ciudad:</span> {club.ciudad}</p>
        <p><span className="font-semibold">Responsable:</span> {club.responsable}</p>
        <p><span className="font-semibold">Email:</span> {club.email}</p>
        <p><span className="font-semibold">Teléfono:</span> {club.telefono}</p>
        <p><span className="font-semibold">Sede:</span> {club.sede}</p>
        <p><span className="font-semibold">Fecha de creación:</span> {formatDate(club.createdAt)}</p>
        <p><span className="font-semibold">Fecha de actualización:</span> {formatDate(club.updatedAt)}</p>
        <p><span className="font-semibold">Estado:</span> 
          <span className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${
            club.status === "ACTIVO" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {club.status}
          </span>
        </p>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setEditing(true)}
            className="flex-1 px-4 py-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Editar
          </button>
          <button
            onClick={handleToggle}
            className={`flex-1 px-4 py-2 font-semibold rounded-lg text-white transition-colors ${
              club.status === "ACTIVO" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {club.status === "ACTIVO" ? "Desactivar" : "Activar"}
          </button>
        </div>
      </div>
    )}
  </div>
);

}

export default ClubDetails;
