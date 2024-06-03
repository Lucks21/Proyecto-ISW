"use strict";

import { Router } from "express";
import danoController from "../controllers/dano.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

router.post("/registrar", authenticationMiddleware, danoController.registrarDano);
router.get("/obtener", authenticationMiddleware, danoController.obtenerDanos);

export default router;
