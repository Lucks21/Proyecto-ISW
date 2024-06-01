const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamo.controller');
const authenticationMiddleware = require("../middlewares/authentication.middleware.js");

router.get('/prestamos/activos', authenticationMiddleware, prestamoController.getPréstamosActivos);
router.get('/usuarios/:userId/prestamos', authenticationMiddleware, prestamoController.getHistorialPréstamos);

module.exports = router;