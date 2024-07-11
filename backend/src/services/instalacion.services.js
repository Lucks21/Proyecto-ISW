import { format } from 'date-fns';
import Instalacion from '../models/Instalacion.model.js';
import levenshtein from 'js-levenshtein';

const normalizarNombre = (nombre) => {
  return nombre.toLowerCase().trim().replace(/\s+/g, ' ');
};

const esNombreSimilar = (nombre, nombreExistente) => {
  const distancia = levenshtein(nombre, nombreExistente);
  return distancia < 3 && !/\d/.test(nombreExistente) && !/\d/.test(nombre);
};

const validarHorarios = (horarioDisponibilidad) => {
  const horariosPorDia = {};

  horarioDisponibilidad.forEach(item => {
    if (!horariosPorDia[item.dia]) {
      horariosPorDia[item.dia] = [];
    }
    const inicioHora = parseInt(item.inicio.replace(':', ''), 10);
    const finHora = parseInt(item.fin.replace(':', ''), 10);

    if (inicioHora >= finHora) {
      throw new Error(`La hora de inicio (${item.inicio}) no puede ser mayor o igual que la hora de fin (${item.fin}) para el día ${item.dia}.`);
    }

    horariosPorDia[item.dia].push({
      inicio: inicioHora,
      fin: finHora
    });
  });

  for (const dia in horariosPorDia) {
    const horarios = horariosPorDia[dia];
    for (let i = 0; i < horarios.length; i++) {
      for (let j = i + 1; j < horarios.length; j++) {
        if ((horarios[i].inicio < horarios[j].fin && horarios[i].fin > horarios[j].inicio) ||
            (horarios[j].inicio < horarios[i].fin && horarios[j].fin > horarios[i].inicio)) {
          throw new Error(`No puede haber horarios superpuestos para el mismo día: ${dia}.`);
        }
      }
    }
  }
};

