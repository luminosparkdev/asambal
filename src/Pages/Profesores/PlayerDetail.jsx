import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import Swal from "sweetalert2";

function PlayerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [player, setPlayer] = useState(null);
  const [form, setForm] = useState({});
  const [tutorForm, setTutorForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/players/${id}`)
      .then((res) => {
        const data = res.data;

        // Normalizo fechas por si vienen en timestamp
        const formatDateFromApi = (date) => {
          if (!date) return null;
          if (date.seconds) return new Date(date.seconds * 1000).toISOString().slice(0, 10);
          return new Date(date).toISOString().slice(0, 10);
        };

        const normalizedPlayer = {
          id: data.id,
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          dni: data.dni || "",
          fechaNacimiento: formatDateFromApi(data.fechanacimiento || data.fechaNacimiento),
          edad: data.edad || "",
          sexo: data.sexo || "",
          domicilio: data.domicilio || "",
          email: data.email || "",
          telefono: data.telefono || "",
          instagram: data.instagram || "",
          categoria: data.categoria || "",
          fechaAlta: data.fechaAlta || "",
          nivel: data.nivel || "",
          escuela: data.escuela || "",
          turno: data.turno || "",
          año: data.año || "",
          peso: data.peso || "",
          estatura: data.estatura || "",
          domiciliocobro: data.domiciliocobro || "",
          horariocobro: data.horariocobro || "",
          manohabil: data.manohabil || "",
          posicion: data.posicion || "",
          usoimagen: data.usoimagen ?? false,
          autorizacion: data.autorizacion ?? false,
          reglasclub: data.reglasclub ?? false,
          createdAt: data.createdAt || "",
          updatedAt: data.updatedAt || "",
          status: data.status || "INACTIVO",
          tutor: data.tutor || null,
        };

        setPlayer(normalizedPlayer);
        setForm(normalizedPlayer);
        setTutorForm(normalizedPlayer.tutor || { nombre: "", apellido: "", dni: "", email: "", telefono: "" });

        setLoading(false);
      })
      .catch(() => {
        navigate("/players");
      });
  }, [id, navigate]);

  const formatDisplayDate = (date) => {
    if (!date) return "-";
    try {
      const d = new Date(date);
      return d.toLocaleDateString("es-AR");
    } catch {
      return date;
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTutorChange = (e) => {
    setTutorForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const previousPlayer = player;

    // Formar payload completo, con tutor si el jugador es menor
    const payload = { ...form };
    if ((form.edad ?? player.edad) < 16) {
      payload.tutor = { ...tutorForm };
    } else {
      delete payload.tutor;
    }

    try {
      await api.put(`/players/${id}`, payload);

      setPlayer(payload);
      Swal.fire({
        icon: "success",
        title: "Jugador actualizado",
        timer: 1500,
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
      });
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

    const previousStatus = player.status;
    setPlayer((prev) => ({ ...prev, status: nextStatus }));

    try {
      await api.patch(`/players/${id}/toggle`);
      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      setPlayer((prev) => ({ ...prev, status: previousStatus }));
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cambiar el estado",
      });
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!player) return null;

  const inputClass =
    "px-3 py-2 rounded-md bg-gray-800/70 border border-white/10 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const selectClass =
    "px-3 py-2 rounded-md bg-gray-800/70 border border-white/10 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500";

  // Campos editables (ajustá según necesidad)
  const editableFields = [
    "nombre", "apellido", "categoria",
    "dni", "sexo", "fechaNacimiento", "estatura", "peso",
    "domicilio", "telefono", "email", "instagram",
    "escuela", "nivel", "año", "turno",
    "posicion", "manohabil",
    "domiciliocobro", "horariocobro",
  ];

  return (
    <div className="relative min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 max-w-4xl px-4 py-8 mx-auto">
        <div
          className={`p-8 rounded-2xl border-l-4 shadow-xl backdrop-blur bg-black/30
          ${player.status === "ACTIVO" ? "border-green-500" : "border-red-500"}`}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-200">{`${player.nombre} ${player.apellido}`}</h2>
              <p className="text-sm text-gray-400">Gestión de jugadores · ASAMBAL</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold
              ${player.status === "ACTIVO" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}
            >
              {player.status}
            </span>
          </div>

          {/* Player Details */}
          <section className="space-y-6 text-gray-200">
            {/* Datos generales */}
            <div className="space-y-2">
              <h3 className="pl-2 mb-4 text-lg font-semibold tracking-wider text-gray-800 uppercase rounded-sm bg-gradient-to-r from-gray-200/80 to-transparent">
                Datos del jugador
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {["nombre", "apellido", "categoria"].map((field) => (
                  <div key={field} className="flex gap-2">
                    <span className="font-medium text-gray-400">{field.charAt(0).toUpperCase() + field.slice(1)}:</span>
                    {editing && editableFields.includes(field) ? (
                      <input name={field} value={form[field] || ""} onChange={handleChange} className={inputClass} />
                    ) : (
                      <span>{player[field] || "-"}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Información personal */}
            <div className="space-y-2">
              <h3 className="pl-2 mb-4 text-lg font-semibold tracking-wider text-gray-800 uppercase rounded-sm bg-gradient-to-r from-gray-200/80 to-transparent">
                Información personal
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  { label: "DNI", name: "dni" },
                  { label: "Sexo", name: "sexo", type: "select", options: ["Masculino", "Femenino"] },
                  { label: "Fecha de nacimiento", name: "fechaNacimiento", type: "date" },
                  { label: "Edad", name: "edad" },
                  { label: "Estatura", name: "estatura" },
                  { label: "Peso", name: "peso" },
                ].map(({ label, name, type, options }) => (
                  <div key={name} className="flex items-center gap-2">
                    <span className="font-medium text-gray-400">{label}:</span>
                    {editing && editableFields.includes(name) ? (
                      type === "select" ? (
                        <select name={name} value={form[name] || ""} onChange={handleChange} className={selectClass}>
                          <option value="">Seleccionar</option>
                          {options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={type || "text"}
                          name={name}
                          value={form[name] || ""}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      )
                    ) : (
                      <span>{player[name] || "-"}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contacto */}
            <div className="space-y-2">
              <h3 className="pl-2 mb-4 text-lg font-semibold tracking-wider text-gray-800 uppercase rounded-sm bg-gradient-to-r from-gray-200/80 to-transparent">
                Contacto
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {["telefono", "instagram", "domicilio", "email"].map((field) => (
                  <div key={field} className="flex gap-2">
                    <span className="font-medium text-gray-400">{field.charAt(0).toUpperCase() + field.slice(1)}:</span>
                    {editing && editableFields.includes(field) ? (
                      <input name={field} value={form[field] || ""} onChange={handleChange} className={inputClass} />
                    ) : (
                      <span>{player[field] || "-"}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Datos educativos */}
            <div className="space-y-2">
              <h3 className="pl-2 mb-4 text-lg font-semibold tracking-wider text-gray-800 uppercase rounded-sm bg-gradient-to-r from-gray-200/80 to-transparent">
                Datos educativos
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {["escuela", "nivel", "año", "turno"].map((field) => (
                  <div key={field} className="flex gap-2">
                    <span className="font-medium text-gray-400">{field.charAt(0).toUpperCase() + field.slice(1)}:</span>
                    {editing && editableFields.includes(field) ? (
                      <input name={field} value={form[field] || ""} onChange={handleChange} className={inputClass} />
                    ) : (
                      <span>{player[field] || "-"}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Datos de juego */}
            <div className="space-y-2">
              <h3 className="pl-2 mb-4 text-lg font-semibold tracking-wider text-gray-800 uppercase rounded-sm bg-gradient-to-r from-gray-200/80 to-transparent">
                Datos de juego
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {["posicion", "manohabil"].map((field) => (
                  <div key={field} className="flex gap-2">
                    <span className="font-medium text-gray-400">{field.charAt(0).toUpperCase() + field.slice(1)}:</span>
                    {editing && editableFields.includes(field) ? (
                      <input name={field} value={form[field] || ""} onChange={handleChange} className={inputClass} />
                    ) : (
                      <span>{player[field] || "-"}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Cobros */}
            <div className="space-y-2">
              <h3 className="pl-2 mb-4 text-lg font-semibold tracking-wider text-gray-800 uppercase rounded-sm bg-gradient-to-r from-gray-200/80 to-transparent">
                Cobros
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  { label: "Domicilio de cobro", name: "domiciliocobro" },
                  { label: "Horario de cobro", name: "horariocobro" },
                ].map(({ label, name }) => (
                  <div key={name} className="flex gap-2">
                    <span className="font-medium text-gray-400">{label}:</span>
                    {editing && editableFields.includes(name) ? (
                      <input name={name} value={form[name] || ""} onChange={handleChange} className={inputClass} />
                    ) : (
                      <span>{player[name] || "-"}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tutor */}
            {player.edad < 16 && (
              <div className="p-6 mt-10 text-gray-200 border rounded-lg border-yellow-500/40 bg-yellow-500/5">
                <h3 className="mb-4 text-xl font-semibold">Datos del Tutor</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {["nombre", "apellido", "dni", "email", "telefono"].map((field) => (
                    <div key={field} className="flex flex-col gap-1">
                      <span className="text-xs text-gray-400 uppercase">{field}</span>
                      {editing ? (
                        <input
                          name={field}
                          value={tutorForm[field] || ""}
                          onChange={handleTutorChange}
                          className={inputClass}
                        />
                      ) : (
                        <div>{tutorForm[field] || "-"}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Fechas */}
          <div className="mt-6 space-y-1 text-sm text-gray-400">
            <p>Creado: {formatDisplayDate(player.createdAt)}</p>
            <p>Última actualización: {formatDisplayDate(player.updatedAt)}</p>
          </div>

          {/* Acciones */}
          <div className="flex gap-4 mt-8">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Guardar cambios
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 py-3 text-gray-200 bg-gray-700 rounded-lg hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="flex-1 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={handleToggle}
                  className={`flex-1 py-3 font-semibold rounded-lg text-white ${
                    player.status === "ACTIVO"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
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
