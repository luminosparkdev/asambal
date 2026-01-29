import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Api/Api";

function PlayerDetailAsambal() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/asambal/players/${id}`)
      .then(res => {
        const data = res.data;

        const activeClub =
          Array.isArray(data.clubs)
            ? data.clubs.find(c => c.status === "ACTIVO")
            : null;

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

          escuela: data.escuela,
          nivel: data.nivel,
          turno: data.turno,
          año: data.año,

          posicion: data.posicion,
          manohabil: data.manohabil,
          estatura: data.estatura,
          peso: data.peso,

          domiciliocobro: data.domiciliocobro,
          horariocobro: data.horariocobro,
          reglasclub: data.reglasclub ?? false,
          usoimagen: data.usoimagen ?? false,
          habilitadoAsambal: data.habilitadoAsambal ?? false,
          becado: data.becado ?? false,

          clubActivo: activeClub
            ? {
                nombre: activeClub.nombreClub,
                categorias: activeClub.categorias || [],
              }
            : null,

          status: data.status,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };

        setPlayer(normalized);
        setLoading(false);
      })
      .catch(() => navigate("/asambal/jugadores"));
  }, [id, navigate]);

  const formatBoolean = (value) =>
    value === true ? "Sí" : value === false ? "No" : "-";

  const formatDate = (date) => {
    if (!date) return "-";
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString("es-AR");
    }
    return new Date(date).toLocaleDateString("es-AR");
  };

  if (loading) return <p className="text-gray-200 p-6">Cargando...</p>;
  if (!player) return null;

  const Section = ({ title, children }) => (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase text-blue-400">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {children}
      </div>
    </div>
  );

  const Field = ({ label, value }) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase text-gray-400">{label}</span>
      <span className="text-gray-200">
        {typeof value === "boolean" ? formatBoolean(value) : value || "-"}
      </span>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover">
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div
          className={`p-4 rounded-2xl border-l-4 shadow-xl backdrop-blur bg-black/30
          ${player.status === "ACTIVO"
            ? "border-green-500"
            : "border-red-500"}`}
        >
          {/* HEADER */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-200">
                {player.nombre}{" "}
                <span className="text-blue-500">{player.apellido}</span>
              </h2>
              <p className="text-sm text-gray-400">
                Consulta de jugador · ASAMBAL
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
            <button
              onClick={() => navigate(`/asambal/jugadores/${id}/becas`)}
              className="px-3 py-1 ml-auto text-sm text-purple-400 transition-all border rounded-md border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-200"
            >
              Ver historial de becas
            </button>

          </div>

          {/* SECCIONES */}
          <div className="space-y-4">

            <Section title="Datos personales">
              <Field label="Nombre" value={player.nombre} />
              <Field label="Apellido" value={player.apellido} />
              <Field label="DNI" value={player.dni} />
              <Field label="Fecha de nacimiento" value={formatDate(player.fechaNacimiento)} />
              <Field label="Edad" value={player.edad} />
              <Field label="Sexo" value={player.sexo} />
            </Section>

            <Section title="Contacto">
              <Field label="Teléfono" value={player.telefono} />
              <Field label="Email" value={player.email} />
              <Field label="Instagram" value={player.instagram} />
              <Field label="Domicilio" value={player.domicilio} />
            </Section>

            <Section title="Educación">
              <Field label="Escuela" value={player.escuela} />
              <Field label="Nivel" value={player.nivel} />
              <Field label="Turno" value={player.turno} />
              <Field label="Año" value={player.año} />
            </Section>

            <Section title="Datos deportivos">
              <Field label="Posición" value={player.posicion} />
              <Field label="Mano hábil" value={player.manohabil} />
              <Field label="Estatura" value={player.estatura} />
              <Field label="Peso" value={player.peso} />
            </Section>

            <Section title="Administrativo">
              <Field label="Domicilio de cobro" value={player.domiciliocobro} />
              <Field label="Horario de cobro" value={player.horariocobro} />
              <Field label="Uso de imagen" value={player.usoimagen} />
              <Field label="Reglas del club" value={player.reglasclub} />
              <Field label="Habilitado por ASAMBAL" value={player.habilitadoAsambal} />
              <Field label="Becado" value={player.becado} />
            </Section>

            <Section title="Club actual">
              {player.clubActivo ? (
                <>
                  <Field label="Club" value={player.clubActivo.nombre} />
                  <Field
                    label="Categorías"
                    value={player.clubActivo.categorias.join(", ")}
                  />
                </>
              ) : (
                <Field label="Club" value="Sin club activo" />
              )}
            </Section>

          </div>

          <div className="mt-8 text-sm text-gray-400 space-y-1">
            <p>Creado: {formatDate(player.createdAt)}</p>
            <p>Última actualización: {formatDate(player.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerDetailAsambal;
