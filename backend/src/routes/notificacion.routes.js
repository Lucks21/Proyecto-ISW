import { Router } from 'express';
import notificacionController from '../controllers/notificacion.controller.js';

const router = Router();

router.post('/solicitar', notificacionController.solicitarNotificacion);
router.post('/notificarImplemento', notificacionController.notificarDisponibilidadImplemento);
router.post('/notificarInstalacion', notificacionController.notificarDisponibilidadInstalacion);

export default router;
