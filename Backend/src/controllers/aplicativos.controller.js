const path = require('path');
const fs = require('fs');
const { Aplicativo, Instalador, Usuario } = require('../../models');

exports.getAll = async (req, res) => {
  try {
    const aplicativos = await Aplicativo.findAll({
      include: [
        {
          model: Instalador,
          as: 'instaladores',
          include: [
            {
              model: Usuario,
              as: 'usuario',
              attributes: ['id', 'nombre', 'email']
            }
          ],
          attributes: ['id', 'version', 'estado', 'archivo_url', 'observaciones', 'createdAt'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(aplicativos);
  } catch (error) {
    console.error('Error al obtener los aplicativos:', error);
    res.status(500).json({ error: 'Error al obtener los aplicativos' });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const aplicativo = await Aplicativo.findByPk(id, {
      include: [
        {
          model: Instalador,
          as: 'instaladores',
          include: [
            {
              model: Usuario,
              as: 'usuario',
              attributes: ['id', 'nombre', 'email']
            }
          ],
          attributes: ['id', 'version', 'estado', 'archivo_url', 'createdAt'],
        },
      ],
    });

    if (!aplicativo) {
      return res.status(404).json({ error: 'Aplicativo no encontrado' });
    }

    res.status(200).json(aplicativo);
  } catch (error) {
    console.error('Error al obtener el aplicativo:', error);
    res.status(500).json({ error: 'Error al obtener el aplicativo' });
  }
};


exports.create = async (req, res) => {
  try {
    const { nombre, descripcion, observaciones, version_actual } = req.body;

    const existente = await Aplicativo.findOne({ where: { nombre } });
    if (existente) {
      return res.status(400).json({ error: 'Ya existe un aplicativo con ese nombre' });
    }

    const nuevo = await Aplicativo.create({
      nombre,
      descripcion,
      observaciones,
      version_actual,
    });

    res.status(201).json({
      message: 'Aplicativo creado correctamente',
      aplicativo: nuevo,
    });
  } catch (error) {
    console.error('Error al crear el aplicativo:', error);
    res.status(500).json({ error: 'Error al crear el aplicativo' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, observaciones, version_actual } = req.body;

    const aplicativo = await Aplicativo.findByPk(id);
    if (!aplicativo) {
      return res.status(404).json({ error: 'Aplicativo no encontrado' });
    }

    await aplicativo.update({ nombre, descripcion, observaciones, version_actual });

    res.status(200).json({
      message: 'Aplicativo actualizado correctamente',
      aplicativo,
    });
  } catch (error) {
    console.error('Error al actualizar el aplicativo:', error);
    res.status(500).json({ error: 'Error al actualizar el aplicativo' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const aplicativo = await Aplicativo.findByPk(id, {
      include: { model: Instalador, as: 'instaladores' },
    });

    if (!aplicativo) {
      return res.status(404).json({ error: 'Aplicativo no encontrado' });
    }

    // Eliminar archivos físicos de los instaladores asociados
    if (aplicativo.instaladores && aplicativo.instaladores.length > 0) {
      await Promise.all(
        aplicativo.instaladores.map(async (inst) => {
          const filePath = path.join(__dirname, '../../', inst.archivo_url);
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath); // Borra el archivo físico
              console.log(`Archivo eliminado: ${filePath}`);
            }
          } catch (err) {
            console.warn(`No se pudo eliminar el archivo ${filePath}:`, err.message);
          }

          // Eliminar el registro del instalador
          await inst.destroy();
        })
      );
    }

    // Eliminar el aplicativo
    await aplicativo.destroy();

    res.status(200).json({
      message:
        'Aplicativo e instaladores asociados eliminados correctamente (incluyendo archivos físicos)',
    });
  } catch (error) {
    console.error('Error al eliminar el aplicativo:', error);
    res.status(500).json({ error: 'Error al eliminar el aplicativo' });
  }
};
