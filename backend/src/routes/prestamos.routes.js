import { Router } from 'express';

import prestamoController from "../controllers/prestamos.controller.js";

const router = Router();

//router.get('/obtenerPrestamosActivos/instalaciones');
router.get('/obtenerPrestamosActivos', prestamoController.getAllPrestamosActivos);
router.get('/obtenerPrestamos/user/:id', prestamoController.getAllPrestamosByUser);


export default router;