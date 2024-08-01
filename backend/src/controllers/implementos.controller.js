import { respondSuccess, respondError } from "../utils/resHandler.js";
import mongoose from 'mongoose';
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
  try {
    const { error } = implementoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ errors: error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {}), message: 'Error de validación' });
    }

    const resultado = await crearImplemento(req.body);
    return res.status(201).json(respondSuccess(req, res, 201, resultado));
  } catch (error) {
    console.error('Error al crear implemento:', error);
    return res.status(500).json(respondError(req, res, 500, error.message || 'Error interno del servidor'));
  }
};


// Controlador para obtener todos los implementos
export const obtenerImplementosController = async (req, res) => {
  try {
    const resultado = await obtenerImplementos();
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al obtener implementos:', error);
    res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};

// Controlador para obtener un implemento por ID
export const obtenerImplementoPorIdController = async (req, res) => {
  try {
    const resultado = await obtenerImplementoPorId(req.params.id);
    return res.status(200).json(respondSuccess(resultado));
  } catch (error) {
    console.error(`Error al obtener implemento con ID ${req.params.id}:`, error);
    return res.status(500).json(respondError(error.message || 'Error interno del servidor'));
  }
};

// Controlador para actualizar un implemento
export const actualizarImplementoController = async (req, res) => {
  try {
    const { error } = actualizarImplementoSchema.validate(req.body, { allowUnknown: true, stripUnknown: true });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const resultado = await actualizarImplemento(req.params.id, req.body);
    return res.status(200).json(respondSuccess(resultado));
  } catch (error) {
    console.error(`Error al actualizar implemento con ID ${req.params.id}:`, error);
    return res.status(500).json(respondError(error.message || 'Error interno del servidor'));
  }
};

// Controlador para actualizar parcialmente un implemento
export const actualizarImplementoParcialController = async (req, res) => {
  try {
    const { error } = actualizarImplementoSchema.validate(req.body, { allowUnknown: true, stripUnknown: true });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const resultado = await actualizarImplementoParcial(req.params.id, req.body);
    return res.status(200).json(respondSuccess(resultado));
  } catch (error) {
    console.error(`Error al actualizar parcialmente el implemento con ID ${req.params.id}:`, error);
    return res.status(500).json(respondError(error.message || 'Error interno del servidor'));
  }
};

// Controlador para eliminar un implemento
export const eliminarImplementoController = async (req, res) => {
  const { id } = req.params;
  const { error } = idSchema.validate(id);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const resultado = await eliminarImplemento(id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ message: error.message || 'Error al eliminar el implemento.' });
  }
};

// Controlador para obtener el historial de modificaciones de un implemento
export const obtenerHistorialImplementoController = async (req, res) => {
  try {
    const resultado = await obtenerHistorialImplemento(req.params.id);
    return res.status(200).json(respondSuccess(resultado));
  } catch (error) {
    console.error(`Error al obtener el historial de implemento con ID ${req.params.id}:`, error);
    return res.status(500).json(respondError(error.message || 'Error interno del servidor'));
  }
};

// Controlador para obtener un implemento por nombre
export const obtenerImplementoPorNombreController = async (req, res) => {
  try {
    const { nombre } = req.params;
    const resultado = await obtenerImplementoPorNombre(nombre);
    return res.status(200).json(respondSuccess(resultado));
  } catch (error) {
    console.error(`Error al obtener implemento con nombre ${req.params.nombre}:`, error);
    return res.status(500).json(respondError(error.message || 'Error interno del servidor'));
  }
};
