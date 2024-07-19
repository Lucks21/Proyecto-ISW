import { agregarDia, eliminarDia, obtenerDias } from '../services/configuracion.services.js';
import Joi from 'joi';
import { agregarDiaDeshabilitadoSchema } from '../schema/configuracion.schema.js';

// Controlador para agregar un día deshabilitado
export const agregarDiaDeshabilitado = async (req, res) => {
  const { error } = agregarDiaDeshabilitadoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Formato de fecha inválido. Use DD-MM-YYYY.' });
  }

  try {
    const { fecha } = req.body;
    const resultado = await agregarDia(fecha);

    res.status(200).json({ message: resultado.message, data: resultado.configuracion });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el día deshabilitado.', error: error.message });
  }
};

// Controlador para eliminar un día deshabilitado
export const eliminarDiaDeshabilitado = async (req, res) => {
  const { error } = agregarDiaDeshabilitadoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Formato de fecha inválido. Use DD-MM-YYYY.' });
  }

  try {
    const { fecha } = req.body;
    const resultado = await eliminarDia(fecha);
    res.status(200).json({ message: 'Día deshabilitado eliminado con éxito.', data: resultado });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el día deshabilitado.', error: error.message });
  }
};

// Controlador para obtener todos los días deshabilitados
export const obtenerDiasDeshabilitados = async (req, res) => {
  try {
    const diasDeshabilitados = await obtenerDias();
    res.status(200).json({ message: 'Días deshabilitados obtenidos con éxito.', data: diasDeshabilitados });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los días deshabilitados.', error: error.message });
  }
};

export default {
  agregarDiaDeshabilitado,
  eliminarDiaDeshabilitado,
  obtenerDiasDeshabilitados,
};
