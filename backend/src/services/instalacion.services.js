import Instalacion from '../models/Instalacion.model.js';
import { format, parse, isValid } from 'date-fns';
import levenshtein from 'js-levenshtein';

// Función para normalizar el texto
const normalizarTexto = (texto) => {
  return texto.toLowerCase().trim().replace(/\s+/g, ' ');
};

// Función para verificar nombres similares permitiendo diferencias significativas como números
const esNombreSimilar = (nombre, nombreExistente) => {
  const distancia = levenshtein(nombre, nombreExistente);
  return distancia < 3 && !/\d/.test(nombreExistente) && !/\d/.test(nombre);
};

// Función para validar horarios de disponibilidad
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

// Función para normalizar la fecha
const normalizarFecha = (fecha) => {
  let parsedDate = parse(fecha, 'dd-MM-yyyy', new Date());
  if (!isValid(parsedDate)) {
    parsedDate = parse(fecha, 'dd/MM/yyyy', new Date());
  }
  if (!isValid(parsedDate)) {
    throw new Error('Fecha no válida');
  }
  return format(parsedDate, 'yyyy-MM-dd');
};

// Servicio para crear una instalación
export const crearInstalacion = async (datosInstalacion) => {
  const { nombre, descripcion, fechaAdquisicion, horarioDisponibilidad, capacidad } = datosInstalacion;

  const nombreNormalizado = normalizarTexto(nombre);
  const descripcionNormalizada = descripcion ? normalizarTexto(descripcion) : '';

  // Normalizar la fecha
  const fechaNormalizada = normalizarFecha(fechaAdquisicion);

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
      nombre: nombreNormalizado, // Guardar el nombre normalizado
      fechaAdquisicion: fechaNormalizada,
      capacidad,
      horarioDisponibilidad,
      estado: 'disponible' // Establecer estado predeterminado
    });

    if (descripcionNormalizada) {
      nuevaInstalacion.descripcion = descripcionNormalizada;
    }

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

  // Eliminar cualquier intento de modificar el historial de modificaciones
  delete datosActualizados.historialModificaciones;

  // Verificar si el nombre está siendo actualizado, normalizar y verificar unicidad
  if (datosActualizados.nombre) {
    datosActualizados.nombre = normalizarTexto(datosActualizados.nombre); // Normalización aquí

    const instalacionesExistentes = await Instalacion.find();
    for (let instalacion of instalacionesExistentes) {
      if (esNombreSimilar(datosActualizados.nombre, instalacion.nombre) && instalacion._id.toString() !== id) {
        throw new Error('El nombre de la instalación es muy similar a uno existente.');
      }
    }
  }

  // Normalizar la fecha
  if (datosActualizados.fechaAdquisicion) {
    datosActualizados.fechaAdquisicion = normalizarFecha(datosActualizados.fechaAdquisicion);
  }

  // Normalizar la descripción si está presente
  if (datosActualizados.descripcion) {
    datosActualizados.descripcion = normalizarTexto(datosActualizados.descripcion);
  }

  const modificaciones = [];
  for (let clave in datosActualizados) {
    if (datosActualizados[clave] !== instalacionActual[clave]) {
      modificaciones.push({
        campo: clave,
        valorAnterior: instalacionActual[clave] !== undefined ? instalacionActual[clave] : 'N/A',
        valorNuevo: datosActualizados[clave],
        fecha: format(new Date(), 'dd-MM-yyyy')
      });
    }
  }

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
    datosActualizados.nombre = normalizarTexto(datosActualizados.nombre); // Normalización aquí

    const instalacionesExistentes = await Instalacion.find();
    for (let instalacion of instalacionesExistentes) {
      if (esNombreSimilar(datosActualizados.nombre, instalacion.nombre) && instalacion._id.toString() !== id) {
        throw new Error('El nombre de la instalación es muy similar a uno existente.');
      }
    }
  }

  // Normalizar la fecha
  if (datosActualizados.fechaAdquisicion) {
    datosActualizados.fechaAdquisicion = normalizarFecha(datosActualizados.fechaAdquisicion);
  }

  // Normalizar la descripción si está presente
  if (datosActualizados.descripcion) {
    datosActualizados.descripcion = normalizarTexto(datosActualizados.descripcion);
  }

  // Validar que no haya días duplicados ni horarios solapados
  if (datosActualizados.horarioDisponibilidad) {
    validarHorarios(datosActualizados.horarioDisponibilidad);
  }

  const modificaciones = [];
  for (let clave in datosActualizados) {
    if (datosActualizados[clave] !== instalacionActual[clave]) {
      modificaciones.push({
        campo: clave,
        valorAnterior: instalacionActual[clave] !== undefined ? instalacionActual[clave] : 'N/A',
        valorNuevo: datosActualizados[clave],
        fecha: new Date().toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      });
    }
  }

  // Log para verificar los datos antes de asignar
  console.log('Datos actualizados antes de asignar:', datosActualizados);

  Object.assign(instalacionActual, datosActualizados);
  instalacionActual.historialModificaciones.push(...modificaciones);

  await instalacionActual.save();

  return { message: 'Instalación actualizada con éxito.', data: instalacionActual };
};

// Servicio para eliminar una instalación
export const eliminarInstalacion = async (id) => {
  const instalacionEliminada = await Instalacion.findByIdAndDelete(id);
  if (!instalacionEliminada) {
    throw new Error('Instalación no encontrada.');
  }

  // Eliminar todas las reservas asociadas a esta instalación
  await Reserva.deleteMany({ instalacionId: id });

  return { message: 'Instalación y todas sus reservas asociadas eliminados con éxito.' };
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

export const obtenerInstalacionPorNombre = async (nombre) => {
  const instalacion = await Instalacion.findOne({ nombre });
  if (!instalacion) {
    throw new Error('Instalación no encontrada.');
  }
  return { message: 'Instalación obtenida con éxito.', data: instalacion };
};

export default {
  crearInstalacion,
  obtenerInstalaciones,
  obtenerInstalacionPorId,
  actualizarInstalacion,
  actualizarInstalacionParcial,
  eliminarInstalacion,
  obtenerHistorialInstalacion,
  obtenerInstalacionPorNombre
};
