import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import imgUnderConstruction from "../Assets/enConstruccion.png";

function UnderConstruction() {
    const navigate = useNavigate();

    return (
        <div className="select-none relative flex items-center justify-center min-h-screen p-6 bg-[url('/src/Assets/Asambal/fondodashboard.webp')] bg-cover bg-center">

            {/* overlay */}
            <div className="absolute inset-0 bg-black/20" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 flex flex-col items-center max-w-lg p-10 text-center border shadow-2xl bg-gray-900/70 backdrop-blur-md rounded-2xl border-gray-700"
            >
                <motion.img
                    src={imgUnderConstruction}
                    alt="En construcción"
                    className="w-140 mb-6"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4 }}
                />

                <h1 className="mb-2 text-3xl font-bold text-gray-100">
                    El equipo está trabajando
                </h1>

                <p className="mb-6 text-gray-300 max-w-xs">
                    Esta sección está en desarrollo. <br />¡Gracias por tu paciencia!
                </p>

                <button
                    onClick={() => navigate(-1)}
                    className="cursor-pointer px-6 py-3 font-semibold text-gray-900 bg-yellow-400 rounded-lg shadow-lg hover:bg-yellow-300 transition transform hover:scale-105"
                >
                    Volver
                </button>
            </motion.div>
        </div>
    );
}

export default UnderConstruction;