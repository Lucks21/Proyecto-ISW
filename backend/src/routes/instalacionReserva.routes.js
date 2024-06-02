import { Router } from 'express';
import instalacionReservaController from '../controllers/instalacionReserva.controller.js';

const router = Router();

router.post('/reservar-instalacion', instalacionReservaController.reservarInstalacion);
router.put('/cancelar-reserva/:id', instalacionReservaController.cancelarReserva);
router.put('/extender-reserva/:id', instalacionReservaController.extenderReserva);
router.put('/finalizar-reserva/:id', instalacionReservaController.finalizarReservaInstalacion);

export default router;
