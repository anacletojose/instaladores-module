import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-white">
      <h1 className="text-4xl font-bold mb-8">Bienvenido a InstalApp 💻</h1>

      <div className="flex gap-6">
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl shadow hover:bg-blue-100 transition"
        >
          Iniciar sesión
        </button>

        <button
          onClick={() => navigate("/register")}
          className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-xl hover:bg-white hover:text-blue-700 transition"
        >
          Registrarse
        </button>
      </div>
    </div>
  );
}
