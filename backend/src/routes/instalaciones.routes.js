import { Router } from 'express';
import instalacionController from '../controllers/instalaciones.controller.js';

const router = Router();

router.post('/crearinstalacion', instalacionController.createInstalacion);
router.put('/actualizarinstalacion/:id', instalacionController.updateInstalacion);
router.delete('/eliminarinstalacion/:id', instalacionController.deleteInstalacion);
router.get('/obtenerinstalaciones', instalacionController.getInstalaciones);
router.get('/obtenerinstalaciones/prestadas', instalacionController.getInstalacionesPrestadas);
router.get('/obtenerinstalacion/:id', instalacionController.getInstalacionById);
//router.put('/actualizarinstalacion/:id/damaged', instalacionController.updatedInstalacionDamaged);
export default router;
