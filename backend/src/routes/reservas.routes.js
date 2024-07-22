import { Router } from 'express';
import ReservaController from "../controllers/reservas.controller.js";
import { isEncargado, isAlumno } from '../middlewares/authorization.middleware.js';
import authenticationMiddleware from '../middlewares/authentication.middleware.js';

const router = Router();

router.get('/obtenerActivas', authenticationMiddleware,  ReservaController.getAllReservasActivos);
router.get('/historialActivas', authenticationMiddleware,isEncargado, ReservaController.getHistorialReservasActivas);
router.get('/historialNoActivas', authenticationMiddleware, isEncargado, ReservaController.getHistorialReservasNoActivas);
router.get('/usuario/:id', authenticationMiddleware, isAlumno, ReservaController.getAllReservasByUser);
router.get('/grafico', authenticationMiddleware, isEncargado, ReservaController.obtenerDatosGraficos);
router.get('/graficoAlumno/:id', authenticationMiddleware, isAlumno, ReservaController.obtenerDatosGraficosAlumno);
router.get('/obtenerImplementos', authenticationMiddleware, isEncargado ,ReservaController.getImplementosReservados);
router.get('/obtenerInstalaciones', authenticationMiddleware, isEncargado ,ReservaController.getInstalacionesReservadas);
router.get('/obtenerImplementosByUser', authenticationMiddleware, isAlumno ,ReservaController.getImplementosReservadosByUser);
router.get('/obtenerInstalacionesByUser', authenticationMiddleware, isAlumno ,ReservaController.getInstalacionesReservadasByUser);
router.get('/historial', authenticationMiddleware, isEncargado, ReservaController.getHistorialReservas);
router.get('/grafico/alumno/:id', authenticationMiddleware, isAlumno, ReservaController.obtenerDatosGraficosAlumno);
router.post('/registrarImplemento', authenticationMiddleware, isAlumno ,ReservaController.registrarReservaImplemento);
router.post('/registrarInstalacion', authenticationMiddleware, isAlumno ,ReservaController.registrarReservaInstalacion);
router.post('/cancelar', authenticationMiddleware, isAlumno, ReservaController.cancelarReserva);
router.post('/extender', authenticationMiddleware, isAlumno, ReservaController.extenderReserva);


export default router;
