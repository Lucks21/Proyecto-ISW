"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Controlador de usuarios */
import usuarioController from "../controllers/user.controller.js";

/** Middlewares de autorización */
import { isAdmin } from "../middlewares/authorization.middleware.js";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

/** Instancia del enrutador */
const router = Router();

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);
// Define las rutas para los usuarios
router.get("/obtener", isAdmin, usuarioController.getUsers);
router.post('/crear', isAdmin, usuarioController.createUser);
router.get("/obtener/:id", isAdmin, usuarioController.getUserById);
router.put("/actualizar/:id", isAdmin, usuarioController.updateUser);
router.delete("/eliminar/:id", isAdmin, usuarioController.deleteUser);

// Exporta el enrutador
export default router;
