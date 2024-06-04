import { Router } from "express";
import * as instalacionReservaController from "../controllers/instalacionReserva.controller.js";

const router = Router();

router.get("/obtenerId", instalacionReservaController.obtenerIdsReservasInstalacion);
router.post("/reservarInstalacion", instalacionReservaController.registrarReservaInstalacion);
router.delete("/cancelar-reserva/:id", instalacionReservaController.cancelarReservaInstalacion);
router.put("/extender-reserva/:id", instalacionReservaController.extenderReservaInstalacion);
router.put("/finalizar-reserva/:id", instalacionReservaController.finalizarReservaInstalacion);

export default router;
