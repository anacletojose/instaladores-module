import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // 🔹 Cargar usuario autenticado
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error al obtener usuario:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) return <Spinner />;

  const handleGestion = () => {
    if (user.rol !== "admin") {
      setErrorMsg("❌ No tienes permisos para acceder a la pantalla de gestión.");
      setTimeout(() => setErrorMsg(""), 3500);
      return;
    }
    navigate("/gestion");
  };

  const handleConsulta = () => navigate("/consulta");
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-purple-400 to-pink-300 text-gray-800 px-4">
      <div className="backdrop-blur-md bg-white/60 shadow-2xl rounded-3xl p-8 w-full sm:w-[420px] text-center border border-white/30">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-4 drop-shadow">
          Bienvenido, {user?.nombre || "Usuario"}
        </h1>
        <p className="text-gray-700 mb-6 text-sm">
          Selecciona la opción a la que deseas acceder
        </p>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 border border-red-400 px-3 py-2 rounded-lg mb-4 text-sm animate-pulse">
            {errorMsg}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleConsulta}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition"
          >
            Ir a Consulta
          </button>

          <button
            onClick={handleGestion}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition"
          >
            Ir a Gestión
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition mt-4"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
