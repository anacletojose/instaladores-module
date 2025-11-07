import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          setChecking(false);
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("No autorizado");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error verificando usuario:", err);
        setUser(null);
      } finally {
        setChecking(false);
      }
    };

    fetchUser();
  }, []);

  if (checking)
    return (
      <div className="min-h-screen flex justify-center items-center text-sky-600 font-semibold">
        Verificando permisos...
      </div>
    );

  if (!user) return <Navigate to="/login" replace />;
  if (user.rol !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
};

export default AdminRoute;
