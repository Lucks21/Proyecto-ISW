const Reserva = require('../models/reserva.model');

// Obtener préstamos activos
exports.getPréstamosActivos = async (req, res) => {
  try {
    const préstamosActivos = await Reserva.find({ estado: 'disponible' }); // es para buscar todas las reservas que estén activas en reserva.model
    res.json(préstamosActivos); //retorna las reservas encontradas
  } catch (error) {
    console.error(error); //Muestra un error
    res.status(500).json({ message: 'Hubo un error al obtener los préstamos activos.' });
  }
};

// Obtener historial de préstamos de un alumno
exports.getHistorialPréstamos = async (req, res) => {
  const { userId } = req.params;
  try {
    const historialPréstamos = await Reserva.find({ usuarioId: userId, estado: { $ne: 'disponible' } });
    res.json(historialPréstamos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al obtener el historial de préstamos.' });
  }
};