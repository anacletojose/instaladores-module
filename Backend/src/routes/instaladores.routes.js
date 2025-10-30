const express = require('express');
const router = express.Router();
const controller = require('../controllers/instaladores.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const upload = require('../middleware/uploadInstalador');

/**
 * @swagger
 * tags:
 *   name: Instaladores
 *   description: Endpoints para la gestión de instaladores (subida, descarga y eliminación)
 */

/**
 * @swagger
 * /api/instaladores:
 *   get:
 *     summary: Obtener la lista de instaladores disponibles
 *     tags: [Instaladores]
 *     responses:
 *       200:
 *         description: Lista de instaladores obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   version:
 *                     type: string
 *                     example: "1.0.0"
 *                   archivo_url:
 *                     type: string
 *                     example: uploads/instaladores/1729472939-AppInstaller_v1.0.exe
 *                   aplicativoId:
 *                     type: integer
 *                     example: 3
 */
router.get('/', controller.getInstaladores);

/**
 * @swagger
 * /api/instaladores/upload:
 *   post:
 *     summary: Subir un nuevo instalador
 *     tags: [Instaladores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - aplicativoId
 *               - version
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo del instalador (.exe o .msi)
 *               aplicativoId:
 *                 type: integer
 *                 description: ID del aplicativo al que pertenece
 *                 example: 3
 *               version:
 *                 type: string
 *                 description: Versión del instalador
 *                 example: "2.0.1"
 *               estado:
 *                 type: string
 *                 description: Estado del instalador
 *                 example: "activo"
 *               observaciones:
 *                 type: string
 *                 description: Observaciones del instalador
 *                 example: "Instalador corregido para Windows 11"
 *     responses:
 *       201:
 *         description: Instalador subido correctamente
 *       400:
 *         description: Error al subir el archivo o datos inválidos
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No autorizado (solo admins pueden subir instaladores)
 *       404:
 *         description: Aplicativo no encontrado
 */
router.post('/upload', auth, upload.single('file'), controller.uploadInstalador);

/**
 * @swagger
 * /api/instaladores/{id}/download:
 *   get:
 *     summary: Descargar un instalador por su ID
 *     tags: [Instaladores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del instalador
 *     responses:
 *       200:
 *         description: Descarga iniciada correctamente
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No autorizado (solo admins y usuarios pueden descargar)
 *       404:
 *         description: Instalador no encontrado
 */
router.get(
  '/:id/download',
  auth,
  authorize(['admin', 'usuario']),
  controller.downloadInstalador
);

/**
 * @swagger
 * /api/instaladores/{id}:
 *   delete:
 *     summary: Eliminar un instalador por ID
 *     tags: [Instaladores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del instalador a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Instalador eliminado correctamente
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: Instalador no encontrado
 *       500:
 *         description: Error al eliminar el instalador
 */
router.delete(
  '/:id',
  auth,
  authorize(['admin', 'usuario']),
  controller.deleteInstalador
);

module.exports = router;
