const { Router } = require('express');
const notificacionController = require('../controllers/notificacion.controller.js');

const router = Router();

router.post('/solicitar-notificacion', notificacionController.solicitarNotificacion);

module.exports = router;