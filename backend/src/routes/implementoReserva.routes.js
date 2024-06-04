import { Router } from "express";
import * as implementoReservaController from "../controllers/implementoReserva.controller.js";

const router = Router();

router.post("/reservar-implemento", implementoReservaController.registrarReservaImplemento);
router.delete("/cancelar-reserva/:id", implementoReservaController.cancelarReservaImplemento);
router.put("/extender-reserva/:id", implementoReservaController.extenderReservaImplemento);
router.put("/finalizar-reserva/:id", implementoReservaController.finalizarReservaImplemento);
router.post("/notificar", implementoReservaController.notificarDisponibilidadImplemento);

export default router;
