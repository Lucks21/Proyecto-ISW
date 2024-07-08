import express from 'express';
import {
  crearImplementoController,
  obtenerImplementosController,
  obtenerImplementoPorIdController,
  actualizarImplementoController,
  actualizarImplementoParcialController,
  eliminarImplementoController,
  obtenerHistorialImplementoController
} from '../controllers/implementos.controller.js';
import authenticationMiddleware from '../middlewares/authentication.middleware.js';
import { isEncargado } from '../middlewares/authorization.middleware.js';

const router = express.Router();

// Rutas para implementos
router.post('/crear-implementos', authenticationMiddleware, isEncargado, crearImplementoController);
router.get('/obtener-implementos', authenticationMiddleware, isEncargado, obtenerImplementosController);
router.get('/implementos/:id', authenticationMiddleware, isEncargado, obtenerImplementoPorIdController);
router.put('/actualizar-implementos/:id', authenticationMiddleware, isEncargado, actualizarImplementoController);
router.patch('/actualizar-parcial-implementos/:id', authenticationMiddleware, isEncargado, actualizarImplementoParcialController);
router.delete('/eliminar-implementos/:id', authenticationMiddleware, isEncargado, eliminarImplementoController);
router.get('//obtener-historial-implementos/:id/historial', authenticationMiddleware, isEncargado, obtenerHistorialImplementoController);

export default router;

