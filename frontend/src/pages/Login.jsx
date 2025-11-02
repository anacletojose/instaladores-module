import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../utils/auth";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");
      setToken(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-500 to-blue-700">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Iniciar sesión</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            Entrar
          </button>
        </form>
        {error && <p className="text-red-600 text-center mt-3">{error}</p>}
        <p className="text-sm text-gray-600 mt-4 text-center">
          ¿No tienes cuenta?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
