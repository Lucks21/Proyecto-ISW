"use strict";
import express from 'express';
import {
  crearImplementoController,
  obtenerImplementosController,
  obtenerImplementoPorIdController,
  actualizarImplementoController,
  actualizarImplementoParcialController,
  eliminarImplementoController,
  obtenerHistorialImplementoController,
  obtenerImplementoPorNombreController
} from '../controllers/implementos.controller.js';
import authenticationMiddleware from '../middlewares/authentication.middleware.js';
import { isEncargado } from '../middlewares/authorization.middleware.js';


const router = express.Router();

// Rutas para implementos
router.post('/crear', authenticationMiddleware, isEncargado, crearImplementoController);
router.get('/obtener', authenticationMiddleware, obtenerImplementosController);
router.get('/obtener/:id', authenticationMiddleware, isEncargado, obtenerImplementoPorIdController);
router.put('/actualizarTodo/:id', authenticationMiddleware, isEncargado, actualizarImplementoController);
router.patch('/actualizarParcial/:id', authenticationMiddleware, isEncargado, actualizarImplementoParcialController);
router.delete('/eliminar/:id', authenticationMiddleware, isEncargado, eliminarImplementoController);
router.get('/historial/:id', authenticationMiddleware, isEncargado, obtenerHistorialImplementoController);
router.get('/obtenerByNombre/:nombre', authenticationMiddleware, isEncargado, obtenerImplementoPorNombreController);

export default router;

