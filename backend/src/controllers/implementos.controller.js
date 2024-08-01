import {
  crearImplemento,
  obtenerImplementos,
  obtenerImplementoPorId,
  actualizarImplemento,
  actualizarImplementoParcial,
  eliminarImplemento,
  obtenerHistorialImplemento,
  obtenerImplementoPorNombre
} from '../services/implementos.services.js';
import { implementoSchema, actualizarImplementoSchema } from '../schema/implementos.schema.js';

// Controlador para crear un implemento
export const crearImplementoController = async (req, res) => {
  const { error } = implementoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const resultado = await crearImplemento(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error al crear el implemento.' });
  }
};

// Controlador para obtener todos los implementos
export const obtenerImplementosController = async (req, res) => {
  try {
    const resultado = await obtenerImplementos();
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error al obtener los implementos.' });
  }
};

// Controlador para obtener un implemento por ID
export const obtenerImplementoPorIdController = async (req, res) => {
  const { id } = req.params;
  const { error } = idSchema.validate(id);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const resultado = await obtenerImplementoPorId(id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ message: error.message || 'Error al obtener el implemento.' });
  }
};

// Controlador para actualizar un implemento
export const actualizarImplementoController = async (req, res) => {
  const { id } = req.params;
  const { error: idError } = idSchema.validate(id);
  if (idError) {
    return res.status(400).json({ message: idError.details[0].message });
  }

  const { error: bodyError } = actualizarImplementoSchema.validate(req.body);
  if (bodyError) {
    return res.status(400).json({ message: bodyError.details[0].message });
  }

  try {
    const resultado = await actualizarImplemento(id, req.body);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ message: error.message || 'Error al actualizar el implemento.' });
  }
};

// Controlador para actualizar parcialmente un implemento
export const actualizarImplementoParcialController = async (req, res) => {
  const { id } = req.params;
  const { error: idError } = idSchema.validate(id);
  if (idError) {
    return res.status(400).json({ message: idError.details[0].message });
  }

  const { error: bodyError } = actualizarImplementoSchema.validate(req.body);
  if (bodyError) {
    return res.status(400).json({ message: bodyError.details[0].message });
  }

  try {
    const resultado = await actualizarImplementoParcial(id, req.body);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ message: error.message || 'Error al actualizar parcialmente el implemento.' });
  }
};

// Controlador para eliminar un implemento
export const eliminarImplementoController = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'El ID es inválido. Por favor intente con un ID válido.' });
  }

  try {
    const resultado = await eliminarImplemento(req.params.id);
    return res.status(200).json(respondSuccess(req, res, 200, resultado));
  } catch (error) {
    console.error(`Error al eliminar implemento con ID ${req.params.id}:`, error);
    return res.status(500).json(respondError(req, res, 500, error.message || 'Error interno del servidor'));
  }
};

// Controlador para obtener el historial de modificaciones de un implemento
export const obtenerHistorialImplementoController = async (req, res) => {
  const { id } = req.params;
  const { error } = idSchema.validate(id);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const resultado = await obtenerHistorialImplemento(id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ message: error.message || 'Error al obtener el historial del implemento.' });
  }
};

// Controlador para obtener un implemento por nombre
export const obtenerImplementoPorNombreController = async (req, res) => {
  try {
    const { nombre } = req.params;
    const resultado = await obtenerImplementoPorNombre(nombre);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(`Error al obtener implemento con nombre ${req.params.nombre}:`, error);
    res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};
