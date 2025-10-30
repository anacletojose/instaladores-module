// src/middleware/authorize.js
module.exports = function (rolesPermitidos = []) {
  return (req, res, next) => {
    const usuario = req.user;

    if (!usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // Si el rol del usuario está dentro del array permitido, sigue
    if (rolesPermitidos.includes(usuario.rol)) {
      return next();
    }

    // Si no tiene permisos
    return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
  };
};
