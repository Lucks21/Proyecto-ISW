const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamoController');

router.get('/prestamos/activos', prestamoController.getPréstamosActivos);

router.get('/usuarios/:userId/prestamos', prestamoController.getHistorialPréstamos);

module.exports = router;
