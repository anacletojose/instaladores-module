import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const GestionInstaladores = () => {
  const [aplicativos, setAplicativos] = useState([]);
  const [form, setForm] = useState({
    aplicativoId: "",
    version: "",
    estado: "",
    observaciones: "",
    archivo: null,
  });
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState("success");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔹 Cargar usuario autenticado y validar rol
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

        if (!res.ok) throw new Error("No autorizado");
        const data = await res.json();
        setUser(data);

        if (data.rol !== "admin") {
          setMensaje("Solo los administradores pueden acceder a esta sección.");
          setTipoMensaje("error");
        } else {
          // Cargar aplicativos si es admin
          const resApps = await fetch(`${import.meta.env.VITE_API_URL}/aplicativos`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const appsData = await resApps.json();
          setAplicativos(appsData);
        }
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  // 🔹 Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "archivo") {
      setForm({ ...form, archivo: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 🔹 Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.archivo) {
      setMensaje("Debe seleccionar un archivo instalador (.exe o .msi).");
      setTipoMensaje("error");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("archivo", form.archivo);
      formData.append("aplicativoId", form.aplicativoId);
      formData.append("version", form.version);
      formData.append("estado", form.estado);
      formData.append("observaciones", form.observaciones);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/instaladores/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al subir instalador");

      setMensaje("Instalador subido correctamente.");
      setTipoMensaje("success");
      setForm({
        aplicativoId: "",
        version: "",
        estado: "",
        observaciones: "",
        archivo: null,
      });
    } catch (error) {
      console.error(error);
      setMensaje(error.message);
      setTipoMensaje("error");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Spinner />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-400 to-teal-500 text-gray-800 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-sky-600 mb-6">
          Gestión de Instaladores
        </h1>

        {mensaje && (
          <div
            className={`text-center mb-4 p-3 rounded-lg ${
              tipoMensaje === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {mensaje}
          </div>
        )}

        {user?.rol === "admin" ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            encType="multipart/form-data"
          >
            <select
              name="aplicativoId"
              value={form.aplicativoId}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 outline-none"
            >
              <option value="">Seleccione un aplicativo</option>
              {aplicativos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="version"
              placeholder="Versión"
              value={form.version}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 outline-none"
            />

            <input
              type="text"
              name="estado"
              placeholder="Estado"
              value={form.estado}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 outline-none"
            />

            <textarea
              name="observaciones"
              placeholder="Observaciones"
              value={form.observaciones}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 outline-none"
            ></textarea>

            <input
              type="file"
              name="archivo"
              accept=".exe,.msi"
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg p-2 cursor-pointer"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-sky-600 hover:bg-sky-700"
              }`}
            >
              {loading ? "Subiendo..." : "Subir Instalador"}
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-600 mt-6">
            No tienes permisos para subir instaladores.
          </p>
        )}

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-semibold transition"
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
};

export default GestionInstaladores;
