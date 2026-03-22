import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import api from "../../Api/Api";

const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg"];

function Certificado() {
  const [certificados, setCertificados] = useState([]);
  const [showUploader, setShowUploader] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificados();
  }, []);

  const fetchCertificados = async () => {
    try {
      const res = await api.get("/certificados/my");
      setCertificados(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Formato no permitido",
        text: "Solo se permiten archivos PDF, JPG o JPEG.",
      });
      return;
    }

    setUploadFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!uploadFile) return;

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      const res = await api.post("/certificados/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Listo", res.data.message, "success");
      setCertificados((prev) => [...prev, res.data.certificado]);
      setUploadFile(null);
      setShowUploader(false);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "No se pudo subir el archivo",
        "error"
      );
    }
  };

  const handleDelete = async (cert) => {
    const confirm = await Swal.fire({
      icon: "question",
      title: "Eliminar certificado",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/certificados/${cert.id}`);
      setCertificados((prev) => prev.filter((c) => c.id !== cert.id));
      Swal.fire("Eliminado", "Certificado eliminado", "success");
    } catch {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  const handleOpenUploader = () => {
    const currentYear = new Date().getFullYear();
    const currentCerts = certificados.filter(cert => cert.year === currentYear);

    if (currentCerts.some(cert => cert.status === "APROBADO")) {
      Swal.fire(
        "No permitido",
        "Ya tienes un certificado aprobado para este año.",
        "info"
      );
      return;
    }

    if (currentCerts.some(cert => cert.status === "PENDIENTE")) {
      Swal.fire(
        "No permitido",
        "Ya tienes un certificado cargado pendiente de aprobación.",
        "info"
      );
      return;
    }

    setShowUploader(true);
  };

  const handleReplace = (cert) => {
    // Solo PENDIENTE permite reemplazar
    if (cert.status !== "PENDIENTE") return;
    setShowUploader(true);
  };

  if (loading) {
    return (
      <p className="mt-10 text-center text-gray-200">
        Cargando certificados...
      </p>
    );
  }

  return (
    <div className="select-none min-h-screen bg-[url('/src/Assets/Asambal/fondodashboard.webp')]">
      <div className="px-4 mx-auto max-w-7xl">

        <div className="px-2 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-200">
            Mis <span className="text-yellow-600">Certificados Médicos</span>
          </h2>

          <button
            onClick={handleOpenUploader}
            className="cursor-pointer flex items-center h-10 gap-2 px-3 py-1 ml-auto text-sm text-green-400 transition-all border rounded-md border-green-500/40 hover:bg-green-500/10 hover:text-green-200 w-fit"
          >
            Cargar certificado
          </button>
        </div>

        {showUploader && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 mb-6 bg-white/90 backdrop-blur rounded-xl shadow-lg"
          >
            <div
              {...getRootProps()}
              className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
              ${isDragActive ? "border-yellow-500 bg-yellow-50" : "border-gray-300"}`}
            >
              <input {...getInputProps()} />
              <p className="text-gray-600">
                {uploadFile
                  ? uploadFile.name
                  : "Arrastrá tu certificado o hacé click para subirlo"}
              </p>
            </div>

            {uploadFile && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleUpload}
                  className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
                >
                  Subir
                </button>

                <button
                  onClick={() => setUploadFile(null)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                >
                  Cancelar
                </button>
              </div>
            )}
          </motion.div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {certificados.map((cert) => (
            <CertCard
              key={cert.id}
              cert={cert}
              onDelete={handleDelete}
              onReplace={handleReplace}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CertCard({ cert, onDelete, onReplace }) {
  const statusConfig = {
    APROBADO: {
      color: "text-green-600",
      icon: CheckCircleIcon,
      label: "Aprobado",
    },
    PENDIENTE: {
      color: "text-yellow-600",
      icon: ExclamationCircleIcon,
      label: "Cargado pendiente de aprobación",
    },
    RECHAZADO: {
      color: "text-red-600",
      icon: XCircleIcon,
      label: "Rechazado, comunicarse con el club",
    },
  };

  const config = statusConfig[cert.status];
  const Icon = config.icon;

  return (
    <div className="p-6 shadow-xl bg-white/90 backdrop-blur rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-600">Certificado</p>
          <p className="text-xl font-semibold text-gray-800">{cert.year}</p>
        </div>
        <div className={`flex items-center gap-1 ${config.color}`}>
          <Icon className="w-5 h-5" />
          <span className="font-semibold text-sm">{config.label}</span>
        </div>
      </div>

      <p className="text-gray-600 text-md font-semibold mb-4">Documento cargado:</p>
      <p className="text-gray-600 text-sm mb-4">{cert.fileName?.split("/").pop()}</p>

      {/* ✅ Solo mostrar botones si el status es PENDIENTE */}
      {cert.status === "PENDIENTE" && (
        <div className="pt-4 justify-center flex gap-10">
          <button
            onClick={() => onReplace(cert)}
            className="cursor-pointer px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
          >
            Reemplazar
          </button>

          <button
            onClick={() => onDelete(cert)}
            className="cursor-pointer px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}

export default Certificado;