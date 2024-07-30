import express from 'express';
import { agregarDiaDeshabilitado, eliminarDiaDeshabilitado, obtenerDiasDeshabilitados } from '../controllers/configuracion.controller.js';
import authenticationMiddleware from '../middlewares/authentication.middleware.js';
import verifyJWT from '../middlewares/authentication.middleware.js';
import { isAdmin, isEncargado } from '../middlewares/authorization.middleware.js';

const router = express.Router();

router.post('/crearDiaDeshabilitado', authenticationMiddleware, isEncargado, agregarDiaDeshabilitado);
router.delete('/eliminarDiaDeshabilitado', verifyJWT, isEncargado, eliminarDiaDeshabilitado);
router.get('/obtenerDiaDeshabilitado', verifyJWT, isEncargado, obtenerDiasDeshabilitados);

export default router;
