import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Consulta() {
  const [aplicativos, setAplicativos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(""); // 🆕 mensaje temporal
  const [tipoMensaje, setTipoMensaje] = useState("success"); // 🆕 tipo de mensaje
  const navigate = useNavigate();

  // 🔹 Mostrar mensaje temporal (reutilizable) 🆕
  const mostrarMensaje = (texto, tipo = "success") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(""), 3000);
  };

  // 🔹 Cargar aplicativos con token
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
      } finally {
        setLoading(false);
      }
    };

    fetchAplicativos();
  }, []);

  const handleDownload = async (instaladorId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        mostrarMensaje("Debe iniciar sesión para descargar instaladores.", "error"); // 🆕
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/instaladores/${instaladorId}/download`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al descargar el instalador");
      }

      // Leer el archivo como Blob
      const blob = await response.blob();

      // Obtener nombre del archivo desde Content-Disposition
      const disposition = response.headers.get("content-disposition");
      let fileName = "instalador.exe";

      if (disposition) {
        const match = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/);
        if (match && match[1]) {
          fileName = decodeURIComponent(match[1]);
        }
      }

      // Crear enlace de descarga con el nombre correcto
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // Limpiar después
      a.remove();
      window.URL.revokeObjectURL(url);

      mostrarMensaje("Descarga iniciada correctamente.", "success"); // 🆕
    } catch (error) {
      console.error("Error al descargar instalador:", error);
      mostrarMensaje(error.message || "Error al descargar el instalador.", "error"); // 🆕
    }
  };

  // 🔹 Filtrado
  const filtrados = aplicativos.filter((a) =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-sky-500 to-teal-600 text-white text-lg font-semibold">
        Cargando aplicativos...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-teal-500 flex flex-col items-center p-6 text-gray-800">
      {/* 🆕 Toast de notificación */}
      {mensaje && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white font-medium transition-all z-50 ${
            tipoMensaje === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {mensaje}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-8">

        {/* 🔹 Botón superior igual que en Gestión de Instaladores */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Volver al Dashboard
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center text-sky-700 mb-6">
          Consulta de Aplicativos
        </h1>

        <input
          type="text"
          placeholder="Buscar aplicativo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full p-2 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
        />

        {filtrados.length === 0 ? (
          <p className="text-center text-gray-500">
            No se encontraron aplicativos.
          </p>
        ) : (
          filtrados.map((app) => (
            <div
              key={app.id}
              className="border border-gray-200 rounded-lg p-4 mb-4 shadow-md bg-gray-50 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-sky-700 mb-1">
                {app.nombre}
              </h2>
              <p className="text-gray-600 mb-1">{app.descripcion}</p>
              {app.observaciones && (
                <p className="text-sm text-gray-500 mb-2">
                  Observaciones: {app.observaciones}
                </p>
              )}
              <p className="text-sm text-gray-500 mb-2">
                Versión actual:{" "}
                <strong className="text-gray-700">
                  {app.version_actual || "N/A"}
                </strong>
              </p>

              {app.instaladores?.length > 0 && (
                <div className="mt-2">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Instaladores disponibles:
                  </h3>
                  <ul className="space-y-2">
                    {app.instaladores.map((inst) => (
                      <li
                        key={inst.id}
                        className="flex justify-between items-center bg-white border border-gray-200 rounded-md p-2"
                      >
                        <div className="flex flex-col text-left">
                          <span className="font-semibold text-gray-700">
                            Versión: {inst.version}
                          </span>
                          <span className="text-sm text-gray-500">
                            Estado: {inst.estado || "N/A"}
                          </span>
                          <span className="text-sm text-gray-500">
                            Observaciones: {inst.observaciones || "N/A"}
                          </span>
                        </div>

                        <button
                          onClick={() => handleDownload(inst.id)}
                          className="bg-sky-600 text-white px-3 py-1 rounded-lg hover:bg-sky-700 transition"
                        >
                          Descargar
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Consulta;
