import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../Api/Api";

function AsambalProfile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const editableFields = ["nombre", "apellido", "dni", "domicilio", "telefono"];

  useEffect(() => {
  api.get("/asambal/me")
    .then(res => {
      const data = res.data;
      const perfil = data.perfil || {};
      setAdmin({ ...data, perfil });
      setForm({
        nombre: perfil.nombre || "",
        apellido: perfil.apellido || "",
        dni: perfil.dni || "",
        domicilio: perfil.domicilio || "",
        telefono: perfil.telefono || "",
      });
      setLoading(false);
    })
    .catch(() => {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo cargar el perfil" });
      setLoading(false);
    });
}, []);


  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await api.put("/asambal/me", { perfil: form });
      setAdmin(prev => ({ ...prev, perfil: form }));
      setEditing(false);
      Swal.fire({ icon: "success", title: "Perfil actualizado", timer: 1500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudieron guardar los cambios" });
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!admin) return null;

  return (
    <div className="relative min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover">
    <div className="absolute inset-0 bg-black/30" />

    <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 mt-8">
      <div
        className={`p-8 rounded-2xl border-l-4 border-l-blue-500 shadow-xl backdrop-blur bg-black/30`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-200">Perfil ASAMBAL</h2>
            <p className="text-sm text-gray-400">Gestión de administradores · ASAMBAL</p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold
            ${admin?.status === "ACTIVO"
              ? "bg-green-500/20 text-green-300"
              : "bg-red-500/20 text-red-300"}`}
          >
            {admin?.status || "-"}
          </span>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-200">
          {[
            { label: "Nombre", field: "nombre" },
            { label: "Apellido", field: "apellido" },
            { label: "DNI", field: "dni" },
            { label: "Domicilio", field: "domicilio" },
            { label: "Teléfono", field: "telefono" },
            { label: "Email", field: "email" },
            { label: "Creado", field: "createdAt" },
            { label: "Actualizado", field: "updatedAt" },
          ].map(({ label, field }) => {
            let value;
            if (field === "email") value = admin.email || "-";
            else if (field === "createdAt") value = admin.createdAt ? new Date(admin.createdAt).toLocaleString() : "-";
            else if (field === "updatedAt") value = admin.updatedAt ? new Date(admin.updatedAt).toLocaleString() : "-";
            else value = form[field] || "-";

            return (
              <div key={field} className="flex flex-col gap-1">
                <span className="text-xs uppercase text-gray-400">{label}</span>
                {editing && editableFields.includes(field) ? (
                  <input
                    name={field}
                    value={form[field] || ""}
                    onChange={handleChange}
                    placeholder={`Ingrese ${label}`}
                    className="px-3 py-2 rounded-md bg-gray-800/70 border border-white/20 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-sm">{value}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 mt-8">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
              >
                Guardar cambios
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex-1 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold transition-colors"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
            >
              Editar
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}

export default AsambalProfile;
