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
import Alumno from "../routes/alumno.routes.js";
import cronAuthMiddleware from "../middlewares/cronAuth.middleware.js"
import {finalizarReservasExpiradas} from "../controllers/reservas.controller.js";
import notificacionController from '../controllers/notificacion.controller.js'

const router = Router();
router.use("/implementos", authenticationMiddleware, implementosRoutes);
router.use("/users", authenticationMiddleware, userRoutes);
router.use("/auth", authRoutes);
router.use("/instalacion", authenticationMiddleware, instalacionRoutes);
router.use("/reservas",authenticationMiddleware, reservasRoutes);
//CronJobs
router.get("/finalizarReservasExpiradas",cronAuthMiddleware, finalizarReservasExpiradas);
router.post('/notificarImplemento',cronAuthMiddleware, notificacionController.notificarDisponibilidadImplemento);
router.post('/notificarInstalacion',cronAuthMiddleware, notificacionController.notificarDisponibilidadInstalacion);

router.use("/configuracion", authenticationMiddleware, configuracionRoutes);
router.use("/notificaciones", authenticationMiddleware, notificacionRoutes);
router.use("/alumno", Alumno);

export default router;
