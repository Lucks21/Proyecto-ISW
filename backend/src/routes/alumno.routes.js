// backend/src/routes/alumno.routes.js
import express from 'express';
import {
  crearAlumnoController,
  obtenerAlumnosController,
  obtenerAlumnoPorIdController,
  actualizarAlumnoController,
  eliminarAlumnoController
} from '../controllers/alumno.controller.js';
import authenticationMiddleware from '../middlewares/authentication.middleware.js';
import { isEncargado} from '../middlewares/authorization.middleware.js';

const router = express.Router();

router.post('/CrearAlumnos', crearAlumnoController);
router.get('/VerAlumnos', authenticationMiddleware, isEncargado, obtenerAlumnosController);
router.get('/VerAlumnos/:id', authenticationMiddleware, isEncargado, obtenerAlumnoPorIdController);
router.put('/ActualizarAlumnos/:id', authenticationMiddleware, isEncargado, actualizarAlumnoController);
router.delete('/BorrarAlumnos/:id', authenticationMiddleware, isEncargado, eliminarAlumnoController);

export default router;
