// backend/src/routes/alumno.routes.js
import express from 'express';
import {
  crearAlumnoController,
  obtenerAlumnosController,
  obtenerAlumnoPorIdController,
  actualizarAlumnoController,
  eliminarAlumnoController,
  obtenerAlumnoPorEmailController
} from '../controllers/alumno.controller.js';
import authenticationMiddleware from '../middlewares/authentication.middleware.js';
import { isEncargado} from '../middlewares/authorization.middleware.js';

const router = express.Router();

router.post('/crear', crearAlumnoController);
router.get('/obtener', authenticationMiddleware, isEncargado, obtenerAlumnosController);
router.get('/obtener/:id', authenticationMiddleware, isEncargado, obtenerAlumnoPorIdController);
router.put('/actualizar/:id', authenticationMiddleware, actualizarAlumnoController);
router.delete('/eliminar/:id', authenticationMiddleware, isEncargado, eliminarAlumnoController);
router.get('/obtenerByEmail/:email', authenticationMiddleware, obtenerAlumnoPorEmailController);

export default router;
