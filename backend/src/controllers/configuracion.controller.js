import { agregarDia, eliminarDia, obtenerDias } from '../services/configuracion.services.js';
import Joi from 'joi';
import { agregarDiaDeshabilitadoSchema } from '../schema/configuracion.schema.js';
import { format } from 'date-fns'; // Asegúrate de que esta importación está presente

// Función para formatear la fecha en DD-MM-YYYY
const formatearFecha = (fecha) => {
  return format(fecha, 'dd-MM-yyyy');
};

// Controlador para agregar un día deshabilitado
export const agregarDiaDeshabilitado = async (req, res) => {
  const { error } = agregarDiaDeshabilitadoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Formato de fecha inválido. Use DD-MM-YYYY.' });
  }

  try {
    const { fecha } = req.body;
    const resultado = await agregarDia(fecha);

    // Formatear fechas en la respuesta
    const diasDeshabilitadosFormateados = resultado.configuracion.diasDeshabilitados.map(dia => formatearFecha(dia));

    res.status(200).json({ message: resultado.message, data: { ...resultado.configuracion._doc, diasDeshabilitados: diasDeshabilitadosFormateados } });
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

    // Formatear fechas en la respuesta
    const diasDeshabilitadosFormateados = resultado.configuracion.diasDeshabilitados.map(dia => formatearFecha(dia));

    res.status(200).json({ message: 'Día deshabilitado eliminado con éxito.', data: { ...resultado.configuracion._doc, diasDeshabilitados: diasDeshabilitadosFormateados } });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el día deshabilitado.', error: error.message });
  }
};

// Controlador para obtener todos los días deshabilitados
export const obtenerDiasDeshabilitados = async (req, res) => {
  try {
    const diasDeshabilitados = await obtenerDias();

    // Formatear fechas en la respuesta
    const diasDeshabilitadosFormateados = diasDeshabilitados.map(dia => formatearFecha(dia));

    res.status(200).json({ message: 'Días deshabilitados obtenidos con éxito.', data: diasDeshabilitadosFormateados });
  } catch (error) {
    res.status (500).json({ message: 'Error al obtener los días deshabilitados.', error: error.message });
  }
};

export default {
  agregarDiaDeshabilitado,
  eliminarDiaDeshabilitado,
  obtenerDiasDeshabilitados,
};
