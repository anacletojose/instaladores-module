import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "usuario", // Valor por defecto
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrarse");

      setSuccess("✅ Usuario registrado correctamente. Ahora puede iniciar sesión.");
      setForm({ nombre: "", email: "", password: "", rol: "usuario" });

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-sky-500 to-teal-600">
      <div className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-96 border border-white/30">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Crear cuenta
        </h1>

        {/* ✅ Mensajes de éxito o error */}
        {success && (
          <div className="bg-green-100 text-green-700 border border-green-400 p-3 rounded mb-4 text-center">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-400 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {/* 🔹 Selector de rol visible para todos */}
          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="usuario">Usuario</option>
            <option value="admin">Administrador</option>
          </select>

          <button className="bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition">
            Registrarse
          </button>
        </form>

        <p className="text-sm text-gray-700 mt-4 text-center">
          ¿Ya tienes cuenta?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-teal-600 hover:underline"
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
