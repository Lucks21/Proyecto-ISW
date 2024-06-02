import { Router } from 'express';
import instalacionController from '../controllers/instalaciones.controller.js';

const router = Router();

router.post('/crearinstalacion', instalacionController.createInstalacion);
router.put('/actualizarinstalacion/:id', instalacionController.updateInstalacion);
router.delete('/eliminarinstalacion', instalacionController.deleteInstalacion);
router.get('/obtenerinstalaciones', instalacionController.getInstalaciones);
router.get('/obtenerinstalacion/:id', instalacionController.getInstalacionById);

export default router;
