const Reserva = require('../models/reserva.model');
const { respondSuccess, respondError } = require("../utils/resHandler.js");
const PrestamoService = require("../services/prestamo.service.js");

// Obtener préstamos activos
exports.getPréstamosActivos = async (req, res) => {
  try {
    const [prestamosActivos, error] = await PrestamoService.obtenerPrestamosActivos();
    if (error) return respondError(req, res, 500, error);
    respondSuccess(req, res, 200, prestamosActivos);
  } catch (error) {
    respondError(req, res, 500, 'Hubo un error al obtener los préstamos activos.');
  }
};

// Obtener historial de préstamos de un alumno
exports.getHistorialPréstamos = async (req, res) => {
  const { userId } = req.params;
  try {
    const [historialPrestamos, error] = await PrestamoService.obtenerHistorialPrestamos(userId);
    if (error) return respondError(req, res, 500, error);
    respondSuccess(req, res, 200, historialPrestamos);
  } catch (error) {
    respondError(req, res, 500, 'Hubo un error al obtener el historial de préstamos.');
  }
};
