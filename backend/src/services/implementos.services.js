import Implemento from '../models/implementos.model.js';
import levenshtein from 'js-levenshtein';
import { format, parse } from 'date-fns';

// Función para normalizar el nombre
const normalizarNombre = (nombre) => {
  return nombre.toLowerCase().trim().replace(/\s+/g, ' ');
};

// Función para verificar nombres similares permitiendo diferencias significativas como números
const esNombreSimilar = (nombre, nombreExistente) => {
  const distancia = levenshtein(nombre, nombreExistente);
  return distancia < 3 && !/\d/.test(nombreExistente) && !/\d/.test(nombre);
};

// Función para actualizar el estado basado en la cantidad
const actualizarEstadoImplemento = async (id) => {
  const implemento = await Implemento.findById(id);
  if (!implemento) {
    throw new Error('Implemento no encontrado');
  }

  implemento.estado = implemento.cantidad <= 0 ? 'no disponible' : 'disponible';
  await implemento.save();
};

// Validar que no haya días duplicados ni horarios solapados en el horario de disponibilidad
const validarHorarios = (horarioDisponibilidad) => {
  const horariosPorDia = {};

  horarioDisponibilidad.forEach(item => {
    if (!horariosPorDia[item.dia]) {
      horariosPorDia[item.dia] = [];
    }
    const inicioHora = parseInt(item.inicio.replace(':', ''), 10);
    const finHora = parseInt(item.fin.replace(':', ''), 10);

    if (inicioHora % 100 !== 0 || finHora % 100 !== 0) {
      throw new Error(`Las horas deben estar en bloques completos. Horario inválido: ${item.inicio} - ${item.fin} para el día ${item.dia}.`);
    }

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

// Servicio para crear un implemento
export const crearImplemento = async (datosImplemento) => {
  const { nombre, descripcion, cantidad, fechaAdquisicion, horarioDisponibilidad } = datosImplemento;

  // Normalizar el nombre
  const nombreNormalizado = normalizarNombre(nombre);

  // Verificar unicidad del nombre y similitud
  const implementosExistentes = await Implemento.find();
  for (let implemento of implementosExistentes) {
    if (esNombreSimilar(nombreNormalizado, implemento.nombre)) {
      throw new Error('El nombre del implemento es muy similar a uno existente.');
    }
  }

  // Validar que no haya días duplicados ni horarios solapados
  if (horarioDisponibilidad) {
    validarHorarios(horarioDisponibilidad);
  }

  try {
    const nuevoImplemento = new Implemento({
      nombre: nombreNormalizado,
      descripcion,
      cantidad,
      fechaAdquisicion,
      horarioDisponibilidad,
    });

    await nuevoImplemento.save();
    await actualizarEstadoImplemento(nuevoImplemento._id); // Actualizar estado después de guardar
    return { message: 'Implemento creado con éxito.', data: nuevoImplemento };
  } catch (error) {
    if (error.code === 11000) {
      // Error de clave duplicada
      throw new Error('El nombre del implemento ya existe. Por favor, elija otro nombre.');
    }
    throw error; // Lanzar otros errores no relacionados con clave duplicada
  }
};

// Servicio para obtener todos los implementos
export const obtenerImplementos = async () => {
  const implementos = await Implemento.find();
  return { message: 'Implementos obtenidos con éxito.', data: implementos };
};

// Servicio para obtener un implemento por ID
export const obtenerImplementoPorId = async (id) => {
  const implemento = await Implemento.findById(id);
  if (!implemento) {
    throw new Error('Implemento no encontrado.');
  }
  return { message: 'Implemento obtenido con éxito.', data: implemento };
};

// Servicio para actualizar un implemento
export const actualizarImplemento = async (id, datosActualizados) => {
  // Si el nombre está siendo actualizado, normalizar y verificar unicidad
  if (datosActualizados.nombre) {
    datosActualizados.nombre = normalizarNombre(datosActualizados.nombre);

    const implementosExistentes = await Implemento.find();
    for (let implemento of implementosExistentes) {
      if (esNombreSimilar(datosActualizados.nombre, implemento.nombre) && implemento._id.toString() !== id) {
        throw new Error('El nombre del implemento es muy similar a uno existente.');
      }
    }
  }

  // Validar que no haya días duplicados ni horarios solapados en el horario de disponibilidad
  if (datosActualizados.horarioDisponibilidad) {
    validarHorarios(datosActualizados.horarioDisponibilidad);
  }

  const implementoActual = await Implemento.findById(id);
  if (!implementoActual) {
    throw new Error('Implemento no encontrado.');
  }

  // Registrar todas las modificaciones en el historial
  const modificaciones = [];
  for (let clave in datosActualizados) {
    if (datosActualizados[clave] !== implementoActual[clave]) {
      modificaciones.push({
        campo: clave,
        valorAnterior: implementoActual[clave],
        valorNuevo: datosActualizados[clave],
        fecha: format(new Date(), 'dd-MM-yyyy'),
      });
    }
  }
  implementoActual.historialModificaciones.push(...modificaciones);

  // Actualizar campos del implemento
  Object.assign(implementoActual, datosActualizados);
  await implementoActual.save();
  await actualizarEstadoImplemento(implementoActual._id); // Actualizar estado después de actualizar

  return { message: 'Implemento actualizado con éxito.', data: implementoActual };
};

// Servicio para actualizar un implemento parcialmente
export const actualizarImplementoParcial = async (id, datosActualizados) => {
  const implementoActual = await Implemento.findById(id);
  if (!implementoActual) {
    throw new Error('Implemento no encontrado.');
  }

  // Si el nombre está siendo actualizado, normalizar y verificar unicidad
  if (datosActualizados.nombre) {
    datosActualizados.nombre = normalizarNombre(datosActualizados.nombre);

    const implementosExistentes = await Implemento.find();
    for (let implemento of implementosExistentes) {
      if (esNombreSimilar(datosActualizados.nombre, implemento.nombre) && implemento._id.toString() !== id) {
        throw new Error('El nombre del implemento es muy similar a uno existente.');
      }
    }
  }

  // Validar que no haya días duplicados ni horarios solapados en el horario de disponibilidad
  if (datosActualizados.horarioDisponibilidad) {
    validarHorarios(datosActualizados.horarioDisponibilidad);
  }

  // Registrar todas las modificaciones en el historial
  const modificaciones = [];
  for (let clave in datosActualizados) {
    if (datosActualizados[clave] !== implementoActual[clave]) {
      modificaciones.push({
        campo: clave,
        valorAnterior: implementoActual[clave],
        valorNuevo: datosActualizados[clave],
        fecha: format(new Date(), 'dd-MM-yyyy'),
      });
    }
  }
  implementoActual.historialModificaciones.push(...modificaciones);

  // Actualizar solo los campos que se pasen en el body
  Object.assign(implementoActual, datosActualizados);
  await implementoActual.save();
  await actualizarEstadoImplemento(implementoActual._id); // Actualizar estado después de actualizar

  return { message: 'Implemento actualizado con éxito.', data: implementoActual };
};

// Servicio para eliminar un implemento
export const eliminarImplemento = async (id) => {
  const implementoEliminado = await Implemento.findByIdAndDelete(id);
  if (!implementoEliminado) {
    throw new Error('Implemento no encontrado.');
  }
  return { message: 'Implemento eliminado con éxito.' };
};

// Servicio para obtener el historial de modificaciones de un implemento
export const obtenerHistorialImplemento = async (id) => {
  const implemento = await Implemento.findById(id).select('historialModificaciones nombre');
  if (!implemento) {
    throw new Error('Implemento no encontrado.');
  }

  const historial = implemento.historialModificaciones.map(mod => ({
    fecha: mod.fecha,
    mensaje: `El implemento '${implemento.nombre}' ha tenido una modificación en el campo '${mod.campo}' de '${mod.valorAnterior}' a '${mod.valorNuevo}' el ${mod.fecha}`
  }));

  return { message: 'Historial obtenido con éxito.', data: historial };
};

export default {
  crearImplemento,
  obtenerImplementos,
  obtenerImplementoPorId,
  actualizarImplemento,
  actualizarImplementoParcial,
  eliminarImplemento,
  obtenerHistorialImplemento,
};
