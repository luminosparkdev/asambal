import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import Swal from "sweetalert2";

function JugadorProfileForm({ userId, activationToken }) {
  const navigate = useNavigate();

  const [readonlyData, setReadonlyData] = useState(null);

  const [form, setForm] = useState({
    sexo: "",
    fechanacimiento: "",
    edad: "",
    dni: "",
    telefono: "",
    domicilio: "",
    domiciliocobro: "",
    nivel: "",
    peso: "",
    estatura: "",
    escuela: "",
    turno: "",
    instagram: "",
    reglasasambal: false,
    reglasclub: false,
    usoimagen: false,
    horariocobro: "",
    año: "",
    manohabil: "",
    posicion: "",
  });

  const [tutor, setTutor] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    telefono: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const inputClass =
    "input-glass px-3 py-2 border border-gray-500 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400";

  const canSubmit = form.reglasasambal && form.reglasclub && form.usoimagen;

  {/*useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await api.get("/players/me");
        setReadonlyData({
          nombre: res.data.nombre,
          apellido: res.data.apellido,
          email: res.data.email,
          categoria: res.data.categoria,
        });
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudieron cargar los datos del jugador", "error");
      }
    };

    fetchPlayer();
  }, []);*/}

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "fechanacimiento") {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      setForm((prev) => ({
        ...prev,
        edad: Number(age),
      }));
    }
  };

  const handleTutorChange = (e) => {
    const { name, value } = e.target;
    setTutor((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setAttemptedSubmit(true);

  if (isSubmitting || !canSubmit) return;

  setIsSubmitting(true);

  try {
    // Aquí asumimos que ya sabes el club del jugador. 
    // Si lo tenés en readonlyData o en otra parte, ajusta estas variables
    const clubId = readonlyData?.clubId || "CLUB_ID_DEFAULT";
    const nombreClub = readonlyData?.clubNombre || "Nombre del club";
    const categorias = readonlyData?.categorias || ["Categoría por defecto"];

    // Payload que espera el backend
    const payload = {
      activationToken: activationToken,
      form: { ...form },
      tutor: Number(form.edad) < 16 ? tutor : null,
      clubId,
      nombreClub,
      categorias,
    };

    console.log("Payload enviado:", payload); // 👈 útil para debug

    await api.post(`/players/${userId}/complete-profile`, payload);

    Swal.fire({
      icon: "success",
      title: "Perfil enviado",
      text: "Pendiente de validación por el profesor",
      confirmButtonText: "Aceptar",
      background: "#0f172a",
      color: "#e5e7eb",
      confirmButtonColor: "#16a34a",
    }).then(() => navigate("/"));
  } catch (err) {
    console.error("❌ Error enviando perfil:", err);
    setMessage(err.response?.data?.message || "Error al enviar el perfil");
  } finally {
    setIsSubmitting(false);
  }
};

  const showTutor = Number(form.edad) < 16;

  const SEXOS = ["Masculino", "Femenino"];

  const TURNOS = ["Mañana", "Tarde", "Noche"];

  const MANO_HABIL = ["Derecha", "Izquierda", "Ambidiestro"];

  const NIVELES = ["Primaria", "Secundaria", "Terciario", "Universitario"];

  const ANIOS = ["1", "2", "3", "4", "5", "6"];

  const POSICIONES = [
    "Arquero",
    "Lateral izquierdo",
    "Lateral derecho",
    "Central",
    "Extremo izquierdo",
    "Extremo derecho",
    "Pivote"
  ];

  const selectClass =
  "input-glass px-3 py-2 border border-gray-500 rounded-md text-gray-200 bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 appearance-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="text-center md:col-span-2">
        <h2 className="text-2xl font-semibold text-white">Completar perfil</h2>
        <p className="mt-1 text-sm text-gray-300">
          Estos datos serán validados por su profesor
        </p>
      </div>

      {/* Datos readonly */}
      {readonlyData && (
        <section className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-100">
                Datos del jugador
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2 text-sm text-gray-300">
                <span className="font-medium text-gray-400">Nombre: </span>
                <span>{readonlyData.nombre}</span>
            </div>

            <div className="flex gap-2">
                <span className="font-medium text-gray-400">Apellido: </span>
                <span>{readonlyData.apellido}</span>
            </div>

            <div className="flex items-center gap-2">
                <span className="font-medium text-gray-400">Email: </span>
                <span className="max-w-full truncate">{readonlyData.email}</span>
            </div>

            <div className="flex gap-2">
                <span className="font-medium text-gray-400">Categoría: </span>
                <span>{readonlyData.categoria}</span>
            </div>
            </div>
        </section>
        )}

      {/* Información personal */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold tracking-wide text-gray-300 uppercase">
          Información personal
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input name="dni" placeholder="DNI" onChange={handleChange} className={inputClass} />
        <select name="sexo" onChange={handleChange} className={selectClass} value={form.sexo}>
            <option value="">Seleccionar sexo</option>
            {SEXOS.map((sexo) => (
                <option key={sexo} value={sexo}>
                    {sexo}
                </option>
            ))}
        </select>
        <input type="date" name="fechanacimiento" onChange={handleChange} className={inputClass} />
        <input name="edad" placeholder="Edad" value={form.edad} disabled className={`${inputClass} opacity-60`} />
        <input name="estatura" placeholder="Estatura (cm)" value={form.estatura} onChange={handleChange} className={inputClass} />
        <input name="peso" placeholder="Peso (kg)" value={form.peso} onChange={handleChange} className={inputClass} />
        </div>
      </section>

      {/*Contacto*/}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold tracking-wide text-gray-300 uppercase">
          Contacto
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input name="telefono" placeholder="Telefono" onChange={handleChange} className={inputClass} />
        <input name="instagram" placeholder="Instagram" onChange={handleChange} className={inputClass} />
        <input name="domicilio" placeholder="Domicilio" onChange={handleChange} className={inputClass} />
        </div>
      </section>

      {/* Educativos */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold tracking-wide text-gray-300 uppercase">
          Datos educativos
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input name="escuela" placeholder="Escuela" onChange={handleChange} className={inputClass} />
        <select name="nivel" onChange={handleChange} className={selectClass} value={form.nivel}>
            <option value="">Seleccionar nivel</option>
            {NIVELES.map((nivel) => (
                <option key={nivel} value={nivel}>
                    {nivel}
                </option>
            ))}
        </select>
        <select name="año" onChange={handleChange} className={selectClass} value={form.año}>
            <option value="">Seleccionar año</option>
            {ANIOS.map((anio) => (
                <option key={anio} value={anio}>
                    {anio}
                </option>
            ))}
        </select>
        <select name="turno" onChange={handleChange} className={selectClass} value={form.turno}>
            <option value="">Seleccionar turno</option>
            {TURNOS.map((turno) => (
                <option key={turno} value={turno}>
                    {turno}
                </option>
            ))}
        </select>
        </div>

      </section>

      {/* Juego */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold tracking-wide text-gray-300 uppercase">
          Datos de juego
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <select name="posicion" onChange={handleChange} className={selectClass} value={form.posicion}>
            <option value="">Seleccionar posición</option>
            {POSICIONES.map((posicion) => (
                <option key={posicion} value={posicion}>
                    {posicion}
                </option>
            ))}
        </select>
        <select name="manohabil" onChange={handleChange} className={selectClass} value={form.manohabil}>
            <option value="">Seleccionar mano hábil</option>
            {MANO_HABIL.map((mano) => (
                <option key={mano} value={mano}>
                    {mano}
                </option>
            ))}
        </select>
        </div>
      </section>

      {/* Cobros*/}

      <section className="space-y-4">
        <h3 className="text-xs font-semibold tracking-wide text-gray-300 uppercase">
          Cobros
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input name="domiciliocobro" placeholder="Domicilio de cobro" onChange={handleChange} className={inputClass} />
        <input name="horariocobro" placeholder="Horario de cobro" onChange={handleChange} className={inputClass} />
        </div>
      </section>

      {/* Tutor */}
      {showTutor && (
        <section className="p-4 space-y-4 border rounded-md md:col-span-2 border-yellow-500/40 bg-yellow-500/5">
          <h3 className="text-xs font-semibold tracking-wide text-yellow-400 uppercase">
            Datos del tutor
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {["nombre", "apellido", "dni", "email", "telefono"].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field.toUpperCase()}
                value={tutor[field]}
                onChange={handleTutorChange}
                className={inputClass}
              />
            ))}
          </div>
        </section>
      )}

      {/* Reglas */}
      <section className="space-y-3 md:col-span-2">
        <label className="flex items-center gap-2 text-gray-300">
          <input type="checkbox" name="reglasasambal" onChange={handleChange} />
          Acepto que en caso de ser transferido a otro club debo abonar el costo federativo.
        </label>

        <label className="flex items-center gap-2 text-gray-300">
          <input type="checkbox" name="reglasclub" onChange={handleChange} />
          Acepto las reglas del club.
        </label>

        <label className="flex items-center gap-2 text-gray-300">
          <input type="checkbox" name="usoimagen" onChange={handleChange} />
          Autorizo el uso de imagen.
        </label>

        {attemptedSubmit && !canSubmit && (
          <p className="text-sm text-red-400">
            Debe aceptar las reglas de la federación, del club y el uso de imagen para continuar.
          </p>
        )}
      </section>

      {/* Submit */}
      <button
        disabled={isSubmitting || !canSubmit}
        type="submit"
        className="w-full py-3 text-sm font-semibold text-white transition bg-green-700 border border-green-500 rounded-md md:col-span-2 hover:bg-green-600/90 disabled:opacity-50"
      >
        {isSubmitting ? "Enviando..." : "Enviar perfil"}
      </button>
    </form>
  );
}

export default JugadorProfileForm;
