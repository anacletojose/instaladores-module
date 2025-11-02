import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setIsAuthorized(false);

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setIsAuthorized(false);
          return;
        }

        const data = await res.json();
        setUserRole(data.rol);
        setIsAuthorized(!requiredRole || data.rol === requiredRole);
      } catch (error) {
        console.error("Error al verificar el rol:", error);
        setIsAuthorized(false);
      }
    };

    fetchProfile();
  }, [requiredRole]);

  if (isAuthorized === null) {
    // Muestra un loader mientras se verifica el rol
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 text-blue-700 text-lg font-semibold">
        Verificando permisos...
      </div>
    );
  }

  if (!isAuthorized) {
    // Redirige a Dashboard si no tiene permisos
    return <Navigate to="/dashboard" state={{ error: "No tenés permisos para acceder a esta sección." }} replace />;
  }

  // Si está autorizado, renderiza el contenido interno
  return <Outlet />;
};

export default ProtectedRoute;
