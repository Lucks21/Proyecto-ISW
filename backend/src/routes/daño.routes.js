import { Router } from "express";
import dañoController from "../controllers/daño.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

router.post("/registrar", authenticationMiddleware, dañoController.registrarDaño);

export default router;
