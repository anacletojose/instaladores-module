import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {navigate("/dashboard")};
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
      <div className="bg-white/10 p-10 rounded-2xl shadow-2xl backdrop-blur-md text-center">
        <h1 className="text-4xl font-extrabold mb-6">Bienvenido a Instaladores</h1>
        <p className="text-lg mb-8 opacity-90">Gestione sus aplicativos e instaladores fácilmente</p>
        <div className="flex gap-6 justify-center">
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-blue-600 font-semibold px-6 py-2 rounded-xl shadow hover:bg-gray-100 transition"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-green-500 text-white font-semibold px-6 py-2 rounded-xl shadow hover:bg-green-600 transition"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
