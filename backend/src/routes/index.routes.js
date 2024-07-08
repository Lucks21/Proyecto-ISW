"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Enrutador de usuarios  */
import userRoutes from "./user.routes.js";

/** Enrutador de autenticación */
import authRoutes from "./auth.routes.js";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import instalacionRoutes from './instalacion.routes.js';
import implementosRoutes from './implementos.routes.js';
import configuracionRoutes from './configuracion.routes.js';
import notificacionRoutes from './notificacion.routes.js';
import reservasRoutes from './reservas.routes.js';


const router = Router();
router.use("/implementos", authenticationMiddleware, implementosRoutes);
router.use("/users", authenticationMiddleware, userRoutes);
router.use("/auth", authRoutes);
router.use("/instalacion", authenticationMiddleware, instalacionRoutes);
router.use("/reservas", reservasRoutes);
router.use("/configuracion", authenticationMiddleware, configuracionRoutes);
router.use("/notificaciones", authenticationMiddleware, notificacionRoutes);


export default router;
