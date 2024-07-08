import express from 'express';
import {
  crearAlumnoController,
  obtenerAlumnosController,
  obtenerAlumnoPorIdController,
  actualizarAlumnoController,
  eliminarAlumnoController
} from '../controllers/alumno.controller.js';
import authenticationMiddleware from '../middlewares/authentication.middleware.js';
import { isEncargado } from '../middlewares/authorization.middleware.js';

const router = express.Router();

// Ruta para que los alumnos se registren
router.post('/crear-alumnos', crearAlumnoController);
// Rutas protegidas para que el encargado pueda gestionar los alumnos
router.get('/ver-alumnos', authenticationMiddleware, isEncargado, obtenerAlumnosController);
router.get('/alumnos/:id', authenticationMiddleware, isEncargado, obtenerAlumnoPorIdController);
router.put('/alumnos/:id', authenticationMiddleware, isEncargado, actualizarAlumnoController);
router.delete('/alumnos/:id', authenticationMiddleware, isEncargado, eliminarAlumnoController);

export default router;
