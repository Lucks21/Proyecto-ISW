import Instalacion from '../models/Instalacion.model.js';
import levenshtein from 'js-levenshtein';

// Función para normalizar el nombre
const normalizarNombre = (nombre) => {
  return nombre.toLowerCase().trim().replace(/\s+/g, ' ');
};

// Función para verificar similaridad
const esNombreSimilar = (nuevoNombre, nombreExistente) => {
  const baseNuevoNombre = nuevoNombre.replace(/\d+$/, '').trim();
  const baseNombreExistente = nombreExistente.replace(/\d+$/, '').trim();
  const distancia = levenshtein(baseNuevoNombre, baseNombreExistente);
  return distancia < 3 && baseNuevoNombre !== baseNombreExistente;
};

// Servicio para crear una instalación
export const crearInstalacion = async (datosInstalacion) => {
  const { nombre, descripcion, capacidad, fechaAdquisicion, horarioDisponibilidad } = datosInstalacion;

  // Validar capacidad
  if (capacidad <= 0) {
    throw new Error('La capacidad debe ser un número positivo.');
  }

  // Validar fecha de adquisición
  const fechaActual = new Date();
  if (new Date(fechaAdquisicion) > fechaActual) {
    throw new Error('La fecha de adquisición no puede ser una fecha futura.');
  }

  // Normalizar el nombre
  const nombreNormalizado = normalizarNombre(nombre);

  // Verificar unicidad del nombre y similaridad
  const instalacionesExistentes = await Instalacion.find();
  for (let instalacion of instalacionesExistentes) {
    if (esNombreSimilar(nombreNormalizado, instalacion.nombre)) {
      throw new Error('El nombre de la instalación es muy similar a uno existente.');
    }
  }

  const nuevaInstalacion = new Instalacion({
    nombre: nombreNormalizado,
    descripcion,
    capacidad,
    fechaAdquisicion,
    horarioDisponibilidad,
    estado: 'disponible' // Estado por defecto
  });

  try {
    await nuevaInstalacion.save();
    return { message: 'Instalación creada con éxito.', data: nuevaInstalacion };
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('El nombre de la instalación ya está en uso. Por favor, elija un nombre diferente.');
    }
    throw new Error(error.message || 'Error al crear la instalación.');
  }
};

// Servicio para obtener todas las instalaciones
export const obtenerInstalaciones = async () => {
  const instalaciones = await Instalacion.find();
  return { message: 'Instalaciones obtenidas con éxito.', data: instalaciones };
};

// Servicio para obtener una instalación por ID
export const obtenerInstalacionPorId = async (id) => {
  const instalacion = await Instalacion.findById(id);
  if (!instalacion) {
    throw new Error('Instalación no encontrada.');
  }
  return { message: 'Instalación obtenida con éxito.', data: instalacion };
};

// Servicio para actualizar una instalación
export const actualizarInstalacion = async (id, datosActualizados) => {
  // Si el nombre está siendo actualizado, normalizar y verificar unicidad
  if (datosActualizados.nombre) {
    datosActualizados.nombre = normalizarNombre(datosActualizados.nombre);
    const instalacionExistente = await Instalacion.findOne({ nombre: datosActualizados.nombre });
    if (instalacionExistente && instalacionExistente._id.toString() !== id) {
      throw new Error('El nombre de la instalación ya está en uso.');
    }
  }

  const instalacionActualizada = await Instalacion.findByIdAndUpdate(id, datosActualizados, { new: true });
  if (!instalacionActualizada) {
    throw new Error('Instalación no encontrada.');
  }
  return { message: 'Instalación actualizada con éxito.', data: instalacionActualizada };
};

// Servicio para eliminar una instalación
export const eliminarInstalacion = async (id) => {
  const instalacionEliminada = await Instalacion.findByIdAndDelete(id);
  if (!instalacionEliminada) {
    throw new Error('Instalación no encontrada.');
  }
  return { message: 'Instalación eliminada con éxito.' };
};
