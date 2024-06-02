const Reserva = require('../models/reserva.model');
const { respondSuccess, respondError } = require("../utils/resHandler.js");

// Obtener préstamos activos
exports.getPréstamosActivos = async (req, res) => {
  try {
    const préstamosActivos = await Reserva.find({ estado: 'disponible' });
    respondSuccess(req, res, 200, préstamosActivos); //res contiene informacion sobre la solicitud, res se utiliza para enviar una respuesta
  } catch (error) {
    respondError(req, res, 500, 'Hubo un error al obtener los préstamos activos.');
  }
};

// Obtener historial de préstamos de un alumno
exports.getHistorialPréstamos = async (req, res) => {
  const { userId } = req.params;
  try {
    const historialPréstamos = await Reserva.find({ usuarioId: userId, estado: { $ne: 'disponible' } });
    respondSuccess(req, res, 200, historialPréstamos);
  } catch (error) {
    respondError(req, res, 500, 'Hubo un error al obtener el historial de préstamos.');
  }
};
