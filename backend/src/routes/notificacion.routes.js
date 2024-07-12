import { Router } from 'express';
import notificacionController from '../controllers/notificacion.controller.js';
import { isAlumno } from '../middlewares/authorization.middleware.js';
const router = Router();

router.post('/solicitar',isAlumno, notificacionController.solicitarNotificacion);

export default router;
