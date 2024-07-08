import { Router } from 'express';
import reservaController from "../controllers/reservas.controller.js";
import { isEncargado, isAlumno } from '../middlewares/authorization.middleware.js';
import authenticationMiddleware from '../middlewares/authentication.middleware.js';
import verificarDiaHabilitado from '../middlewares/verificardiahabilitado.js';

const router = Router();

// Solo el encargado puede ver todas las reservas activas
router.get('/obtenerReservasActivas', authenticationMiddleware, isEncargado, reservaController.getAllReservasActivos);

// Solo el alumno puede ver sus reservas
router.get('/obtenerReservas/user/:id', authenticationMiddleware, isAlumno, reservaController.getAllReservasByUser);

// Solo el alumno y el encargado pueden registrar una reserva de implemento
router.post('/registrar-reserva-implemento', authenticationMiddleware, isAlumno, verificarDiaHabilitado, reservaController.registrarReservaImplemento);

// Solo el alumno y el encargado pueden registrar una reserva de instalación
router.post('/registrar-reserva-instalacion', authenticationMiddleware, isAlumno, verificarDiaHabilitado, reservaController.registrarReservaInstalacion);

// Solo el alumno y el encargado pueden cancelar una reserva
router.post('/cancelar', authenticationMiddleware, isAlumno, reservaController.cancelarReserva);

// Solo el alumno y el encargado pueden extender una reserva
router.post('/extender', authenticationMiddleware, isAlumno, reservaController.extenderReserva);

// Solo el alumno y el encargado pueden finalizar una reserva
router.post('/finalizar', authenticationMiddleware, isAlumno, reservaController.finalizarReserva);

// El encargado y los alumnos pueden obtener datos para gráficos
router.get('/grafico', authenticationMiddleware, reservaController.obtenerDatosGraficos);

export default router;
