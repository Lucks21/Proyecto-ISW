import express from "express";
const router = express.Router();

import prestamoController from "../controllers/prestamo.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

router.get("/prestamos/activos", authenticationMiddleware, prestamoController.getPrestamosActivos);
router.get("/usuarios/:userId/prestamos", authenticationMiddleware, prestamoController.getHistorialPrestamos);
export default router;
