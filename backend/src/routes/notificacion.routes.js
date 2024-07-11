import { Router } from 'express';
import notificacionController from '../controllers/notificacion.controller.js';
import { isAlumno } from '../middlewares/authorization.middleware.js';

const router = Router();

router.post('/solicitar',isAlumno, notificacionController.solicitarNotificacion);
router.post('/notificarImplemento', notificacionController.notificarDisponibilidadImplemento);
router.post('/notificarInstalacion', notificacionController.notificarDisponibilidadInstalacion);

export default router;
