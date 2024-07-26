import express from 'express';
import { 
  obtenerInstalacionPorNombreController,
  crearInstalacionController, 
  obtenerInstalacionesController, 
  obtenerInstalacionPorIdController, 
  actualizarInstalacionController, 
  actualizarInstalacionParcialController, // Añadido
  eliminarInstalacionController,
  obtenerHistorialInstalacionController 
} from '../controllers/instalacion.controller.js';
import authenticationMiddleware from '../middlewares/authentication.middleware.js';
import { isEncargado } from '../middlewares/authorization.middleware.js';

const router = express.Router();

router.post('/crear', authenticationMiddleware, isEncargado, crearInstalacionController);
router.get('/obtener', authenticationMiddleware, obtenerInstalacionesController);
router.get('/obtener/:id', authenticationMiddleware, isEncargado, obtenerInstalacionPorIdController);
router.put('/actualizar/:id', authenticationMiddleware, isEncargado, actualizarInstalacionController);
router.patch('/actualizarParcial/:id', authenticationMiddleware, isEncargado, actualizarInstalacionParcialController); 
router.delete('/eliminar/:id', authenticationMiddleware, isEncargado, eliminarInstalacionController);
router.get('/obtenerByNombre/:nombre', authenticationMiddleware, isEncargado, obtenerInstalacionPorNombreController);
router.get('/historial/:id', authenticationMiddleware, isEncargado, obtenerHistorialInstalacionController); 

export default router;
