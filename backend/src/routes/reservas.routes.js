// backend/src/routes/reservas.routes.js
import { Router } from 'express';
import {
  registrarReservaImplemento,
  registrarReservaInstalacion,
  cancelarReserva,
  extenderReserva,
  getAllReservasByUser,
  getAllReservasActivos,
  obtenerDatosGraficos
} from "../controllers/reservas.controller.js";
import { isEncargado, isAlumno } from '../middlewares/authorization.middleware.js';
import authenticationMiddleware from '../middlewares/authentication.middleware.js';

const router = Router();

// Solo el encargado puede ver todas las reservas activas
router.get('/obtenerReservasActivas', authenticationMiddleware, isEncargado, getAllReservasActivos);
// Ruta para que el alumno realice una reserva
router.post('/registrarReservaImplemento', authenticationMiddleware,  registrarReservaImplemento);
router.post('/registrarReservaInstalacion', authenticationMiddleware,  registrarReservaInstalacion);
// Ruta para cancelar una reserva
router.post('/cancelarReserva', authenticationMiddleware, isAlumno, cancelarReserva);
// Ruta para extender una reserva
router.post('/extenderReserva', authenticationMiddleware, isAlumno, extenderReserva);
// Ruta para finalizar una reserva
//router.post('/finalizarReservasExpiradas', cronAuthMiddleware, finalizarReservasExpiradas);
// Ruta para obtener todas las reservas de un usuario
router.get('/reservasUsuario/:id', authenticationMiddleware, isAlumno, getAllReservasByUser);
// Ruta para obtener datos para gráficos
router.get('/obtenerGrafico', authenticationMiddleware, isEncargado, obtenerDatosGraficos);

export default router;
