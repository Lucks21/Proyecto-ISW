import express from 'express';
import { crearInstalacionController, obtenerInstalacionesController, obtenerInstalacionPorIdController, actualizarInstalacionController, eliminarInstalacionController } from '../controllers/instalacion.controller.js';
import authenticationMiddleware from '../middlewares/authentication.middleware.js';
import { isEncargado } from '../middlewares/authorization.middleware.js';
import instalacionController from '../controllers/instalacion.controller.js';

const router = express.Router();

router.post('/crear', authenticationMiddleware, isEncargado, crearInstalacionController);
router.get('/obtener', authenticationMiddleware, isEncargado, obtenerInstalacionesController);
router.get('/obtener/:id', authenticationMiddleware, isEncargado, obtenerInstalacionPorIdController);
router.put('/actualizar/:id', authenticationMiddleware, isEncargado, actualizarInstalacionController);
router.delete('/eliminar/:id', authenticationMiddleware, isEncargado, eliminarInstalacionController);
router.get('/obtener/Reservadas', instalacionController.getInstalacionesReservadas);//esto tengo que cambiarlo al reserva.router

export default router;
