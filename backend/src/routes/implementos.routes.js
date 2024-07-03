import express from 'express';
import {
  crearImplementoController,
  obtenerImplementosController,
  obtenerImplementoPorIdController,
  actualizarImplementoController,
  eliminarImplementoController,
  obtenerHistorialImplementoController
} from '../controllers/implementos.controller.js';
import { isEncargado } from '../middlewares/authorization.middleware.js';
import authenticationMiddleware from '../middlewares/authentication.middleware.js';

const router = express.Router();

// Ruta para crear un implemento (solo encargado)
router.post('/crear-implementos', authenticationMiddleware, isEncargado, crearImplementoController);

// Ruta para obtener todos los implementos
router.get('/obtener-implementos', authenticationMiddleware, obtenerImplementosController);

// Ruta para obtener un implemento por ID
router.get('/implementos/:id', authenticationMiddleware, obtenerImplementoPorIdController);

// Ruta para actualizar un implemento (solo encargado)
router.put('/actualizar-implementos/:id', authenticationMiddleware, isEncargado, actualizarImplementoController);

// Ruta para eliminar un implemento (solo encargado)
router.delete('/eliminar-implementos/:id', authenticationMiddleware, isEncargado, eliminarImplementoController);
//obtener historial de un implemento
router.get('/obtener-historial-implementos/:id/historial', authenticationMiddleware, isEncargado, obtenerHistorialImplementoController);
export default router;
