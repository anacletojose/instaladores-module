// Obtener el token JWT guardado
export const getToken = () => localStorage.getItem("token");

// Guardar un nuevo token
export const setToken = (token) => localStorage.setItem("token", token);

// Eliminar el token (cerrar sesión)
export const logout = () => localStorage.removeItem("token");

// Verificar si el usuario está autenticado
export const isAuthenticated = () => !!localStorage.getItem("token");

// Decodificar el token (opcional, si querés obtener datos del usuario)
export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // decodifica el JWT
    return payload;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};
