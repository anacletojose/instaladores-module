import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Consulta() {
  const [aplicativos, setAplicativos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleDescargar = async (archivoUrl) => {
    try {
      window.open(`${import.meta.env.VITE_API_URL}/${archivoUrl}`, "_blank");
    } catch (err) {
      console.error("Error al descargar:", err);
    }
  };

  const filtrados = aplicativos.filter((a) =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-sky-400 to-teal-500 text-white text-lg">
        Cargando aplicativos...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-teal-500 text-gray-800 flex flex-col items-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8">
        <h1 className="text-3xl font-bold text-center text-sky-600 mb-6">
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
              className="border border-gray-200 rounded-lg p-4 mb-4 shadow-md bg-gray-50"
            >
              <h2 className="text-xl font-semibold text-sky-700">
                {app.nombre}
              </h2>
              <p className="text-gray-600">{app.descripcion}</p>
              <p className="text-sm text-gray-500 mb-2">
                Versión actual: <strong>{app.version_actual || "N/A"}</strong>
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
                        <span>{inst.version}</span>
                        <button
                          onClick={() => handleDescargar(inst.archivo_url)}
                          className="bg-sky-500 text-white px-3 py-1 rounded-lg hover:bg-sky-600 transition"
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

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 w-full bg-sky-600 text-white py-2 rounded-lg font-semibold hover:bg-sky-700 transition"
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
}

export default Consulta;
