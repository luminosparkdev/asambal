import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

function CreatePlayer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    sexo: "",
    fechanacimiento: "",
    edad: null,
    dni: "",
    email: "",
    telefono: "",
    domicilio: "",
    domiciliocobro: "",
    categoria: "",
    nivel: "",
    peso: null,
    estatura: null,
    escuela: "",
    turno: "",
    instagram: "",
    reglasclub: false,
    usoimagen: false,
    horariocobro: "",
    año: "",
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
      setForm((prev) => ({ ...prev, edad: age }));
    }
  };

  const handleTutorChange = (e) => {
    const { name, value } = e.target;
    setTutor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Si jugador <16, agregar tutor al objeto
    const payload = { ...form };
    if (form.edad < 16) payload.tutor = tutor;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/players", payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      Swal.fire({
        icon: "success",
        title: "Jugador creado",
        text: "El jugador fue registrado correctamente",
        confirmButtonText: "Aceptar",
        background: "#0f172a",
        color: "#e5e7eb",
        confirmButtonColor: "#16a34a",
      }).then(() => navigate("/profesor"));

    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error al crear el jugador");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover bg-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-3xl p-6 bg-transparent border border-gray-500 shadow-xl backdrop-blur rounded-2xl"
      >
        <h2 className="mb-2 text-2xl font-bold text-gray-200">Crear Jugador</h2>
        <p className="mb-4 text-sm text-gray-300">Completa los datos del jugador</p>

        {message && <div className="mb-4 text-red-400">{message}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/** Inputs principales */}
          {[
            { name: "nombre", placeholder: "Nombre" },
            { name: "apellido", placeholder: "Apellido" },
            { name: "sexo", placeholder: "Sexo" },
            { name: "fechanacimiento", placeholder: "Fecha de Nacimiento", type: "date" },
            { name: "edad", placeholder: "Edad", type: "number", disabled: true },
            { name: "dni", placeholder: "DNI" },
            { name: "email", placeholder: "Email", type: "email" },
            { name: "telefono", placeholder: "Teléfono" },
            { name: "domicilio", placeholder: "Domicilio" },
            { name: "domiciliocobro", placeholder: "Domicilio Cobro" },
            { name: "categoria", placeholder: "Categoría" },
            { name: "nivel", placeholder: "Nivel" },
            { name: "peso", placeholder: "Peso", type: "number" },
            { name: "estatura", placeholder: "Estatura", type: "number" },
            { name: "escuela", placeholder: "Escuela" },
            { name: "turno", placeholder: "Turno" },
            { name: "instagram", placeholder: "Instagram" },
            { name: "horariocobro", placeholder: "Horario Cobro" },
            { name: "año", placeholder: "Año" },
          ].map((input) => (
            <input
              key={input.name}
              name={input.name}
              type={input.type || "text"}
              placeholder={input.placeholder}
              value={form[input.name]}
              onChange={handleChange}
              disabled={input.disabled}
              className="px-3 py-2 text-gray-200 placeholder-gray-400 bg-gray-800 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          ))}

          {/** Checkboxes */}
          <label className="flex items-center gap-2">
            <input type="checkbox" name="reglasclub" onChange={handleChange} />
            Acepta reglas del club
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" name="usoimagen" onChange={handleChange} />
            Acepta uso de imagen
          </label>

          {/** Formulario tutor si jugador <16 */}
          {form.edad !== null && form.edad < 16 && (
            <div className="p-4 border border-yellow-400 rounded-md col-span-full bg-yellow-100/10">
              <h3 className="mb-2 font-semibold text-yellow-400">Datos del Tutor</h3>
              {["nombre", "apellido", "dni", "email", "telefono"].map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={tutor[field]}
                  onChange={handleTutorChange}
                  className="px-3 py-2 mb-2 text-gray-200 placeholder-gray-400 bg-gray-800 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              ))}
            </div>
          )}

          <button
            disabled={isSubmitting}
            type="submit"
            className="px-4 py-2 mt-2 text-white transition bg-blue-500 rounded col-span-full hover:bg-blue-600"
          >
            {isSubmitting ? "Creando..." : "Crear"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default CreatePlayer;
