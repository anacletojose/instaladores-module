import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Gestion() {
  const [aplicativos, setAplicativos] = useState([]);
  const [form, setForm] = useState({ nombre: "", descripcion: "", observaciones: "" });
  const [editando, setEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(null); // ✅ Control del modal de confirmación
  const navigate = useNavigate();

  // 🔹 Mostrar notificación temporal
  const mostrarMensaje = (texto, tipo = "success") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
  };

  // 🔹 Cargar aplicativos
  useEffect(() => {
    const fetchAplicativos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/aplicativos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener los aplicativos");
        const data = await res.json();
        setAplicativos(data);
      } catch (error) {
        console.error(error);
        mostrarMensaje("Error al obtener los aplicativos", "error");
      }
    };
    fetchAplicativos();
  }, []);

  // 🔹 Cambios en formulario
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // 🔹 Crear aplicativo
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/aplicativos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error al crear el aplicativo");

      const nuevo = await res.json();
      const resLista = await fetch(`${import.meta.env.VITE_API_URL}/aplicativos`, {
            headers: { Authorization: `Bearer ${token}` },
      });
      const dataActualizada = await resLista.json();
      setAplicativos(dataActualizada);
      setForm({ nombre: "", descripcion: "", observaciones: "" });
      mostrarMensaje("Aplicativo creado correctamente", "success");

    } catch (error) {
      console.error(error);
      mostrarMensaje("Error al crear el aplicativo", "error");
    }
  };

  // 🔹 Modal de confirmación de eliminación
  const abrirConfirmacion = (appId) => setConfirmarEliminacion(appId);
  const cerrarConfirmacion = () => setConfirmarEliminacion(null);

  // 🔹 Eliminar aplicativo
  const handleEliminar = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/aplicativos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar el aplicativo");
      setAplicativos(aplicativos.filter((a) => a.id !== id));
      mostrarMensaje("Aplicativo eliminado correctamente", "success");
    } catch (error) {
      console.error(error);
      mostrarMensaje("Error al eliminar el aplicativo", "error");
    } finally {
      cerrarConfirmacion();
    }
  };

  // 🔹 Abrir modal de edición
  const abrirModal = (app) => {
    setEditando(app.id);
    setForm({
      nombre: app.nombre,
      descripcion: app.descripcion,
      observaciones: app.observaciones || "",
    });
    setMostrarModal(true);
  };

  // 🔹 Actualizar aplicativo
const handleActualizar = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");

    // 🔹 Enviar actualización al backend
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/aplicativos/${editando}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al actualizar el aplicativo");

    // 🔹 Obtener el objeto actualizado (según cómo responda el backend)
    const actualizado = data.aplicativo || data;

    // 🔹 Actualizar el estado local sin recargar toda la lista
    setAplicativos((prev) =>
      prev.map((a) => (a.id === actualizado.id ? actualizado : a))
    );

    // 🔹 Cerrar modal y limpiar el formulario
    setMostrarModal(false);
    setEditando(null);
    setForm({ nombre: "", descripcion: "", observaciones: "" });

    // 🔹 Mostrar mensaje de éxito
    mostrarMensaje("Aplicativo modificado correctamente", "success");
  } catch (error) {
    console.error("Error al actualizar el aplicativo:", error);
    mostrarMensaje(
      error.message || "Error al actualizar el aplicativo",
      "error"
    );
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-teal-500 text-gray-800 flex flex-col items-center p-6">
      {/* 🔹 Toast de notificación */}
      {mensaje.texto && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white font-medium transition-all ${
            mensaje.tipo === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-8">
        <h1 className="text-3xl font-bold text-center text-sky-600 mb-6">
          Gestión de Aplicativos
        </h1>

        {/* 🔹 Formulario de creación */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 mb-8 justify-between"
        >
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del aplicativo"
            value={form.nombre}
            onChange={handleChange}
            required
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 outline-none"
          />
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 outline-none"
          />
          <input
            type="text"
            name="observaciones"
            placeholder="Observaciones"
            value={form.observaciones}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 outline-none"
          />
          <button className="bg-sky-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-sky-700 transition">
            Crear
          </button>
        </form>

        {/* 🔹 Lista de aplicativos */}
        {aplicativos.map((app) => (
          <div
            key={app.id}
            className="border border-gray-200 rounded-lg p-4 mb-4 shadow-md bg-gray-50"
          >
            <h2 className="text-xl font-semibold text-sky-700">{app.nombre}</h2>
            <p className="text-gray-600">{app.descripcion}</p>
            <p className="text-sm text-gray-500 mb-2">
              Observaciones: <strong>{app.observaciones || "N/A"}</strong>
            </p>

            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => abrirModal(app)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
              >
                Editar
              </button>
              <button
                onClick={() => abrirConfirmacion(app.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 w-full bg-sky-600 text-white py-2 rounded-lg font-semibold hover:bg-sky-700 transition"
        >
          Volver al Dashboard
        </button>
      </div>

      {/* 🔹 Modal de confirmación de eliminación */}
      {confirmarEliminacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-11/12 sm:w-96 text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              ¿Seguro que deseas eliminar este aplicativo?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleEliminar(confirmarEliminacion)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Sí, eliminar
              </button>
              <button
                onClick={cerrarConfirmacion}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Modal de edición */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-11/12 sm:w-96 relative">
            <h2 className="text-xl font-semibold text-center text-sky-600 mb-4">
              Editar Aplicativo
            </h2>

            <form onSubmit={handleActualizar} className="flex flex-col gap-3">
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 outline-none"
              />
              <input
                type="text"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 outline-none"
              />
              <input
                type="text"
                name="observaciones"
                value={form.observaciones}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 outline-none"
              />
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarModal(false);
                    setEditando(null);
                    setForm({ nombre: "", descripcion: "", observaciones: "" });
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gestion;
