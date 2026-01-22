import { useState, useEffect } from "react";
import api from "../../Api/Api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ProfesorProfileForm({userId, activationToken}) {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [categorias, setCategorias] = useState("");
  const [dni, setDni] = useState("");

  const [telefono, setTelefono] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [enea, setEnea] = useState("");

  const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchPrefill = async () => {
    try {
      const res = await api.get(`/coaches/prefill/${activationToken}`);

      setNombre(res.data.nombre || "");
      setApellido(res.data.apellido || "");
      setEmail(res.data.email || "");

      if (res.data.categorias?.length) {
        setCategorias(res.data.categorias.join(", "));
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la información inicial del perfil",
      });
    }
  };

  if (activationToken) {
    fetchPrefill();
  }
}, [activationToken]);

  const submitProfile = async (e) => {
    e.preventDefault();
    if (loading) return;

    const payload = {
      activationToken,
      telefono: telefono.trim(),
      domicilio: domicilio.trim(),
      enea: Number(enea),
      dni: dni.trim(),
    };

    // Validación defensiva en front
    if (!payload.telefono || !payload.domicilio || Number.isNaN(payload.enea) || !payload.dni) {
      Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Completá todos los campos antes de enviar",
        background: "#0f172a",
        color: "#e5e7eb",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    setLoading(true);

    try {
      await api.post(`/coaches/${userId}/complete-profile`, payload);

      Swal.fire({
        icon: "success",
        title: "Perfil enviado",
        text: "El perfil fue enviado correctamente. Queda pendiente de validación por ASAMBAL.",
        confirmButtonText: "Aceptar",
        background: "#0f172a",
        color: "#e5e7eb",
        confirmButtonColor: "#16a34a",
      });
      navigate("/");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.message ||
          "No se pudo enviar el perfil. Intente nuevamente.",
        background: "#0f172a",
        color: "#e5e7eb",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitProfile} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white">Completar perfil</h2>
        <p className="mt-1 text-sm text-gray-300">
          Estos datos serán validados por ASAMBAL
        </p>
      </div>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold tracking-wide text-gray-200 uppercase">
          Datos personales
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <input value={nombre} disabled className="input-glass opacity-70" />
          <input value={apellido} disabled className="input-glass opacity-70" />
          <input value={email} disabled className="input-glass opacity-70" />
          <input value={categorias} disabled className="input-glass opacity-70" />
          <input value={dni} onChange={(e) => setDni(e.target.value)} placeholder="DNI" className="input-glass opacity-70" />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold tracking-wide text-gray-200 uppercase">
          Información de contacto
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Teléfono"
            className="input-glass"
          />

          <input
            value={domicilio}
            onChange={(e) => setDomicilio(e.target.value)}
            placeholder="Domicilio"
            className="input-glass"
          />

          <input
            type="number"
            value={enea}
            onChange={(e) => setEnea(e.target.value)}
            placeholder="ENEA"
            className="input-glass"
          />
        </div>

        <button
          disabled={loading}
          className="w-full py-3 text-sm font-semibold text-white rounded-md border border-green-500 bg-green-700 hover:bg-green-600/90 disabled:opacity-50 transition"
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </section>
    </form>
  );
}

export default ProfesorProfileForm;
