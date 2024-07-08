import mongoose from 'mongoose';
import {
  crearAlumno,
  obtenerAlumnos,
  obtenerAlumnoPorId,
  actualizarAlumno,
  eliminarAlumno
} from '../services/alumno.services.js';
import { crearAlumnoSchema, actualizarAlumnoSchema } from '../schema/alumno.schema.js';

// Controlador para crear un alumno
export const crearAlumnoController = async (req, res) => {
  try {
    const { error } = crearAlumnoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const resultado = await crearAlumno(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Error al crear alumno:', error);
    res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};

// Controlador para obtener todos los alumnos
export const obtenerAlumnosController = async (req, res) => {
  try {
    const resultado = await obtenerAlumnos();
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al obtener alumnos:', error);
    res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};

// Controlador para obtener un alumno por ID
export const obtenerAlumnoPorIdController = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'El ID es inválido. Por favor intente con un ID válido.' });
  }

  try {
    const resultado = await obtenerAlumnoPorId(req.params.id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(`Error al obtener alumno con ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};

// Controlador para actualizar un alumno
export const actualizarAlumnoController = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'El ID es inválido. Por favor intente con un ID válido.' });
  }

  try {
    const { error } = actualizarAlumnoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const resultado = await actualizarAlumno(req.params.id, req.body);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(`Error al actualizar alumno con ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};

// Controlador para eliminar un alumno
export const eliminarAlumnoController = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'El ID es inválido. Por favor intente con un ID válido.' });
  }

  try {
    const resultado = await eliminarAlumno(req.params.id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(`Error al eliminar alumno con ID ${req.params.id}:`, error);
    res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};
