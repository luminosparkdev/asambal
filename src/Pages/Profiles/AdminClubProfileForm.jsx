import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import api from "../../Api/Api";

function AdminClubProfileForm({ userId, clubId, activationToken }) {
  const [nombre, setNombre] = useState("");
  const [responsable, setResponsable] = useState("");
  const [sede, setSede] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [canchasAlternativas, setCanchasAlternativas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const PISOS = [
  "cemento_crudo",
  "cemento_pintado",
  "parquet",
  "caucho",
  "baldosa_cruda",
  "baldosa_pintada",
];

  const [canchas, setCanchas] = useState({
    ancho: "",
    largo: "",
    piso: "",
    tablero: "",
    techo: false,
  });

  const navigate = useNavigate();

  const getClubData = async () => {
  const res = await api.get(`/clubs/${clubId}`);

  setNombre(res.data.nombre);
  setCiudad(res.data.ciudad);
};

useEffect(() => {
  getClubData();
}, [clubId]);

  const submitProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    await api.post(`/clubs/${clubId}/complete-profile`, {
      activationToken,
      responsable,
      sede,
      telefono,
      canchas,
      canchasAlternativas,
    });

    console.log("ENVIANDO:", { canchas, canchasAlternativas });
    setLoading(false);
    setSuccess(true);
    
    await Swal.fire({
      icon: "success",
      title: "Datos enviados correctamente",
      text: "El perfil del club quedó pendiente de validación por ASAMBAL.",
      confirmButtonText: "ir al inicio",
    });

    navigate("/");
  };

  return (
    <form onSubmit={submitProfile} className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white">
          Completar perfil del club
        </h2>
        <p className="mt-1 text-sm text-gray-300">
          Estos datos serán validados por ASAMBAL
        </p>
      </div>

      {/*DATOS DEL CLUB*/}

      <section className="space-y-4">
        <h3 className="text-sm font-semibold tracking-wide text-gray-200 uppercase">
          Datos generales
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <input
            value={nombre}
            disabled
            className="input-glass opacity-70"
          />

          <input
            value={ciudad}
            disabled
            className="input-glass opacity-70"
          />

          <input
            value={responsable}
            onChange={(e) => setResponsable(e.target.value)}
            placeholder="Responsable"
            required
            className="px-2 py-1 border border-gray-500 rounded-md input-glass"
          />

          <input
            value={sede}
            onChange={(e) => setSede(e.target.value)}
            placeholder="Sede"
            required
            className="px-2 py-1 border border-gray-500 rounded-md input-glass"
          />

          <input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Telefono"
            required
            className="px-2 py-1 border border-gray-500 rounded-md input-glass"
          />
        </div>
      </section>

      {/*CANCHA PRINCIPAL*/}

      <section className="space-y-4">
        <h3 className="text-sm font-semibold tracking-wide text-gray-200 uppercase">
          Cancha principal
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <input type="number" placeholder="Ancho (m)"
            onChange={(e) => setCanchas({ ...canchas, ancho: e.target.value })}
            className="px-2 py-1 border border-gray-500 rounded-md input-glass" />

          <input type="number" placeholder="Largo (m)"
            onChange={(e) => setCanchas({ ...canchas, largo: e.target.value })}
            className="px-2 py-1 border border-gray-500 rounded-md input-glass" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <select
            value={canchas.piso}
            onChange={(e) => setCanchas({ ...canchas, piso: e.target.value })}
            className="px-2 py-1 text-gray-200 border border-gray-500 rounded-md bg-slate-900"
          >
            <option value="">Seleccionar piso</option>
            <option value="cemento_crudo">Cemento crudo</option>
            <option value="cemento_pintado">Cemento pintado</option>
            <option value="parquet">Parquet</option>
            <option value="caucho">Caucho</option>
            <option value="baldosa_cruda">Baldosa cruda</option>
            <option value="baldosa_pintada">Baldosa pintada</option>
          </select>

          <select
            value={canchas.tablero}
            onChange={(e) => setCanchas({ ...canchas, tablero: e.target.value })}
            className="px-2 py-1 text-gray-200 border border-gray-500 rounded-md bg-slate-900"
          >
            <option value="">Seleccionar tablero</option>
            <option value="manual">Manual</option>
            <option value="electronico">Electrónico</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-gray-200 text-md">
          <input
            type="checkbox"
            checked={canchas.techo}
            onChange={(e) =>
              setCanchas({ ...canchas, techo: e.target.checked })
            }
          />
          Cancha techada
        </label>
      </section>

      {/*CANCHAS ALTERNATIVAS*/}
      <section className="space-y-4">
      <button
        type="button"
        onClick={() => {
          if (canchasAlternativas.length < 2) {
            setCanchasAlternativas([
              ...canchasAlternativas,
              { ancho: "", largo: "", piso: "", tablero: "", techo: false }
            ]);
            }
        }}
        className="w-full py-2 text-sm font-medium text-gray-200 transition border rounded-md border-white/30 hover:bg-white/10 hover:cursor-pointer"
      >
        + Agregar cancha alternativa
      </button>

      
      {canchasAlternativas.map((canchaAlt, index) => (
        <div key={index}
          className="p-4 space-y-3 border rounded-lg border-white/20">
          <h4 className="text-sm font-semibold text-gray-200">
              Cancha alternativa {index + 1}
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Ancho"
              className="px-2 py-1 border border-gray-500 rounded-md input-glass"
              value={canchaAlt.ancho}
              onChange={(e) =>
                setCanchasAlternativas(prev =>
                prev.map((c, i) =>
                  i === index ? { ...c, ancho: e.target.value } : c
                )
              )
            }
            />

            <input type="number" placeholder="Largo"
              className="px-2 py-1 border border-gray-500 rounded-md input-glass"
              value={canchaAlt.largo}
              onChange={(e) =>
                setCanchasAlternativas(prev =>
                  prev.map((c, i) =>
                  i === index ? { ...c, largo: e.target.value } : c
                )
              )
            }
            />
            </div>
            <div className="grid grid-cols-2 gap-4">
            <select
              className="px-1 py-1 text-gray-200 border border-gray-500 rounded-md bg-slate-900"
              value={canchaAlt.piso}
              onChange={(e) =>
                setCanchasAlternativas(prev =>
                  prev.map((c, i) =>
                    i === index ? { ...c, piso: e.target.value } : c
                  )
                )
              }
            >
              <option value="">Seleccionar piso</option>
              <option value="cemento_crudo">Cemento crudo</option>
              <option value="cemento_pintado">Cemento pintado</option>
              <option value="parquet">Parquet</option>
              <option value="caucho">Caucho</option>
              <option value="baldosa_cruda">Baldosa cruda</option>
              <option value="baldosa_pintada">Baldosa pintada</option>
            </select>

            <select
              className="px-1 py-1 text-gray-200 border border-gray-500 rounded-md bg-slate-900"
              value={canchaAlt.tablero}
              onChange={(e) =>
                setCanchasAlternativas(prev =>
                  prev.map((c, i) =>
                    i === index ? { ...c, tablero: e.target.value } : c
                  )
                )
              }
            >
              <option value="">Seleccionar tablero</option>
              <option value="manual">Manual</option>
              <option value="electronico">Electrónico</option>
            </select>
            </div>

            <label className="flex items-center gap-2 text-gray-200 text-md">
              <input
                type="checkbox"
                checked={canchaAlt.techo}
                onChange={(e) =>
                  setCanchasAlternativas(prev =>
                    prev.map((c, i) =>
                      i === index ? { ...c, techo: e.target.checked } : c
                    )
                  )
                }
              />
              Cancha techada
            </label>
          </div>
        ))}
        
        </section>
        {/*SUBMIT BUTTON*/}
        <button disabled={loading} className="w-full py-3 text-sm font-semibold text-white transition bg-green-700 border border-green-500 rounded-md hover:bg-green-600/90 hover:cursor-pointer disabled:opacity-50">
          {loading ? "Enviando..." : "Enviar"}
        </button>
    </form>
  );
}

export default AdminClubProfileForm;

