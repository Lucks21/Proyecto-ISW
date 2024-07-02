import { Router } from 'express';

import reservaController from "../controllers/reservas.controller.js";

const router = Router();

router.get('/obtenerReservasActivas', reservaController.getAllReservasActivos);
router.get('/obtenerReservas/user/:id', reservaController.getAllReservasByUser);
router.post('/registrar', reservaController.registrarReserva);
router.post('/cancelar', reservaController.cancelarReserva); 
router.post('/extender', reservaController.extenderReserva);
router.post('/finalizar', reservaController.finalizarReserva);

export default router;