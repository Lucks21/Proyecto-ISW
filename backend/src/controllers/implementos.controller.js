import { respondSuccess, respondError } from "../utils/resHandler.js";
import mongoose from 'mongoose';
import Implemento from '../models/implementos.model.js';
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
import { format } from 'date-fns';

// Función para formatear la fecha en DD-MM-YYYY
const formatearFecha = (fecha) => {
  return format(new Date(fecha), 'dd-MM-yyyy');
};

// Controlador para crear un implemento
export const crearImplementoController = async (req, res) => {
  try {
    const { error } = implementoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const resultado = await crearImplemento(req.body);
    resultado.fechaAdquisicion = formatearFecha(resultado.fechaAdquisicion);
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error al crear implemento:', error);
    res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};

// Controlador para obtener todos los implementos
export const obtenerImplementosController = async (req, res) => {
  try {
    const resultado = await obtenerImplementos();
    const resultadoFormateado = resultado.map(implemento => ({
      ...implemento._doc,
      fechaAdquisicion: formatearFecha(implemento.fechaAdquisicion)
    }));
    res.status(200).json(resultadoFormateado);
  } catch (error) {
    console.error('Error al obtener implementos:', error);
    res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};

// Controlador para obtener un implemento por ID
export const obtenerImplementoPorIdController = async (req, res) => {
  try {
    const resultado = await obtenerImplementoPorId(req.params.id);
    resultado.fechaAdquisicion = formatearFecha(resultado.fechaAdquisicion);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(`Error al obtener implemento con ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message || 'Error interno del servidor' });
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
    resultado.fechaAdquisicion = formatearFecha(resultado.fechaAdquisicion);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(`Error al actualizar implemento con ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};

// Controlador para actualizar un implemento parcialmente
export const actualizarImplementoParcialController = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    
    const resultado = await actualizarImplementoParcial(id, req.body);
    resultado.fechaAdquisicion = formatearFecha(resultado.fechaAdquisicion);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(`Error al actualizar parcialmente el implemento con ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};

// Controlador para eliminar un implemento
export const eliminarImplementoController = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'El ID es inválido. Por favor intente con un ID válido.' });
  }

  try {
    const resultado = await eliminarImplemento(req.params.id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(`Error al eliminar implemento con ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};

// Controlador para obtener el historial de modificaciones de un implemento
export const obtenerHistorialImplementoController = async (req, res) => {
  try {
    const resultado = await obtenerHistorialImplemento(req.params.id);
    const resultadoFormateado = resultado.map(historial => ({
      ...historial._doc,
      fechaModificacion: formatearFecha(historial.fechaModificacion)
    }));
    res.status(200).json(resultadoFormateado);
  } catch (error) {
    console.error(`Error al obtener el historial de implemento con ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};

// Controlador para obtener un implemento por nombre
export const obtenerImplementoPorNombreController = async (req, res) => {
  try {
    const { nombre } = req.params;
    const resultado = await obtenerImplementoPorNombre(nombre);
    resultado.fechaAdquisicion = formatearFecha(resultado.fechaAdquisicion);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(`Error al obtener implemento con nombre ${req.params.nombre}:`, error);
    res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};
