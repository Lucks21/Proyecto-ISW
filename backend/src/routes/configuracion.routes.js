import express from 'express';
import { agregarDiaDeshabilitado, eliminarDiaDeshabilitado, obtenerDiasDeshabilitados } from '../controllers/configuracion.controller.js';
import verifyJWT from '../middlewares/authentication.middleware.js';
import { isAdmin, isEncargado,  } from '../middlewares/authorization.middleware.js';

const router = express.Router();

router.post('/crear-deshabilitados', verifyJWT, isEncargado, agregarDiaDeshabilitado);
router.delete('/dias-deshabilitados/:fecha', verifyJWT, isEncargado, eliminarDiaDeshabilitado);
router.get('/dias-deshabilitados', verifyJWT, obtenerDiasDeshabilitados);

export default router;
