import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import Swal from "sweetalert2";

function CoachDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [coach, setCoach] = useState(null);
  const [categorias, setCategorias] = useState([]); // categorías activadas del profe
  const [initialCategorias, setInitialCategorias] = useState([]);
  const [allCategorias, setAllCategorias] = useState([]); // todas las categorías disponibles
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoachAndCategories = async () => {
      try {
        // Traigo profe
        const res = await api.get(`/coaches/${id}`);
        const data = res.data;
        setCoach(data);

        const cats = data.categorias || [];
        setCategorias(cats);
        setInitialCategorias(cats);

        // Traigo todas las categorias de la colección
        const catRes = await api.get("/categories");
        setAllCategorias(catRes.data);

        setLoading(false);
      } catch (err) {
        navigate("/coaches");
      }
    };

    fetchCoachAndCategories();
  }, [id, navigate]);

  const toggleCategoria = (nombre) => {
    setCategorias((prev) =>
      prev.includes(nombre)
        ? prev.filter((c) => c !== nombre)
        : [...prev, nombre]
    );
  };

  const handleSave = async () => {
    const normalizedCurrent = categorias.map((c) => c.trim()).filter(Boolean);
    const normalizedInitial = initialCategorias.map((c) => c.trim()).filter(Boolean);

    const hasChanges =
      normalizedCurrent.length !== normalizedInitial.length ||
      normalizedCurrent.some((c, i) => c !== normalizedInitial[i]);

    if (!hasChanges) {
      return Swal.fire("Sin cambios", "No se modificaron las categorías", "info");
    }

    try {
      await api.put(`/coaches/${id}`, { categorias: normalizedCurrent });
      setCategorias(normalizedCurrent);
      setInitialCategorias(normalizedCurrent);
      setEditing(false);
      Swal.fire({
        icon: "success",
        title: "Categorías actualizadas",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "No se pudieron guardar los cambios",
        "error"
      );
    }
  };

  const handleToggle = async () => {
    const isActive = coach.status === "ACTIVO";
    const action = isActive ? "desactivar" : "activar";
    const previousStatus = coach.status;
    const optimisticStatus = isActive ? "INACTIVO" : "ACTIVO";

    const result = await Swal.fire({
      title: `¿Seguro que quieres ${action} este profesor?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    setCoach((prev) => ({ ...prev, status: optimisticStatus }));

    try {
      await api.patch(`/coaches/${id}/toggle`);
      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      setCoach((prev) => ({ ...prev, status: previousStatus }));
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo cambiar el estado" });
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!coach) return null;

  return (
    <div className="relative min-h-screen bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div
          className={`p-8 rounded-2xl border-l-4 shadow-xl backdrop-blur bg-black/30 ${
            coach.status === "ACTIVO" ? "border-green-500" : "border-red-500"
          }`}
        >
          {/* HEADER */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-200">
                {editing ? "Editar profesor" : `${coach.nombre} ${coach.apellido}`}
              </h2>
              <p className="text-sm text-gray-400">Gestión de profesores · ASAMBAL</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                coach.status === "ACTIVO" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
              }`}
            >
              {coach.status}
            </span>
          </div>

          {/* BODY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
            {[
              { label: "Nombre", value: coach.nombre },
              { label: "Apellido", value: coach.apellido },
              { label: "DNI", value: coach.dni },
              { label: "Email", value: coach.email },
              { label: "Teléfono", value: coach.telefono },
              { label: "Domicilio", value: coach.domicilio },
              { label: "ENEA", value: coach.enea },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-xs uppercase text-gray-400">{label}</span>
                <span className="text-sm">{value || "-"}</span>
              </div>
            ))}

            {/* CATEGORÍAS */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <span className="text-xs uppercase text-gray-400">Categorías en este club</span>
              {editing ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {allCategorias.map((cat) => {
                    const nombreCompleto = `${cat.nombre} ${cat.genero}`;
                    const isActive = categorias.includes(nombreCompleto);

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategoria(nombreCompleto)}
                        className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-green-700 text-white border-green-500"
                            : "bg-gray-800/50 text-gray-200 border-gray-600"
                        }`}
                      >
                        {nombreCompleto}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <span className="text-sm">{categorias.length ? categorias.join(", ") : "-"}</span>
              )}
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-400 space-y-1">
            <p>Creado: {coach.createdAt || "-"}</p>
            <p>Última actualización: {coach.updatedAt || "-"}</p>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 mt-8">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Guardar categorías
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
                  Editar categorías
                </button>
                <button
                  onClick={handleToggle}
                  className={`flex-1 py-3 rounded-lg text-white font-semibold ${
                    coach.status === "ACTIVO" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {coach.status === "ACTIVO" ? "Desactivar" : "Activar"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoachDetails;
