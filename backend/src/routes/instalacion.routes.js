import express from 'express';
import { crearInstalacionController, obtenerInstalacionesController, obtenerInstalacionPorIdController, actualizarInstalacionController, eliminarInstalacionController } from '../controllers/instalacion.controller.js';
import authenticationMiddleware from '../middlewares/authentication.middleware.js';
import { isEncargado } from '../middlewares/authorization.middleware.js';

const router = express.Router();

// Ruta para crear una instalación
router.post('/crear-instalacion', authenticationMiddleware, isEncargado, crearInstalacionController);

// Ruta para obtener todas las instalaciones
router.get('/instalaciones', authenticationMiddleware, isEncargado, obtenerInstalacionesController);

// Ruta para obtener una instalación por ID
router.get('/instalaciones/:id', authenticationMiddleware, isEncargado, obtenerInstalacionPorIdController);

// Ruta para actualizar una instalación
router.put('/instalaciones/:id', authenticationMiddleware, isEncargado, actualizarInstalacionController);

// Ruta para eliminar una instalación
router.delete('/instalaciones/:id', authenticationMiddleware, isEncargado, eliminarInstalacionController);

export default router;
