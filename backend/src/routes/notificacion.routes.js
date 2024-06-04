import { Router } from "express";
import { solicitarNotificacion } from "../controllers/notificacion.controller.js";
const router = Router();

router.post("/solicitar-notificacion", solicitarNotificacion);

export default router;
