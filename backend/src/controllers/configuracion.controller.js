import { agregarDia, eliminarDia, obtenerDias } from '../services/configuracion.services.js';
import { agregarDiaDeshabilitadoSchema } from '../schema/configuracion.schema.js';

export const agregarDiaDeshabilitado = async (req, res) => {
  const { error } = agregarDiaDeshabilitadoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { fecha } = req.body;
    const resultado = await agregarDia(fecha);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error al agregar el día deshabilitado.', error });
  }
};

export const eliminarDiaDeshabilitado = async (req, res) => {
  try {
    const { fecha } = req.params;
    const resultado = await eliminarDia(fecha);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error al eliminar el día deshabilitado.', error });
  }
};

export const obtenerDiasDeshabilitados = async (req, res) => {
  try {
    const resultado = await obtenerDias();
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los días deshabilitados.', error });
  }
};
