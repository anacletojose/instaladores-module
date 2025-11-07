import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Consulta from "./pages/Consulta.jsx";
import Gestion from "./pages/Gestion.jsx";
import GestionInstaladores from "./pages/GestionInstaladores.jsx";
import AdminRoute from "./components/AdminRoute.jsx"; // ✅ Importamos el componente de protección
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/consulta" element={<Consulta />} />

        {/* 🔹 Rutas protegidas para administradores */}
        <Route
          path="/gestion"
          element={
            <AdminRoute>
              <Gestion />
            </AdminRoute>
          }
        />
        <Route
          path="/gestion-instaladores"
          element={
            <AdminRoute>
              <GestionInstaladores />
            </AdminRoute>
          }
        />

        <Route path="/app" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