export const crearInstalacion = async (datosInstalacion) => {
  const { nombre, descripcion, fechaAdquisicion, horarioDisponibilidad, categoria } = datosInstalacion;

  // Normalizar el nombre
  const nombreNormalizado = normalizarNombre(nombre);

  // Verificar unicidad del nombre y similitud
  const instalacionesExistentes = await Instalacion.find();
  for (let instalacion of instalacionesExistentes) {
    if (esNombreSimilar(nombreNormalizado, instalacion.nombre)) {
      throw new Error('El nombre de la instalación es muy similar a uno existente.');
    }
  }

  // Validar que no haya días duplicados ni horarios solapados
  if (horarioDisponibilidad) {
    validarHorarios(horarioDisponibilidad);
  }

  try {
    const nuevaInstalacion = new Instalacion({
      nombre: nombreNormalizado,
      descripcion,
      fechaAdquisicion,
      categoria,
      horarioDisponibilidad,
      estado: 'disponible' // Establecer estado predeterminado
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

export const obtenerInstalaciones = async () => {
  const instalaciones = await Instalacion.find();
  return { message: 'Instalaciones obtenidas con éxito.', data: instalaciones };
};

export const obtenerInstalacionPorId = async (id) => {
  const instalacion = await Instalacion.findById(id);
  if (!instalacion) {
    throw new Error('Instalación no encontrada.');
  }
  return { message: 'Instalación obtenida con éxito.', data: instalacion };
};

export const actualizarInstalacion = async (id, datosActualizados) => {
  const instalacionActual = await Instalacion.findById(id);
  if (!instalacionActual) {
    throw new Error('Instalación no encontrada.');
  }

  // Eliminar cualquier intento de modificar el historial de modificaciones
  delete datosActualizados.historialModificaciones;

  // Verificar si el nombre está siendo actualizado, normalizar y verificar unicidad
  if (datosActualizados.nombre) {
    datosActualizados.nombre = normalizarNombre(datosActualizados.nombre);

    const instalacionesExistentes = await Instalacion.find();
    for (let instalacion of instalacionesExistentes) {
      if (esNombreSimilar(datosActualizados.nombre, instalacion.nombre) && instalacion._id.toString() !== id) {
        throw new Error('El nombre de la instalación es muy similar a uno existente.');
      }
    }
  }

  // Validar que no haya días duplicados ni horarios solapados en el horario de disponibilidad
  if (datosActualizados.horarioDisponibilidad) {
    validarHorarios(datosActualizados.horarioDisponibilidad);
  }

  // Registrar modificaciones en el historial
  const modificaciones = [];
  for (let clave in datosActualizados) {
    if (datosActualizados[clave] !== instalacionActual[clave]) {
      let motivo = null;
      if ((clave === 'estado' || clave === 'cantidad') && datosActualizados.motivo) {
        motivo = datosActualizados.motivo;
      }

      modificaciones.push({
        campo: clave,
        valorAnterior: instalacionActual[clave],
        valorNuevo: datosActualizados[clave],
        fecha: format(new Date(), 'dd-MM-yyyy'),
        motivo: motivo
      });
    }
  }

  // Actualizar campos de la instalación
  Object.assign(instalacionActual, datosActualizados);
  instalacionActual.historialModificaciones.push(...modificaciones);

  await instalacionActual.save();

  return { message: 'Instalación actualizada con éxito.', data: instalacionActual };
};

export const actualizarInstalacionParcial = async (id, datosActualizados) => {
  const instalacionActual = await Instalacion.findById(id);
  if (!instalacionActual) {
    throw new Error('Instalación no encontrada.');
  }

  // Eliminar cualquier intento de modificar el historial de modificaciones
  delete datosActualizados.historialModificaciones;

  // Verificar si el nombre está siendo actualizado, normalizar y verificar unicidad
  if (datosActualizados.nombre) {
    datosActualizados.nombre = normalizarNombre(datosActualizados.nombre);

    const instalacionesExistentes = await Instalacion.find();
    for (let instalacion of instalacionesExistentes) {
      if (esNombreSimilar(datosActualizados.nombre, instalacion.nombre) && instalacion._id.toString() !== id) {
        throw new Error('El nombre de la instalación es muy similar a uno existente.');
      }
    }
  }

  // Validar que no haya días duplicados ni horarios solapados en el horario de disponibilidad
  if (datosActualizados.horarioDisponibilidad) {
    validarHorarios(datosActualizados.horarioDisponibilidad);
  }

  // Registrar modificaciones en el historial
  const modificaciones = [];
  for (let clave in datosActualizados) {
    if (datosActualizados[clave] !== instalacionActual[clave]) {
      let motivo = null;
      if ((clave === 'estado' || clave === 'cantidad') && datosActualizados.motivo) {
        motivo = datosActualizados.motivo;
      }

      modificaciones.push({
        campo: clave,
        valorAnterior: instalacionActual[clave],
        valorNuevo: datosActualizados[clave],
        fecha: format(new Date(), 'dd-MM-yyyy'),
        motivo: motivo
      });
    }
  }

  // Actualizar solo los campos que se pasen en el body
  Object.assign(instalacionActual, datosActualizados);
  instalacionActual.historialModificaciones.push(...modificaciones);

  await instalacionActual.save();

  return { message: 'Instalación actualizada con éxito.', data: instalacionActual };
};

export const eliminarInstalacion = async (id) => {
  const instalacionEliminada = await Instalacion.findByIdAndDelete(id);
  if (!instalacionEliminada) {
    throw new Error('Instalación no encontrada.');
  }
  return { message: 'Instalación eliminada con éxito.' };
};

export const obtenerHistorialInstalacion = async (id) => {
  const instalacion = await Instalacion.findById(id).select('historialModificaciones nombre');
  if (!instalacion) {
    throw new Error('Instalación no encontrada.');
  }

  const historial = instalacion.historialModificaciones.map(mod => ({
    fecha: mod.fecha,
    mensaje: `La instalación '${instalacion.nombre}' ha tenido una modificación en el campo '${mod.campo}' de '${mod.valorAnterior}' a '${mod.valorNuevo}' el ${mod.fecha}, motivo: ${mod.motivo || 'No especificado'}`
  }));

  return { message: 'Historial obtenido con éxito.', data: historial };
}
export default {
  crearInstalacion,
  obtenerInstalaciones,
  obtenerInstalacionPorId,
  actualizarInstalacion,
  actualizarInstalacionParcial,
  eliminarInstalacion,
  obtenerHistorialInstalacion,
};
