import { Router } from 'express';

import reservaController from "../controllers/reservas.controller.js";

const router = Router();

router.get('/obtenerReservasActivas', reservaController.getAllReservasActivos);
router.get('/obtenerReservas/user/:id', reservaController.getAllReservasByUser);


export default router;