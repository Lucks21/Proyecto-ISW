// implementos.routes.js
import express from 'express';
import {
    obtenerImplementos,
    añadirImplemento,
    actualizarCantidadImplemento,
    eliminarImplemento
} from '../controllers/implementos.controller.js';

const router = express.Router();

// Obtener todos los implementos deportivos
router.get('/', obtenerImplementos);

// Añadir un nuevo implemento deportivo
router.post('/', añadirImplemento);

// Actualizar la cantidad de un implemento deportivo específico
router.patch('/:id', actualizarCantidadImplemento);

// Eliminar un implemento deportivo específico
router.delete('/:id', eliminarImplemento);

export default router;
