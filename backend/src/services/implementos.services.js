import Implemento from '../models/implementos.model.js';
import levenshtein from 'js-levenshtein';
import { format } from 'date-fns';

// Función para normalizar el nombre
const normalizarNombre = (nombre) => {
  return nombre.toLowerCase().trim().replace(/\s+/g, ' ');
};

// Función para verificar nombres similares permitiendo diferencias significativas como números
const esNombreSimilar = (nombre, nombreExistente) => {
  const distancia = levenshtein(nombre, nombreExistente);
  return distancia < 3 && !/\d/.test(nombreExistente) && !/\d/.test(nombre);
};

// Servicio para crear un implemento
export const crearImplemento = async (datosImplemento) => {
  const { nombre, descripcion, cantidad, estado, fechaAdquisicion, categoria, horarioDisponibilidad } = datosImplemento;

  // Normalizar el nombre
  const nombreNormalizado = normalizarNombre(nombre);

  // Verificar unicidad del nombre
  const implementosExistentes = await Implemento.find();
  for (let implemento of implementosExistentes) {
    if (esNombreSimilar(nombreNormalizado, implemento.nombre)) {
      throw new Error('El nombre del implemento es muy similar a uno existente.');
    }
  }

  const nuevoImplemento = new Implemento({
    nombre: nombreNormalizado,
    descripcion,
    cantidad,
    estado,
    fechaAdquisicion,
    categoria,
    horarioDisponibilidad,
  });

  await nuevoImplemento.save();
  return { message: 'Implemento creado con éxito.', data: nuevoImplemento };
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

  // Validar que no haya días duplicados en el horario de disponibilidad
  if (datosActualizados.horarioDisponibilidad) {
    const dias = datosActualizados.horarioDisponibilidad.map(item => item.dia);
    if (dias.length !== new Set(dias).size) {
      throw new Error('No puede haber horarios superpuestos para el mismo día.');
    }
  }

  const implementoActual = await Implemento.findById(id);
  if (!implementoActual) {
    throw new Error('Implemento no encontrado.');
  }

  // Actualizar campos del implemento
  const { cantidad, motivo } = datosActualizados;
  if (cantidad !== undefined && cantidad !== implementoActual.cantidad) {
    if (motivo) {
      const cantidadModificada = cantidad - implementoActual.cantidad;
      if (cantidad < 0) {
        throw new Error('La cantidad no puede ser negativa.');
      }

      const nuevoStock = cantidad;
      const fecha = format(new Date(), 'dd-MM-yyyy'); // Fecha actual

      implementoActual.historialModificaciones.push({
        fecha,
        usuario: 'Encargado',  // Asumiendo que el encargado es el único que puede hacer esta acción
        cantidadModificada,
        nuevoStock,
        motivo,
      });

      implementoActual.cantidad = cantidad;
    } else {
      throw new Error('El motivo es obligatorio cuando se modifica la cantidad.');
    }
  }

  Object.assign(implementoActual, datosActualizados);
  await implementoActual.save();

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

  // Validar que no haya días duplicados en el horario de disponibilidad
  if (datosActualizados.horarioDisponibilidad) {
    const dias = datosActualizados.horarioDisponibilidad.map(item => item.dia);
    if (dias.length !== new Set(dias).size) {
      throw new Error('No puede haber horarios superpuestos para el mismo día.');
    }
  }

  // Actualizar solo los campos que se pasen en el body
  Object.assign(implementoActual, datosActualizados);
  await implementoActual.save();

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
  const implemento = await Implemento.findById(id).select('historialModificaciones');
  if (!implemento) {
    throw new Error('Implemento no encontrado.');
  }
  return { message: 'Historial obtenido con éxito.', data: implemento.historialModificaciones };
};
//Servicio para visualizar Reserva de implementos
async function getImplementosReservados() { 
  try {
    const implementos = await Implemento.find();

    const implementosReservados = implementos.filter( implemento => implemento.estado === "no disponible") || [];

    return [implementosReservados, null];

  } catch (error) {
    return [null, "Error al obtener los implementos"];
  }
}
//Servicio para visualizar la reserva de implementos por ID

export default {
  getImplementosReservados,
  getImplementosReservadasById,
};