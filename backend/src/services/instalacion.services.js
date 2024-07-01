import Instalacion from '../models/Instalacion.model.js';

// Servicio para crear una instalación
export const crearInstalacion = async (datosInstalacion) => {
  const { nombre, descripcion, capacidad, fechaAdquisicion, ubicacion, horarioDisponibilidad } = datosInstalacion;

  const nuevaInstalacion = new Instalacion({
    nombre,
    descripcion,
    capacidad,
    fechaAdquisicion,
    ubicacion,
    horarioDisponibilidad,
    estado: 'disponible' // Estado por defecto
  });

  await nuevaInstalacion.save();
  return { message: 'Instalación creada con éxito.', data: nuevaInstalacion };
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
