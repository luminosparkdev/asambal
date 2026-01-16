import { useState, useEffect } from "react";
import api from "../../Api/Api";

function ProfesorProfileForm({ userId }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [enea, setEnea] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/coaches/me");
        setNombre(res.data.nombre);
        setApellido(res.data.apellido);
        setEmail(res.data.email);
        setCategoria(res.data.categoria);
        console.log(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  const submitProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    await api.post(`/coaches/complete-profile`, {
      telefono,
      domicilio,
      enea,
    });

    setSuccess(true);
    setLoading(false);

    if (success) {
      return <p>Perfil enviado. Pendiente de validación por ASAMBAL.</p>;
    }
  };

  return (
    <form onSubmit={submitProfile}>
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
          <input value={categoria} disabled className="input-glass opacity-70" />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold tracking-wide text-gray-200 uppercase">
          Información de contacto
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <input
            value={ telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Telefono"
            required
            className="input-glass border border-gray-500 rounded-md px-2 py-1"
          />  

          <input
            value={domicilio}
            onChange={(e) => setDomicilio(e.target.value)}
            placeholder="Domicilio"
            required
            className="input-glass border border-gray-500 rounded-md px-2 py-1"
          />

          <input
            value={enea}
            onChange={(e) => setEnea(e.target.value)}
            placeholder="ENEA"
            required
            className="input-glass border border-gray-500 rounded-md px-2 py-1"
          />  
        </div>

        <button disabled={loading} className="w-full py-3 text-sm font-semibold text-white rounded-md border border-green-500 bg-green-700 hover:bg-green-600/90 hover:cursor-pointer disabled:opacity-50 transition">
          {loading ? "Enviando..." : "Enviar"}
        </button> 

      <h2>Perfil enviado. Pendiente de validación por el administrador.</h2>
      </section>
    </form>
  );
}

export default ProfesorProfileForm;

