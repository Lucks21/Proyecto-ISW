import { Router } from 'express';
import implementoReservaController from '../controllers/implementoReserva.controller.js';

const router = Router();

router.post('/reservar-implemento', implementoReservaController.reservarImplemento);
router.put('/cancelar-reserva/:id', implementoReservaController.cancelarReserva);
router.put('/extender-reserva/:id', implementoReservaController.extenderReserva);
router.put('/finalizar-reserva/:id', implementoReservaController.finalizarReserva);

export default router;