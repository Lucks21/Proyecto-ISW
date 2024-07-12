import { Router } from 'express';
import notificacionController from '../controllers/notificacion.controller.js';
import { isAlumno, isEncargado } from '../middlewares/authorization.middleware.js';
import authenticationMiddleware from '../middlewares/authentication.middleware.js';

const router = Router();

router.post('/solicitar',isAlumno, notificacionController.solicitarNotificacion);
router.get('/verSolicitudes', authenticationMiddleware , isEncargado , notificacionController.verSolicitudesNotificacion);
router.post('/notificarImplemento',authenticationMiddleware, isEncargado, notificacionController.notificarDisponibilidadImplemento);
router.post('/notificarInstalacion',authenticationMiddleware, isEncargado, notificacionController.notificarDisponibilidadInstalacion);
export default router;
