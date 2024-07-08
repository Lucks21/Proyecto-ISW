import { respondSuccess, respondError } from "../utils/resHandler.js";
import { crearInstalacion, obtenerInstalaciones, obtenerInstalacionPorId, actualizarInstalacion, eliminarInstalacion } from '../services/instalacion.services.js';
import { crearInstalacionSchema, actualizarInstalacionSchema, idSchema } from '../schema/instalacion.schema.js';
import InstalacionService from "../services/instalacion.services.js";


// Controlador para crear una instalación
export const crearInstalacionController = async (req, res) => {
  const { error } = crearInstalacionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const resultado = await crearInstalacion(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error al crear la instalación.' });
  }
};

// Controlador para obtener todas las instalaciones
export const obtenerInstalacionesController = async (req, res) => {
  try {
    const resultado = await obtenerInstalaciones();
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error al obtener las instalaciones.' });
  }
};

// Controlador para obtener una instalación por ID
export const obtenerInstalacionPorIdController = async (req, res) => {
  const { id } = req.params;
  const { error } = idSchema.validate(id);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const resultado = await obtenerInstalacionPorId(id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ message: error.message || 'Error al obtener la instalación.' });
  }
};

// Controlador para actualizar una instalación
export const actualizarInstalacionController = async (req, res) => {
  const { id } = req.params;
  const { error: idError } = idSchema.validate(id);
  if (idError) {
    return res.status(400).json({ message: idError.details[0].message });
  }

  const { error: bodyError } = actualizarInstalacionSchema.validate(req.body);
  if (bodyError) {
    return res.status(400).json({ message: bodyError.details[0].message });
  }

  try {
    const resultado = await actualizarInstalacion(id, req.body);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ message: error.message || 'Error al actualizar la instalación.' });
  }
};

// Controlador para eliminar una instalación
export const eliminarInstalacionController = async (req, res) => {
  const { id } = req.params;
  const { error } = idSchema.validate(id);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const resultado = await eliminarInstalacion(id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ message: error.message || 'Error al eliminar la instalación.' });
  }
};
//Controlador para obtener todas las instalaciones Reservadas
async function getInstalacionesReservadas(req, res) { 

  try {
      const [instalacionesReservadas, error] = await InstalacionService.getInstalacionesReservadas();
      if (error) return respondError(req, res, 404, error);

      instalacionesReservadas.length === 0
          ? respondSuccess(req, res, 204)
          : respondSuccess(req, res, 200, instalacionesReservadas);

  } catch (error) {
      respondError(req, res, 500, "Error interno del servidor");
  }
};
//Controllador para obtener todas las instalaciones reservadas por ID

export default {
  getInstalacionesReservadas,
  getInstalacionesReservadasById,
};