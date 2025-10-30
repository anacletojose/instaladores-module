const path = require('path');
const fs = require('fs');
const { Instalador, Aplicativo, Usuario } = require('../../models');

const getInstaladores = async (req, res) => {
  try {
    const instaladores = await Instalador.findAll({
      include: [
        {
          model: Aplicativo,
          as: 'aplicativo',
          attributes: ['id', 'nombre', 'version_actual']
        },
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(instaladores);
  } catch (error) {
    console.error('Error al obtener los instaladores:', error);
    res.status(500).json({ error: 'Error al obtener los instaladores' });
  }
};


const uploadInstalador = async (req, res) => {
  try {
    const { version, estado, observaciones, aplicativoId } = req.body;

    // Verificar si se subió un archivo 
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo válido (.exe o .msi)' });
    }

    // Validar campos mínimos
    if (!aplicativoId) {
      // Eliminar archivo si no se proporcionó el ID
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Debe especificar el ID del aplicativo' });
    }

    if (!version) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Debe especificar la versión del instalador' });
    }

    // Buscar el aplicativo asociado
    const aplicativo = await Aplicativo.findByPk(aplicativoId);
    if (!aplicativo) {
      // Eliminar archivo subido si el aplicativo no existe
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ error: 'Aplicativo no encontrado' });
    }

    // Obtener el usuario autenticado desde el token
    const usuarioId = req.user?.id;
    if (!usuarioId) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Crear el registro del instalador
    const instalador = await Instalador.create({
      version,
      estado,
      observaciones,
      archivo_url: `uploads/instaladores/${req.file.filename}`, // ✅ ruta coherente con el middleware
      aplicativoId,
      usuarioId,
      fecha_carga: new Date(),
    });

    // Actualizar la versión actual del aplicativo al subir un nuevo instalador
    await aplicativo.update({ version_actual: version });

    res.status(201).json({
      message: 'Instalador subido correctamente y versión del aplicativo actualizada',
      instalador,
    });

  } catch (error) {
    console.error('Error al subir el instalador:', error);
    res.status(500).json({ error: 'Error al subir el instalador' });
  }
};



const downloadInstalador = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.user;

    // Validar permisos
    if (rol !== 'admin' && rol !== 'usuario') {
      return res.status(403).json({ error: 'No tienes permiso para descargar instaladores' });
    }

    // Buscar instalador
    const instalador = await Instalador.findByPk(id, {
      include: [
        { model: Aplicativo, as: 'aplicativo', attributes: ['nombre'] },
        { model: Usuario, as: 'usuario', attributes: ['nombre'] }
      ]
    });

    if (!instalador) {
      return res.status(404).json({ error: 'Instalador no encontrado' });
    }

    // Construir la ruta física
    const filePath = path.join(__dirname, '../../', instalador.archivo_url);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Archivo no encontrado en el servidor' });
    }

    // Descargar archivo
    res.download(filePath, path.basename(filePath), (err) => {
      if (err) {
        console.error('Error al descargar el archivo:', err);
        res.status(500).json({ error: 'Error al descargar el archivo' });
      }
    });
  } catch (error) {
    console.error('Error en descarga:', error);
    res.status(500).json({ error: 'Error al procesar la descarga' });
  }
};

const deleteInstalador = async (req, res) => {
  try {
    const { id } = req.params;

    const instalador = await Instalador.findByPk(id);
    if (!instalador) {
      return res.status(404).json({ error: 'Instalador no encontrado' });
    }

    const filePath = path.join(__dirname, '../../', instalador.archivo_url);

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Archivo eliminado: ${filePath}`);
      } catch (err) {
        console.warn(`No se pudo eliminar el archivo ${filePath}:`, err.message);
      }
    }

    await instalador.destroy();

    res.status(200).json({ message: 'Instalador eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el instalador:', error);
    res.status(500).json({ error: 'Error al eliminar el instalador' });
  }
};

module.exports = {
  getInstaladores,
  uploadInstalador,
  downloadInstalador,
  deleteInstalador
};
