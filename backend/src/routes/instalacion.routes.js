import express from 'express';
import { crearInstalacionController, obtenerInstalacionesController, obtenerInstalacionPorIdController, actualizarInstalacionController, eliminarInstalacionController } from '../controllers/instalacion.controller.js';
import authenticationMiddleware from '../middlewares/authentication.middleware.js';
import { isEncargado } from '../middlewares/authorization.middleware.js';
import instalacionController from '../controllers/instalacion.controller.js';

const router = express.Router();

// Ruta para crear una instalación
router.post('/crear-instalacion', authenticationMiddleware, isEncargado, crearInstalacionController);
// Ruta para obtener todas las instalaciones
router.get('/obtener-instalaciones', authenticationMiddleware, isEncargado, obtenerInstalacionesController);
// Ruta para obtener una instalación por ID
router.get('/obtener-instalaciones/:id', authenticationMiddleware, isEncargado, obtenerInstalacionPorIdController);
// Ruta para actualizar una instalación
router.put('/instalaciones/:id', authenticationMiddleware, isEncargado, actualizarInstalacionController);
// Ruta para eliminar una instalación
router.delete('/borrar-instalaciones/:id', authenticationMiddleware, isEncargado, eliminarInstalacionController);

router.get('/obtenerinstalaciones/Reservadas', instalacionController.getInstalacionesReservadas);
export default router;
