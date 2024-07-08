import { Router } from 'express';
import notificacionController from '../controllers/notificacion.controller.js';

const router = Router();

router.post('/solicitar', notificacionController.solicitarNotificacion); 

export default router;
