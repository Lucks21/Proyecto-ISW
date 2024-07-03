import Implemento from '../models/implementos.model.js';
import { format } from 'date-fns';

// Función para normalizar el nombre
const normalizarNombre = (nombre) => {
  return nombre.toLowerCase().trim().replace(/\s+/g, ' ');
};

// Servicio para crear un implemento
export const crearImplemento = async (datosImplemento) => {
  const { nombre, descripcion, cantidad, estado, fechaAdquisicion, categoria, horarioDisponibilidad } = datosImplemento;

  // Normalizar el nombre
  const nombreNormalizado = normalizarNombre(nombre);

  // Verificar unicidad del nombre
  const implementoExistente = await Implemento.findOne({ nombre: nombreNormalizado });
  if (implementoExistente) {
    throw new Error('El nombre del implemento ya está en uso.');
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
// Servicio para obtener el historial de modificaciones de un implemento
export const obtenerHistorialImplemento = async (id) => {
  const implemento = await Implemento.findById(id).select('historialModificaciones');
  if (!implemento) {
    throw new Error('Implemento no encontrado.');
  }
  return { message: 'Historial obtenido con éxito.', data: implemento.historialModificaciones };
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
    const implementoExistente = await Implemento.findOne({ nombre: datosActualizados.nombre });
    if (implementoExistente && implementoExistente._id.toString() !== id) {
      throw new Error('El nombre del implemento ya está en uso.');
    }
  }

  const implementoActual = await Implemento.findById(id);
  if (!implementoActual) {
    throw new Error('Implemento no encontrado.');
  }

  // Actualizar campos del implemento
  const { cantidad, motivo } = datosActualizados;
  if (cantidad !== undefined && motivo) {
    const cantidadModificada = cantidad - implementoActual.cantidad;
    if (cantidad < 0) {
      throw new Error('La cantidad no puede ser negativa.');
    }

    const nuevoStock = cantidad;
    const fecha = format(new Date(), 'dd-MM-yyyy'); // Fecha actual

    implementoActual.historialModificaciones.push({
      fecha,
      cantidadModificada,
      nuevoStock,
      motivo,
    });

    implementoActual.cantidad = cantidad;
  }

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
