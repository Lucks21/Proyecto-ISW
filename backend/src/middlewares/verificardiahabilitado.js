import Configuracion from '../models/configuracion.model.js';
import { parse, isValid } from 'date-fns';

const verificarDiaHabilitado = async (req, res, next) => {
  try {
    const { fechaInicio } = req.body;

    // Parsear y validar la fecha de inicio de la reserva
    const parsedFechaInicio = parse(fechaInicio, 'dd-MM-yyyy', new Date());
    if (!isValid(parsedFechaInicio)) {
      return res.status(400).json({ message: 'La fecha de inicio no es válida.' });
    }

    const configuracion = await Configuracion.findOne();
    if (configuracion) {
      const diaReserva = new Date(parsedFechaInicio.getFullYear(), parsedFechaInicio.getMonth(), parsedFechaInicio.getDate()); // Ignorar la hora
      const deshabilitado = configuracion.diasDeshabilitados.some(dia => dia.getTime() === diaReserva.getTime());

      if (deshabilitado) {
        return res.status(403).json({ message: 'El sistema no permite arriendos en la fecha seleccionada.' });
      }
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar la configuración.', error });
  }
};

export default verificarDiaHabilitado;
