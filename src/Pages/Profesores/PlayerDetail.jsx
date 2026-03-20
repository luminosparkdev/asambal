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

  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

  const clubId = localStorage.getItem("activeClubId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playerRes, catRes] = await Promise.all([
          api.get(`/players/${id}`),
          api.get("/categories"),
        ]);

        const data = playerRes.data;

        const activeClub = data.clubs?.find(c => c.clubId === clubId) || data.clubs?.[0];

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

          // 🔥 NUEVO MODELO
          categoriaPrincipal: activeClub?.categoriaPrincipal || "",
          categoriasSecundarias: activeClub?.categoriasSecundarias || [],
        };

        setPlayer(normalized);
        setForm(normalized);
        setCategoriasDisponibles(catRes.data);
        setLoading(false);
      } catch (err) {
        navigate("/players");
      }
    };

    fetchData();
  }, [id, navigate, clubId]);

  const formatBoolean = (value) => {
    if (value === true) return "Sí";
    if (value === false) return "No";
    return "-";
  };

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 🔥 NUEVO
  const toggleCategoria = (catId) => {
    if (catId === form.categoriaPrincipal) return;

    setForm(prev => ({
      ...prev,
      categoriasSecundarias: prev.categoriasSecundarias.includes(catId)
        ? prev.categoriasSecundarias.filter(c => c !== catId)
        : [...prev.categoriasSecundarias, catId],
    }));
  };

  const handleCategoriaPrincipal = (catId) => {
    setForm(prev => ({
      ...prev,
      categoriaPrincipal: catId,
      categoriasSecundarias: prev.categoriasSecundarias.filter(c => c !== catId),
    }));
  };

  const handleSave = async () => {
    const previousPlayer = player;

    setPlayer(prev => ({ ...prev, ...form }));

    try {
      await api.put(`/players/${id}`, {
        ...form,
        categoriaPrincipal: form.categoriaPrincipal,
        categorias: [form.categoriaPrincipal, ...form.categoriasSecundarias],
        clubId: localStorage.getItem("activeClubId"), // 🔥 CLAVE
      });

      Swal.fire({
        icon: "success",
        title: "Jugador actualizado",
        timer: 1500,
      });

      navigate("/players");
      setEditing(false);
    } catch (err) {
      setPlayer(previousPlayer);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar",
      });
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!player) return null;

  return (
    <div className="relative min-h-screen bg-[url('/src/Assets/Asambal/fondodashboard.webp')] bg-cover">
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 max-w-4xl px-4 py-8 mx-auto">
        <div className="p-8 border-l-4 shadow-xl backdrop-blur bg-black/30 border-green-500 rounded-2xl">

          <h2 className="mb-6 text-2xl font-bold text-gray-200">
            {editing ? "Editar jugador" : `${player.nombre} ${player.apellido}`}
          </h2>

          {/* CAMPOS ORIGINALES (NO TOCADOS) */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 text-gray-200">
            {["nombre","apellido","dni","telefono","email"].map(name => (
              <input
                key={name}
                name={name}
                value={form[name] || ""}
                disabled={!editing}
                onChange={handleChange}
                className="px-3 py-2 bg-gray-800 rounded"
              />
            ))}
          </div>

          {/* 🔥 CATEGORIA PRINCIPAL */}
          <div className="mt-6">
            <h3 className="text-gray-300 mb-2">Categoría Principal ⭐</h3>

            <div className="flex flex-wrap gap-2">
              {categoriasDisponibles.map(cat => {
                const active = form.categoriaPrincipal === cat.id;

                return (
                  <button
                    key={cat.id}
                    disabled={!editing}
                    onClick={() => handleCategoriaPrincipal(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs
                      ${active ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"}
                    `}
                  >
                    {cat.nombre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 🔥 CATEGORIAS SECUNDARIAS */}
          <div className="mt-6">
            <h3 className="text-gray-300 mb-2">Categorías Secundarias</h3>

            <div className="flex flex-wrap gap-2">
              {categoriasDisponibles.map(cat => {
                const active = form.categoriasSecundarias.includes(cat.id);
                const disabled = cat.id === form.categoriaPrincipal;

                return (
                  <button
                    key={cat.id}
                    disabled={!editing || disabled}
                    onClick={() => toggleCategoria(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs
                      ${disabled
                        ? "bg-gray-600 text-gray-400"
                        : active
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300"}
                    `}
                  >
                    {cat.nombre}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            {editing ? (
              <>
                <button onClick={handleSave} className="flex-1 bg-blue-600 py-2 rounded">
                  Guardar
                </button>
                <button onClick={() => setEditing(false)} className="flex-1 bg-gray-600 py-2 rounded">
                  Cancelar
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="w-full bg-blue-600 py-2 rounded">
                Editar
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default PlayerDetails;