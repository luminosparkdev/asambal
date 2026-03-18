import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  XCircleIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/solid";
import api from "../../Api/Api";

function PendingCertificados() {
  const [certificados, setCertificados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificados();
  }, []);

  const fetchCertificados = async () => {
    setLoading(true);
    try {
      const res = await api.get("/certificados/pending");
      setCertificados(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const aprobar = async (cert) => {
    const confirm = await Swal.fire({
      title: "¿Aprobar certificado?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Aprobar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;

    try {
      await api.patch(`/certificados/${cert.id}/approve`);
      Swal.fire("Aprobado", "El certificado fue aprobado", "success");
      setCertificados((prev) => prev.filter((c) => c.id !== cert.id));
    } catch {
      Swal.fire("Error", "No se pudo aprobar", "error");
    }
  };

  const rechazar = async (cert) => {
    const { value: reason } = await Swal.fire({
      title: "Motivo del rechazo",
      input: "text",
      inputPlaceholder: "Ej: ilegible, incompleto...",
      showCancelButton: true,
      confirmButtonText: "Rechazar",
    });
    if (!reason) return;

    try {
      await api.patch(`/certificados/${cert.id}/reject`, { reason });
      Swal.fire("Rechazado", "El certificado fue rechazado", "success");
      setCertificados((prev) => prev.filter((c) => c.id !== cert.id));
    } catch {
      Swal.fire("Error", "No se pudo rechazar", "error");
    }
  };

  const openCertificado = async (cert) => {
    try {
      const res = await api.get(`/certificados/${cert.id}/file`);
      window.open(res.data.url, "_blank");
    } catch {
      Swal.fire("Error", "No se pudo abrir el certificado", "error");
    }
  };

  return (
    <div className="relative min-h-screen bg-[url('/src/Assets/Asambal/fondodashboard.webp')] bg-cover bg-center">
      
      {/* Overlay corregido */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-0" />

      <div className="relative z-10 px-4 mx-auto max-w-7xl">
        <div className="px-2 py-6">
          <h2 className="text-2xl font-semibold text-gray-200">
            Certificados <span className="text-yellow-600">Pendientes</span>
          </h2>
        </div>

        {loading ? (
          <p className="mt-10 text-center text-gray-200">
            Cargando certificados pendientes...
          </p>
        ) : certificados.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100/10 rounded-xl gap-4">
            <div className="text-6xl">✅</div>
            <p className="text-xl font-semibold text-center text-gray-200">
              No hay certificados pendientes
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {certificados.map((cert) => (
              <CertCardProfesor
                key={cert.id}
                cert={cert}
                aprobar={aprobar}
                rechazar={rechazar}
                openCertificado={openCertificado}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CertCardProfesor({ cert, aprobar, rechazar, openCertificado }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 shadow-xl bg-white/90 backdrop-blur rounded-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600">Certificado</p>
          <p className="text-xl font-semibold text-gray-800">{cert.year}</p>
        </div>
        <span className="text-sm font-semibold text-yellow-600">Pendiente</span>
      </div>

      <p className="mb-2 font-semibold text-gray-600 text-md">
        Documento cargado:
      </p>
      <p className="mb-4 text-sm text-gray-600">
        {cert.fileName?.split("/").pop()}
      </p>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => openCertificado(cert)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700"
        >
          <DocumentArrowDownIcon className="w-5 h-5" />
          Ver / Descargar
        </button>
      </div>

      <div className="flex justify-center gap-6">
        <button
          onClick={() => aprobar(cert)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-green-700 rounded-lg hover:bg-green-600"
        >
          <CheckCircleIcon className="w-5 h-5" />
          Aprobar
        </button>

        <button
          onClick={() => rechazar(cert)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-red-700 rounded-lg hover:bg-red-600"
        >
          <XCircleIcon className="w-5 h-5" />
          Rechazar
        </button>
      </div>
    </motion.div>
  );
}

export default PendingCertificados;