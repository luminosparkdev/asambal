import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { CheckCircleIcon, ExclamationCircleIcon, UploadIcon } from "@heroicons/react/solid"; // Usa íconos que tengas o reemplaza

const currentYear = new Date().getFullYear();
const cutoffDate = new Date(`${currentYear}-12-31`);

function Certificado() {
    const navigate = useNavigate();

    // MOCK ESTADOS (en futuro traer de backend)
    const [certificado, setCertificado] = useState(null);
    const [estado, setEstado] = useState(null); // null | "pendiente" | "aprobado"

    // Función mock para subir archivo
    const onDrop = useCallback((acceptedFiles) => {
        // Simulamos cargar archivo y pasar a estado pendiente
        setCertificado(acceptedFiles[0]);
        setEstado("pendiente");
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    // Determinar estado visual
    const fechaCertificado = certificado?.lastModifiedDate || certificado?.lastModified || null;
    const isVencido = certificado && new Date(fechaCertificado) < cutoffDate ? false : true;

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/20" />

            <motion.div
                className="relative z-10 max-w-md p-8 text-center rounded-2xl shadow-2xl bg-gray-900/70 backdrop-blur-md border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="mb-6 text-3xl font-bold text-gray-100">
                    Alta Médica
                </h1>

                {!certificado && (
                    <>
                        <p className="mb-6 text-gray-300">
                            No tenés alta médica cargada.
                        </p>

                        <div
                            {...getRootProps()}
                            className={`mb-6 px-6 py-10 border-2 border-dashed rounded-lg cursor-pointer
                ${isDragActive ? "border-yellow-400 bg-yellow-100/20" : "border-gray-600"}`}
                        >
                            <input {...getInputProps()} />
                            <p className="text-gray-400">
                                Arrastrá tu certificado o hacé click para seleccionar archivo
                            </p>
                        </div>
                    </>
                )}

                {certificado && estado === "pendiente" && (
                    <>
                        <motion.div
                            className="mb-4 flex items-center justify-center gap-2 text-yellow-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <ExclamationCircleIcon className="w-8 h-8" />
                            <p className="font-semibold">Pendiente de aprobación</p>
                        </motion.div>

                        <button
                            {...getRootProps()}
                            className="mb-6 px-6 py-3 font-semibold text-gray-900 bg-yellow-400 rounded-lg shadow-lg hover:bg-yellow-300 transition transform hover:scale-105"
                        >
                            <input {...getInputProps()} />
                            Cargar otro certificado +
                        </button>
                    </>
                )}

                {certificado && estado === "aprobado" && (
                    <motion.div
                        className="mb-6 flex items-center justify-center gap-3 text-green-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <CheckCircleIcon className="w-8 h-8" />
                        <p className="font-semibold">Alta médica cargada</p>
                    </motion.div>
                )}

                {certificado && estado === null && (
                    <>
                        {new Date(certificado.lastModified || certificado.lastModifiedDate) > cutoffDate ? (
                            <>
                                <p className="mb-6 text-red-400 font-semibold">
                                    Tu certificado está vencido.
                                </p>

                                <button
                                    {...getRootProps()}
                                    className="mb-6 px-6 py-3 font-semibold text-gray-900 bg-yellow-400 rounded-lg shadow-lg hover:bg-yellow-300 transition transform hover:scale-105"
                                >
                                    <input {...getInputProps()} />
                                    Cargar nuevo certificado +
                                </button>
                            </>
                        ) : (
                            <p className="mb-6 text-gray-300">Certificado cargado.</p>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
}

export default Certificado;