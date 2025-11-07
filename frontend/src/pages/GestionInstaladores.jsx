import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const GestionInstaladores = () => {
  const [aplicativos, setAplicativos] = useState([]);
  const [instaladores, setInstaladores] = useState([]);
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
  const [editando, setEditando] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState({
    version: "",
    estado: "",
    observaciones: "",
  });
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  // 🔹 Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const [resUser, resApps, resInst] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/usuarios/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/aplicativos`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/instaladores`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const userData = await resUser.json();
        if (userData.rol !== "admin") {
          setMensaje("Solo los administradores pueden acceder a esta sección.");
          setTipoMensaje("error");
        }

        setUser(userData);
        setAplicativos(await resApps.json());
        setInstaladores(await resInst.json());
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };
    fetchData();
  }, [navigate]);

  // 🔹 Recargar instaladores
  const fetchInstaladores = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/instaladores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setInstaladores(data);
    } catch (err) {
      console.error("Error al actualizar la lista de instaladores:", err);
    }
  };

  // 🔹 Mostrar mensaje temporal
  const mostrarMensaje = (texto, tipo = "success") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(null), 3500);
  };

  // 🔹 Cambios en inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "archivo") {
      setForm({ ...form, archivo: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 🔹 Subir instalador
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.archivo) {
      mostrarMensaje("Debe seleccionar un archivo instalador (.exe o .msi).", "error");
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

      await fetchInstaladores();
      setForm({
        aplicativoId: "",
        version: "",
        estado: "",
        observaciones: "",
        archivo: null,
      });
      mostrarMensaje("Instalador subido correctamente.", "success");
    } catch (error) {
      console.error(error);
      mostrarMensaje(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Descargar instalador
  const handleDescargar = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/instaladores/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al descargar el instalador");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const contentDisposition = res.headers.get("Content-Disposition");
      let filename = "instalador.exe";
      if (contentDisposition && contentDisposition.includes("filename=")) {
        filename = decodeURIComponent(
          contentDisposition.split("filename=")[1].replace(/"/g, "")
        );
      }

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      mostrarMensaje("Descarga iniciada correctamente.", "success");
    } catch (error) {
      console.error("Error al descargar:", error);
      mostrarMensaje("No se pudo descargar el instalador.", "error");
    }
  };

  // 🔹 Editar
  const handleEditar = (inst) => {
    setEditando(inst.id);
    setModalForm({
      version: inst.version || "",
      estado: inst.estado || "",
      observaciones: inst.observaciones || "",
    });
    setModalOpen(true);
  };

  // 🔹 Actualizar
  const handleActualizar = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/instaladores/${editando}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(modalForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar instalador");

      await fetchInstaladores();
      setModalOpen(false);
      setEditando(null);
      mostrarMensaje("Instalador actualizado correctamente.", "success");
    } catch (error) {
      console.error(error);
      mostrarMensaje("Error al actualizar el instalador.", "error");
    }
  };

  // 🔹 Eliminar
  const handleEliminar = (id) => {
    setMensaje({
      texto: "¿Seguro que deseas eliminar este instalador?",
      tipo: "confirmacion",
      id,
    });
  };

  const confirmarEliminar = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/instaladores/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar instalador");

      await fetchInstaladores();
      mostrarMensaje("Instalador eliminado correctamente.", "success");
    } catch (error) {
      console.error(error);
      mostrarMensaje("Error al eliminar el instalador.", "error");
    }
  };

  // 🔍 Filtrar por nombre de aplicativo
  const instaladoresFiltrados = instaladores.filter((i) =>
    i.aplicativo?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 🔹 Formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleString("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  if (!user) return <Spinner />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-sky-400 to-teal-500 text-gray-800 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-6xl">

        {/* 🔹 Botón superior */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Volver al Dashboard
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center text-sky-600 mb-6">
          Gestión de Instaladores
        </h1>

        {/* 🔹 Barra de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por nombre de aplicativo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full mb-6 focus:ring-2 focus:ring-sky-500 outline-none"
        />

        {/* 🔹 Mensajes */}
        {mensaje && typeof mensaje === "string" && (
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

        {/* 🔹 Confirmación de eliminación */}
        {mensaje?.tipo === "confirmacion" && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded-lg mb-4 text-center">
            <p className="mb-3 font-semibold">{mensaje.texto}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => confirmarEliminar(mensaje.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setMensaje(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* 🔹 Formulario de carga */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row md:items-end md:gap-4 gap-2 mb-8 flex-wrap"
          encType="multipart/form-data"
        >
        <select
          name="aplicativoId"
          value={form.aplicativoId}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg p-2 w-full md:w-auto flex-1 focus:ring-2 focus:ring-sky-500 outline-none"
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
          className="border border-gray-300 rounded-lg p-2 w-full md:w-auto flex-1"
        />

        <input
          type="text"
          name="estado"
          placeholder="Estado"
          value={form.estado}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 w-full md:w-auto flex-1"
        />

      <input
        type="text"
        name="observaciones"
        placeholder="Observaciones"
        value={form.observaciones}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg p-2 w-full md:w-auto flex-1"
      />

      <input
        type="file"
        name="archivo"
        accept=".exe,.msi"
        onChange={handleChange}
        className="border border-gray-300 rounded-lg p-2 w-full md:w-auto flex-1"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full md:w-auto py-2 px-4 rounded-lg text-white font-semibold transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-sky-600 hover:bg-sky-700"
        }`}
      >
        {loading ? "Subiendo..." : "Subir Instalador"}
      </button>
    </form>


        {/* 🔹 Lista de instaladores */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-sky-100 text-sky-700">
                <th className="p-2 border">Aplicativo</th>
                <th className="p-2 border">Versión</th>
                <th className="p-2 border">Estado</th>
                <th className="p-2 border">Observaciones</th> {/* 🆕 */}
                <th className="p-2 border">Subido por</th>
                <th className="p-2 border">Fecha de carga</th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {instaladoresFiltrados.map((inst) => (
                <tr key={inst.id} className="text-center border-t hover:bg-gray-50">
                  <td className="p-2 border">{inst.aplicativo?.nombre}</td>
                  <td className="p-2 border">{inst.version}</td>
                  <td className="p-2 border">{inst.estado || "-"}</td>
                  <td className="p-2 border">{inst.observaciones || "-"}</td> {/* 🆕 */}
                  <td className="p-2 border">{inst.usuario?.nombre || "Desconocido"}</td>
                  <td className="p-2 border">{formatearFecha(inst.fecha_carga)}</td>
                  <td className="p-2 border flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => handleEditar(inst)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(inst.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => handleDescargar(inst.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
                    >
                      Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 Modal de edición */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-96">
            <h2 className="text-xl font-bold text-center text-sky-600 mb-4">
              Editar Instalador
            </h2>
            <form onSubmit={handleActualizar} className="flex flex-col gap-4">
              <input
                type="text"
                name="version"
                placeholder="Versión"
                value={modalForm.version}
                onChange={(e) => setModalForm({ ...modalForm, version: e.target.value })}
                required
                className="border border-gray-300 rounded-lg p-2"
              />
              <input
                type="text"
                name="estado"
                placeholder="Estado"
                value={modalForm.estado}
                onChange={(e) => setModalForm({ ...modalForm, estado: e.target.value })}
                className="border border-gray-300 rounded-lg p-2"
              />
              <textarea
                name="observaciones"
                placeholder="Observaciones"
                value={modalForm.observaciones}
                onChange={(e) =>
                  setModalForm({ ...modalForm, observaciones: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2"
              ></textarea>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionInstaladores;
