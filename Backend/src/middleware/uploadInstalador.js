const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ruta absoluta a la carpeta uploads
const uploadDir = path.join(__dirname, '../../uploads/instaladores');

// Crear carpeta si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento con Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Filtro para aceptar solo archivos .exe y .msi
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.exe', '.msi'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    return cb(new Error('Solo se permiten archivos con extensión .exe o .msi'));
  }

  cb(null, true);
};

// Configuración final de multer
const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
