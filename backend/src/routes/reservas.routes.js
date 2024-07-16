// backend/src/routes/reservas.routes.js
import { Router } from 'express';
import {
  registrarReservaImplemento,
  registrarReservaInstalacion,
  cancelarReserva,
  extenderReserva,
  getAllReservasByUser,
  getAllReservasActivos,
  obtenerDatosGraficos,
  getAllReservasActivosById
} from "../controllers/reservas.controller.js";
import { isEncargado, isAlumno } from '../middlewares/authorization.middleware.js';
import authenticationMiddleware from '../middlewares/authentication.middleware.js';

const router = Router();

router.get('/obtenerActivas', authenticationMiddleware, isEncargado, getAllReservasActivos);
router.get('/obtenerActivas/:recursoId/:recursoTipo', authenticationMiddleware, isEncargado, getAllReservasActivosById);
router.post('/registrarImplemento', authenticationMiddleware,  registrarReservaImplemento);
router.post('/registrarInstalacion', authenticationMiddleware,  registrarReservaInstalacion);
router.post('/cancelar', authenticationMiddleware, isAlumno, cancelarReserva);
router.post('/extender', authenticationMiddleware, isAlumno, extenderReserva);
router.get('/usuario/:id', authenticationMiddleware, isAlumno, getAllReservasByUser);
router.get('/grafico', authenticationMiddleware, isEncargado, obtenerDatosGraficos);

export default router;
