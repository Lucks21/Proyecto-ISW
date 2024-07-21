// backend/src/controllers/alumno.controller.js
import alumnoService from '../services/alumno.services.js';
import { crearAlumnoSchema, actualizarAlumnoSchema } from '../schema/alumno.schema.js';

export const crearAlumnoController = async (req, res) => {
  const { error } = crearAlumnoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Datos inválidos', error: error.message });
  }
  const { nombre, apellido, email, password, rut, reservasActivas, historialReservas } = req.body;
  try {
    const nuevoAlumno = await alumnoService.crearAlumno({ nombre, apellido, email, password, rut, reservasActivas, historialReservas });
    res.status(201).json(nuevoAlumno);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el alumno', error: error.message });
    console.log(error) //quiero ver el error
  }
};

export const obtenerAlumnosController = async (req, res) => {
  try {
    const alumnos = await alumnoService.obtenerAlumnos();
    res.status(200).json(alumnos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los alumnos', error });
  }
};

export const obtenerAlumnoPorIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const alumno = await alumnoService.obtenerAlumnoPorId(id);
    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    res.status(200).json(alumno);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el alumno', error });
  }
};

export const actualizarAlumnoController = async (req, res) => {
  const { error } = actualizarAlumnoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Datos inválidos', error: error.details });
  }
  const { id } = req.params;
  const { nombre, apellido, email, password, rut, reservasActivas, historialReservas } = req.body;
  try {
    const alumnoActualizado = await alumnoService.actualizarAlumno(id, { nombre, apellido, email, password, rut, reservasActivas, historialReservas });
    if (!alumnoActualizado) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    res.status(200).json(alumnoActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el alumno', error });
  }
};

export const eliminarAlumnoController = async (req, res) => {
  const { id } = req.params;
  try {
    const alumnoEliminado = await alumnoService.eliminarAlumno(id);
    if (!alumnoEliminado) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    res.status(200).json({ message: 'Alumno eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el alumno', error });
  }
};
export const obtenerAlumnoPorEmailController = async (req, res) => {
  const { email } = req.params;
  try {
    const alumno = await alumnoService.obtenerAlumnoPorEmail(email);
    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado' });
    }
    res.status(200).json(alumno);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el alumno', error });
  }
};
