import Instalacion from '../models/Instalacion.model.js';
import levenshtein from 'js-levenshtein';
import { format } from 'date-fns';

// Función para normalizar el nombre
const normalizarNombre = (nombre) => {
  return nombre.toLowerCase().trim().replace(/\s+/g, '_');
};

// Función para verificar nombres similares permitiendo diferencias significativas como números
const esNombreSimilar = (nombre, nombreExistente) => {
  const distancia = levenshtein(nombre, nombreExistente);
  return distancia < 3 && !/\d/.test(nombreExistente) && !/\d/.test(nombre);
};

// Servicio para crear una instalación
export const crearInstalacion = async (datosInstalacion) => {
  const { nombre, descripcion, capacidad, horarioDisponibilidad } = datosInstalacion;

  // Normalizar el nombre
  const nombreNormalizado = normalizarNombre(nombre);

  // Verificar unicidad del nombre y similitud
  const instalacionesExistentes = await Instalacion.find();
  for (let instalacion of instalacionesExistentes) {
    if (esNombreSimilar(nombreNormalizado, instalacion.nombre)) {
      throw new Error('El nombre de la instalación es muy similar a uno existente.');
    }
  }

  try {
    const nuevaInstalacion = new Instalacion({
      nombre: nombreNormalizado,
      descripcion,
      capacidad,
      horarioDisponibilidad,
      estado: 'disponible' // Estado por defecto
    });

    await nuevaInstalacion.save();
    return { message: 'Instalación creada con éxito.', data: nuevaInstalacion };
  } catch (error) {
    if (error.code === 11000) {
      // Error de clave duplicada
      throw new Error('El nombre de la instalación ya existe. Por favor, elija otro nombre.');
    }
    throw error; // Lanzar otros errores no relacionados con clave duplicada
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
  const instalacionActual = await Instalacion.findById(id);
  if (!instalacionActual) {
    throw new Error('Instalación no encontrada.');
  }

  // Verificar unicidad del nombre y similitud si el nombre está siendo actualizado
  if (datosActualizados.nombre) {
    datosActualizados.nombre = normalizarNombre(datosActualizados.nombre);

    const instalacionesExistentes = await Instalacion.find();
    for (let instalacion of instalacionesExistentes) {
      if (esNombreSimilar(datosActualizados.nombre, instalacion.nombre) && instalacion._id.toString() !== id) {
        throw new Error('El nombre de la instalación es muy similar a uno existente.');
      }
    }
  }

  // Registrar todas las modificaciones en el historial
  const modificaciones = [];
  for (let clave in datosActualizados) {
    if (datosActualizados[clave] !== instalacionActual[clave]) {
      modificaciones.push({
        campo: clave,
        valorAnterior: instalacionActual[clave],
        valorNuevo: datosActualizados[clave],
        fecha: format(new Date(), 'dd-MM-yyyy'),
      });
    }
  }
  instalacionActual.historialModificaciones.push(...modificaciones);

  // Actualizar campos de la instalación
  Object.assign(instalacionActual, datosActualizados);
  await instalacionActual.save();

  return { message: 'Instalación actualizada con éxito.', data: instalacionActual };
};

// Servicio para actualizar una instalación parcialmente
export const actualizarInstalacionParcial = async (id, datosActualizados) => {
  const instalacionActual = await Instalacion.findById(id);
  if (!instalacionActual) {
    throw new Error('Instalación no encontrada.');
  }

  // Verificar unicidad del nombre y similitud si el nombre está siendo actualizado
  if (datosActualizados.nombre) {
    datosActualizados.nombre = normalizarNombre(datosActualizados.nombre);

    const instalacionesExistentes = await Instalacion.find();
    for (let instalacion of instalacionesExistentes) {
      if (esNombreSimilar(datosActualizados.nombre, instalacion.nombre) && instalacion._id.toString() !== id) {
        throw new Error('El nombre de la instalación es muy similar a uno existente.');
      }
    }
  }

  // Registrar todas las modificaciones en el historial
  const modificaciones = [];
  for (let clave in datosActualizados) {
    if (datosActualizados[clave] !== instalacionActual[clave]) {
      modificaciones.push({
        campo: clave,
        valorAnterior: instalacionActual[clave],
        valorNuevo: datosActualizados[clave],
        fecha: format(new Date(), 'dd-MM-yyyy'),
      });
    }
  }
  instalacionActual.historialModificaciones.push(...modificaciones);

  // Actualizar solo los campos que se pasen en el body
  Object.assign(instalacionActual, datosActualizados);
  await instalacionActual.save();

  return { message: 'Instalación actualizada con éxito.', data: instalacionActual };
};

// Servicio para eliminar una instalación
export const eliminarInstalacion = async (id) => {
  const instalacionEliminada = await Instalacion.findByIdAndDelete(id);
  if (!instalacionEliminada) {
    throw new Error('Instalación no encontrada.');
  }
  return { message: 'Instalación eliminada con éxito.' };
};

// Servicio para obtener el historial de modificaciones de una instalación
export const obtenerHistorialInstalacion = async (id) => {
  const instalacion = await Instalacion.findById(id).select('historialModificaciones nombre');
  if (!instalacion) {
    throw new Error('Instalación no encontrada.');
  }

  const historial = instalacion.historialModificaciones.map(mod => ({
    fecha: mod.fecha,
    mensaje: `La instalación '${instalacion.nombre}' ha tenido una modificación en el campo '${mod.campo}' de '${mod.valorAnterior}' a '${mod.valorNuevo}' el ${mod.fecha}`
  }));

  return { message: 'Historial obtenido con éxito.', data: historial };
};

export default {
  crearInstalacion,
  obtenerInstalaciones,
  obtenerInstalacionPorId,
  actualizarInstalacion,
  actualizarInstalacionParcial,
  eliminarInstalacion,
  obtenerHistorialInstalacion,
};
