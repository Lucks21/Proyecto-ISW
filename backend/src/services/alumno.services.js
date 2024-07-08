import Alumno from '../models/alumno.model.js';
import { format } from 'date-fns';
import levenshtein from 'js-levenshtein';

// Función para normalizar el nombre
const normalizarNombre = (nombre) => {
  return nombre.toLowerCase().trim().replace(/\s+/g, ' ');
};

// Función para verificar nombres similares permitiendo diferencias significativas como números
const esNombreSimilar = (nombre, nombreExistente) => {
  const distancia = levenshtein(nombre, nombreExistente);
  return distancia < 3 && !/\d/.test(nombreExistente) && !/\d/.test(nombre);
};

// Servicio para crear un alumno
export const crearAlumno = async (datosAlumno) => {
  const { rut, contraseña, nombre, correoElectronico } = datosAlumno;

  // Verificar unicidad del correo por RUT
  const alumnoExistente = await Alumno.findOne({ correoElectronico });
  if (alumnoExistente && alumnoExistente.rut !== rut) {
    throw new Error('El correo electrónico ya está en uso con otro RUT.');
  }

  const nuevoAlumno = new Alumno({
    rut,
    contraseña,
    nombre,
    correoElectronico,
  });

  await nuevoAlumno.save();
  return { message: 'Alumno creado con éxito.', data: nuevoAlumno };
};

// Servicio para obtener todos los alumnos
export const obtenerAlumnos = async () => {
  const alumnos = await Alumno.find();
  return { message: 'Alumnos obtenidos con éxito.', data: alumnos };
};

// Servicio para obtener un alumno por ID
export const obtenerAlumnoPorId = async (id) => {
  const alumno = await Alumno.findById(id);
  if (!alumno) {
    throw new Error('Alumno no encontrado.');
  }
  return { message: 'Alumno obtenido con éxito.', data: alumno };
};

// Servicio para actualizar un alumno
export const actualizarAlumno = async (id, datosActualizados) => {
  const { correoElectronico, rut } = datosActualizados;

  // Verificar unicidad del correo por RUT si se está actualizando
  if (correoElectronico) {
    const alumnoExistente = await Alumno.findOne({ correoElectronico });
    if (alumnoExistente && alumnoExistente._id.toString() !== id) {
      throw new Error('El correo electrónico ya está en uso con otro RUT.');
    }
  }

  const alumnoActualizado = await Alumno.findByIdAndUpdate(id, datosActualizados, { new: true });
  if (!alumnoActualizado) {
    throw new Error('Alumno no encontrado.');
  }
  return { message: 'Alumno actualizado con éxito.', data: alumnoActualizado };
};

// Servicio para eliminar un alumno
export const eliminarAlumno = async (id) => {
  const alumnoEliminado = await Alumno.findByIdAndDelete(id);
  if (!alumnoEliminado) {
    throw new Error('Alumno no encontrado.');
  }
  return { message: 'Alumno eliminado con éxito.' };
};
