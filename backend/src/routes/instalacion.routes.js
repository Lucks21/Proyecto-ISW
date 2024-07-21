import express from 'express';
import { obtenerInstalacionPorNombreController,crearInstalacionController, obtenerInstalacionesController, obtenerInstalacionPorIdController, actualizarInstalacionController, eliminarInstalacionController } from '../controllers/instalacion.controller.js';
import authenticationMiddleware from '../middlewares/authentication.middleware.js';
import { isEncargado } from '../middlewares/authorization.middleware.js';

const router = express.Router();

router.post('/crear', authenticationMiddleware, isEncargado, crearInstalacionController);
router.get('/obtener', authenticationMiddleware, isEncargado, obtenerInstalacionesController);
router.get('/obtener/:id', authenticationMiddleware, isEncargado, obtenerInstalacionPorIdController);
router.put('/actualizar/:id', authenticationMiddleware, isEncargado, actualizarInstalacionController);
router.delete('/eliminar/:id', authenticationMiddleware, isEncargado, eliminarInstalacionController);
router.get('/obtenerByNombre/:nombre', authenticationMiddleware, isEncargado, obtenerInstalacionPorNombreController);

export default router;
