import express from 'express';
import { agregarDiaDeshabilitado, eliminarDiaDeshabilitado, obtenerDiasDeshabilitados } from '../controllers/configuracion.controller.js';
import { isEncargado } from '../middlewares/authorization.middleware.js';
const router = express.Router();

// Rutas protegidas por el middleware isEncargado
router.post('/dias-deshabilitados', isEncargado, agregarDiaDeshabilitado);
router.delete('/dias-deshabilitados/:fecha', isEncargado, eliminarDiaDeshabilitado);
router.get('/dias-deshabilitados', isEncargado, obtenerDiasDeshabilitados);

export default router;


