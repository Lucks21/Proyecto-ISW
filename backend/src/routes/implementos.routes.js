import { Router } from 'express';
import implementosController from '../controllers/implementos.controller.js';

const router = Router();

router.post('/crearimplemento', implementosController.createImplemento);
router.put('/actualizarimplemento/:id', implementosController.updateImplemento);
router.delete('/eliminarimplemento/:id', implementosController.deleteImplemento);
router.get('/obtenerimplementos', implementosController.getImplementos);
router.get('/obtenerimplementos/prestados', implementosController.getImplementosPrestados);
router.get('/obtenerimplemento/:id', implementosController.getImplementoById);
//router.put('/actualizarimplemento/:id/damaged', implementosController.updatedImplementoDamaged);
export default router;



