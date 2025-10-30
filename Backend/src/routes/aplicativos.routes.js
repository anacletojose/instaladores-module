const express = require('express');
const router = express.Router();
const controller = require('../controllers/aplicativos.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

/**
 * @swagger
 * tags:
 *   name: Aplicativos
 *   description: Endpoints para la gestión de aplicativos del sistema
 */

/**
 * @swagger
 * /api/aplicativos:
 *   get:
 *     summary: Obtener todos los aplicativos
 *     tags: [Aplicativos]
 *     responses:
 *       200:
 *         description: Lista de aplicativos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                   version_actual:
 *                     type: string
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/aplicativos/{id}:
 *   get:
 *     summary: Obtener un aplicativo por su ID
 *     tags: [Aplicativos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del aplicativo
 *     responses:
 *       200:
 *         description: Aplicativo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 descripcion:
 *                   type: string
 *                 version_actual:
 *                   type: string
 *       404:
 *         description: Aplicativo no encontrado
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/aplicativos:
 *   post:
 *     summary: Crear un nuevo aplicativo
 *     tags: [Aplicativos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               observaciones:
 *                 type: string 
 *               version_actual:
 *                 type: string
 *     responses:
 *       201:
 *         description: Aplicativo creado correctamente
 *       400:
 *         description: Error en los datos enviados
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No autorizado (solo admin)
 */
router.post('/', auth, authorize(['admin']), controller.create);

/**
 * @swagger
 * /api/aplicativos/{id}:
 *   put:
 *     summary: Actualizar un aplicativo existente
 *     tags: [Aplicativos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del aplicativo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               observaciones:
 *                 type: string 
 *     responses:
 *       200:
 *         description: Aplicativo actualizado correctamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No autorizado (solo admin)
 *       404:
 *         description: Aplicativo no encontrado
 */
router.put('/:id', auth, authorize(['admin']), controller.update);

/**
 * @swagger
 * /api/aplicativos/{id}:
 *   delete:
 *     summary: Eliminar un aplicativo por su ID
 *     tags: [Aplicativos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del aplicativo a eliminar
 *     responses:
 *       200:
 *         description: Aplicativo eliminado correctamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No autorizado (solo admin)
 *       404:
 *         description: Aplicativo no encontrado
 */
router.delete('/:id', auth, authorize(['admin']), controller.delete);

module.exports = router;
