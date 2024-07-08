import { Router } from 'express';

import reservaController from "../controllers/reservas.controller.js";

const router = Router();

router.get('/obtenerReservasActivas', reservaController.getAllReservasActivos);
router.get('/obtenerReservas/user/:id', reservaController.getAllReservasByUser);
router.post('/registrarImplemento', reservaController.registrarReservaImplemento);
router.post('/registrarInstalacion', reservaController.registrarReservaInstalacion);
router.post('/cancelar', reservaController.cancelarReserva);
router.post('/extender', reservaController.extenderReserva);
router.post('/finalizar', reservaController.finalizarReserva);
router.get('/grafico', reservaController.obtenerDatosGraficos);

export default router;