import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../Api/Api";
import { formatLabel } from "../../Utils/formatters";

function ClubProfile() {
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const editableFields = [
    "telefono",
    "sede",
    "responsable",
    "canchas",
    "canchasAlternativas",
  ];

  useEffect(() => {
    api.get("/clubs/me")
      .then((res) => {
        setClub(res.data);
        setForm({
          telefono: res.data.telefono || "",
          sede: res.data.sede || "",
          responsable: res.data.responsable || "",
          canchas: res.data.canchas || {},
          canchasAlternativas: res.data.canchasAlternativas || {},
        });
        setLoading(false);
      })
      .catch(() => navigate("/dashboard"));
  }, [navigate]);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCanchasChange = (field, key) => {
    setForm(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        ...key,
      },
    }));
  };

  const validateForm = () => {
    if (!form.responsable?.trim()) return "El responsable es obligatorio";
    if (!form.sede?.trim()) return "La sede es obligatoria";
    if (!form.telefono?.trim()) return "El teléfono es obligatorio";

    if (!/^[0-9+\-\s()]+$/.test(form.telefono)) {
      return "El teléfono tiene caracteres inválidos";
    }

    return null;
  };

  const handleSave = async () => {
    const error = validateForm();
    if (error) {
      Swal.fire({ icon: "error", title: "Error", text: error });
      return;
    }

    const previousClub = club;

    setClub(prev => ({
      ...prev,
      ...form,
      updatedAt: new Date().toISOString(),
    }));

    try {
      await api.put("/clubs/me", form);
      Swal.fire({ icon: "success", title: "Club actualizado", timer: 1500, showConfirmButton: false });
      setEditing(false);
    } catch (err) {
      setClub(previousClub);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudieron guardar los cambios" });
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }) : "-";

  if (loading) return <p>Cargando...</p>;
  if (!club) return null;

  const clubFields = [
    { label: "Nombre", name: "nombre" },
    { label: "Ciudad", name: "ciudad" },
    { label: "Email", name: "email" },
    { label: "Responsable", name: "responsable" },
    { label: "Teléfono", name: "telefono" },
    { label: "Sede", name: "sede" },
    { label: "Cancha principal", name: "canchas" },
    { label: "Canchas alternativas", name: "canchasAlternativas" },
  ];

  return (
    <div className="relative min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="p-8 rounded-2xl shadow-xl backdrop-blur bg-black/30 border-l-4 border-green-500">

          {/* HEADER */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-200">{editing ? "Editar club" : club.nombre}</h2>
              <p className="text-sm text-gray-400">Perfil institucional · ASAMBAL</p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-500/20 text-green-300">{club.status}</span>
          </div>

          {/* BODY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
            {clubFields.map(({ label, name }) => (
              <div key={name} className="flex flex-col gap-1">
                <span className="text-xs uppercase text-gray-400">{label}</span>

                {editing && editableFields.includes(name) ? (
                  name === "canchas" || name === "canchasAlternativas" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" placeholder="Ancho" value={form[name]?.ancho || ""} onChange={e => handleCanchasChange(name, { ancho: e.target.value })} className="px-2 py-1 rounded bg-gray-800/70 border border-white/20 text-gray-100"/>
                      <input type="number" placeholder="Largo" value={form[name]?.largo || ""} onChange={e => handleCanchasChange(name, { largo: e.target.value })} className="px-2 py-1 rounded bg-gray-800/70 border border-white/20 text-gray-100"/>
                      <input placeholder="Piso" value={form[name]?.piso || ""} onChange={e => handleCanchasChange(name, { piso: e.target.value })} className="px-2 py-1 rounded bg-gray-800/70 border border-white/20 text-gray-100"/>
                      <input placeholder="Tablero" value={form[name]?.tablero || ""} onChange={e => handleCanchasChange(name, { tablero: e.target.value })} className="px-2 py-1 rounded bg-gray-800/70 border border-white/20 text-gray-100"/>
                      <label className="flex items-center gap-2 text-sm text-gray-200">
                        <input type="checkbox" checked={form[name]?.techo || false} onChange={e => handleCanchasChange(name, { techo: e.target.checked })}/>
                        Techo
                      </label>
                    </div>
                  ) : (
                    <input name={name} value={form[name] || ""} onChange={handleChange} className="px-3 py-2 rounded-md bg-gray-800/70 border border-white/10 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  )
                ) : (
                  <span className="text-sm">
                    {name === "canchas" || name === "canchasAlternativas"
                      ? club[name]
                        ? `Dimensiones: ${club[name]?.ancho}×${club[name]?.largo}, Piso: ${formatLabel(club[name]?.piso)}, Tablero: ${formatLabel(club[name]?.tablero)}, Techo: ${club[name]?.techo ? "Sí" : "No"}`
                        : "-"
                      : club[name] || "-"}
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
                <button onClick={handleSave} className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold">Guardar cambios</button>
                <button onClick={() => setEditing(false)} className="flex-1 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200">Cancelar</button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold">Editar datos</button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ClubProfile;
