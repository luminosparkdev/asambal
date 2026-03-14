import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import api from "../../Api/Api";

const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg"];

function Certificado() {
  const [certificados, setCertificados] = useState([]); // todos los certificados cargados
  const [showUploader, setShowUploader] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  // Traer certificados del jugador al montar
  useEffect(() => {
    const fetchCertificados = async () => {
      try {
        const res = await api.get("/certificados/my"); // endpoint que devuelve todos los certificados del jugador
        setCertificados(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCertificados();
  }, []);

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

      Swal.fire({
        icon: "success",
        title: "Certificado cargado",
        text: res.data.message,
      });

      setUploadFile(null);
      setShowUploader(false);
      setCertificados((prev) => [...prev, res.data.certificado]);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al subir certificado",
        text: err.response?.data?.message || "Ocurrió un error",
      });
    }
  };

  const handleReplace = (cert) => {
    if (cert.status === "APROBADO") {
      Swal.fire("No permitido", "Ya tenés un certificado aprobado cargado.", "info");
      return;
    }
    if (cert.status === "RECHAZADO") {
      Swal.fire("No permitido", "Tu certificado fue rechazado. Contactá al club.", "warning");
      return;
    }
    // status pendiente -> permitir reemplazar
    setUploadFile(null);
    setShowUploader(true);
  };

  const handleDelete = async (cert) => {
    if (cert.status !== "PENDIENTE") {
      Swal.fire("No permitido", "Solo se pueden eliminar certificados pendientes.", "info");
      return;
    }

    const result = await Swal.fire({
      icon: "question",
      title: "Eliminar certificado",
      text: "¿Estás seguro que querés eliminar este certificado?",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/certificados/${cert.id}`);
        Swal.fire("Eliminado", "Certificado eliminado", "success");
        setCertificados((prev) => prev.filter((c) => c.id !== cert.id));
      } catch (err) {
        Swal.fire("Error", "No se pudo eliminar el certificado", "error");
      }
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-200">
      <h1 className="text-3xl font-bold mb-4">Mis Certificados Médicos</h1>

      <button
        onClick={() => setShowUploader(true)}
        className="mb-4 px-4 py-2 bg-green-600 rounded hover:bg-green-500"
      >
        Cargar certificado
      </button>

      {showUploader && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-6 bg-gray-800 rounded shadow"
        >
          <div
            {...getRootProps()}
            className={`p-6 border-2 border-dashed rounded cursor-pointer ${
              isDragActive ? "border-yellow-400" : "border-gray-600"
            }`}
          >
            <input {...getInputProps()} />
            <p>{uploadFile ? uploadFile.name : "Arrastrá un archivo o hacé click"}</p>
          </div>

          {uploadFile && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
              >
                Subir certificado
              </button>
              <button
                onClick={() => setUploadFile(null)}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
              >
                Cancelar
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Tabla de certificados */}
      <table className="w-full text-left border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-4 py-2 border-b border-gray-700">Año</th>
            <th className="px-4 py-2 border-b border-gray-700">Archivo</th>
            <th className="px-4 py-2 border-b border-gray-700">Estado</th>
            <th className="px-4 py-2 border-b border-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {certificados.map((cert) => (
            <tr key={cert.id} className="hover:bg-gray-700">
              <td className="px-4 py-2">{cert.year}</td>
              <td className="px-4 py-2">{cert.fileName}</td>
              <td className="px-4 py-2">
                {cert.status === "APROBADO" && (
                  <span className="text-green-400">{cert.status}</span>
                )}
                {cert.status === "PENDIENTE" && (
                  <span className="text-yellow-400">{cert.status}</span>
                )}
                {cert.status === "RECHAZADO" && (
                  <span className="text-red-400">{cert.status}</span>
                )}
              </td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => handleReplace(cert)}
                  className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-500"
                >
                  Reemplazar
                </button>
                <button
                  onClick={() => handleDelete(cert)}
                  className="px-2 py-1 bg-red-600 rounded hover:bg-red-500"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Certificado;