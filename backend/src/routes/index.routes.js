"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Enrutador de usuarios  */
import userRoutes from "./user.routes.js";

/** Enrutador de autenticación */
import authRoutes from "./auth.routes.js";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import instalacionRoutes from "./instalaciones.routes.js";
import implementosRoutes from "./implementos.routes.js";
import prestamoRoutes from "./prestamo.routes.js";
import instalacionReservaRoutes from "./instalacionReserva.routes.js";
import notificacionRoutes from "./notificacion.routes.js";
import implementosReservaRoutes from "./implementoReserva.routes.js";

/** Instancia del enrutador */
const router = Router();
// Define las rutas para los implementos /api/implementos
router.use("/implementos", authenticationMiddleware, implementosRoutes);
// Define las rutas para los usuarios /api/usuarios
router.use("/users", authenticationMiddleware, userRoutes);
// Define las rutas para la autenticación /api/auth
router.use("/auth", authRoutes);
router.use("/prestamos", authenticationMiddleware, prestamoRoutes);
router.use("/instalacion", authenticationMiddleware, instalacionRoutes);
router.use("/instalacionReserva", authenticationMiddleware, instalacionReservaRoutes);
router.use("/notificacion", authenticationMiddleware, notificacionRoutes);
router.use("/implementosReserva", authenticationMiddleware, implementosReservaRoutes);
// Exporta el enrutador
export default router;
