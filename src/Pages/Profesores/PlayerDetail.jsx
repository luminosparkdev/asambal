import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import Swal from "sweetalert2";

function PlayerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [player, setPlayer] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/players/${id}`)
      .then(res => {
        const data = res.data;
        const normalized = {
          id: data.id,
          nombre: data.nombre,
          apellido: data.apellido,
          dni: data.dni,
          fechaNacimiento: data.fechanacimiento,
          edad: data.edad,
          sexo: data.sexo,
          domicilio: data.domicilio,
          email: data.email,
          telefono: data.telefono,
          instagram: data.instagram,
          categoria: data.categoria,
          fechaAlta: data.fechaAlta,
          nivel: data.nivel,
          escuela: data.escuela,
          turno: data.turno,
          año: data.año,
          peso: data.peso,
          estatura: data.estatura,
          domiciliocobro: data.domiciliocobro,
          horariocobro: data.horariocobro,
          manohabil: data.manohabil,
          posicion: data.posicion,
          usoimagen: data.imageAuthorization ?? false,
          autorizacion: data.isAuthorized ?? false,
          reglasclub: data.reglasclub ?? false,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          status: data.status,
        };
        setPlayer(normalized);
        setForm(normalized);
        setLoading(false);
      })
      .catch(() => navigate("/players"));
  }, [id, navigate]);

  const formatBoolean = (value) => {
    if (value === true) return "Sí";
    if (value === false) return "No";
    return "-";
  };

  const formatDate = (date) => {
    if (!date) return "-";
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString("es-AR");
    }
    return new Date(date).toLocaleDateString("es-AR");
  };

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const previousPlayer = player;

    // Optimistic UI
    setPlayer(prev => ({ ...prev, ...form }));

    try {
      await api.put(`/players/${id}`, form);
      Swal.fire({
        icon: "success",
        title: "Jugador actualizado",
        timer: 1500,
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
      });
      navigate("/players");
      setEditing(false);
    } catch (err) {
      setPlayer(previousPlayer);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar los cambios",
      });
    }
  };

  const handleToggle = async () => {
    const isActive = player.status === "ACTIVO";
  const action = isActive ? "desactivar" : "activar";
  const nextStatus = isActive ? "INACTIVO" : "ACTIVO";

  const result = await Swal.fire({
    title: `¿Seguro que quieres ${action} este jugador?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: `Sí, ${action}`,
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  // Optimistic UI
  setPlayer(prev => ({ ...prev, status: nextStatus }));

  try {
    await api.patch(`/players/${id}/toggle`);
    Swal.fire({
      icon: "success",
      title: "Estado actualizado",
      timer: 1200,
      showConfirmButton: false,
    });
  } catch (err) {
    // rollback
    setPlayer(prev => ({ ...prev, status: isActive ? "ACTIVO" : "INACTIVO" }));
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo cambiar el estado",
    });
  }
};

  if (loading) return <p>Cargando...</p>;
  if (error) return <div>Error: {error.message}</div>;
  if (!player) return null;

  return (
    <div className="relative min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover">
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div
          className={`p-8 rounded-2xl border-l-4 shadow-xl backdrop-blur bg-black/30
          ${player.status === "ACTIVO" ? "border-green-500" : "border-red-500"}`}
        >
          {/* HEADER */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-200">
                {editing ? "Editar jugador" : `${player.nombre} ${player.apellido}`}
              </h2>
              <p className="text-sm text-gray-400">
                Gestión de jugadores · ASAMBAL
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold
              ${player.status === "ACTIVO"
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"}`}
            >
              {player.status}
            </span>
          </div>

          {/* BODY */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-gray-200">
            {[
              { label: "Nombre", name: "nombre" },
              { label: "Apellido", name: "apellido" },
              { label: "Fecha de nacimiento", name: "fechaNacimiento" },
              { label: "Edad", name: "edad" },
              { label: "Género", name: "sexo" },
              { label: "DNI", name: "dni" },
              { label: "Teléfono", name: "telefono" },
              { label: "Instagram", name: "instagram" },
              { label: "Domicilio", name: "domicilio" },
              { label: "Estatura", name: "estatura" },
              { label: "Peso", name: "peso" },
              { label: "Escuela", name: "escuela" },
              { label: "Nivel", name: "nivel" },
              { label: "Turno", name: "turno" },
              { label: "Año", name: "año" },
              { label: "Domicilio de cobro", name: "domiciliocobro" },
              { label: "Horario de cobro", name: "horariocobro" },
              { label: "Categoría", name: "categoria" },
              { label: "Posicion", name: "posicion" },
              { label: "Mano Hábil", name: "manohabil" },
              { label: "Autorización", name: "autorizacion" },
              { label: "Reglas del club", name: "reglasclub" },
              { label: "Uso de imagen", name: "usoimagen" },
            ].map(({ label, name }) => (
              <div key={name} className="flex flex-col gap-1">
                <span className="text-xs uppercase text-gray-400">{label}</span>
                
                {editing ? (
                  <>
                  <input
                    name={name}
                    value={form[name] || ""}
                    onChange={handleChange}
                    className="px-3 py-2 rounded-md bg-gray-800/70 border border-white/10
                               text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  </>
                ) : (
                  <div>
                    {typeof player[name] === "boolean"
                      ? formatBoolean(player[name])
                      : player[name] || "-"}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 text-sm text-gray-400 space-y-1">
            <p>Creado: {formatDate(player.createdAt)}</p>
            <p>Última actualización: {formatDate(player.updatedAt)}</p>
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
                  ${player.status === "ACTIVO"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"}`}
                >
                  {player.status === "ACTIVO" ? "Desactivar" : "Activar"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerDetails;

