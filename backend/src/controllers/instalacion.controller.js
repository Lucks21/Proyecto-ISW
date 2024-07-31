import { 
  obtenerInstalacionPorNombre,
  crearInstalacion, 
  obtenerInstalaciones, 
  obtenerInstalacionPorId, 
  actualizarInstalacion, 
  actualizarInstalacionParcial, // Añadido
  eliminarInstalacion,
  obtenerHistorialInstalacion // Añadido
} from '../services/instalacion.services.js';
import { 
  crearInstalacionSchema, 
  actualizarInstalacionSchema, 
  idSchema 
} from '../schema/instalacion.schema.js';

// Controlador para crear una instalación
export const crearInstalacionController = async (req, res) => {
  const { error } = crearInstalacionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const resultado = await crearInstalacion(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error al crear la instalación.' });
  }
};

// Controlador para obtener todas las instalaciones
export const obtenerInstalacionesController = async (req, res) => {
  try {
    const resultado = await obtenerInstalaciones();
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error al obtener las instalaciones.' });
  }
};

// Controlador para obtener una instalación por ID
export const obtenerInstalacionPorIdController = async (req, res) => {
  const { id } = req.params;
  const { error } = idSchema.validate(id);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const resultado = await obtenerInstalacionPorId(id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ message: error.message || 'Error al obtener la instalación.' });
  }
};

// Controlador para actualizar una instalación
export const actualizarInstalacionController = async (req, res) => {
  const { id } = req.params;
  const { error: idError } = idSchema.validate(id);
  if (idError) {
    return res.status(400).json({ message: idError.details[0].message });
  }

  const { error: bodyError } = actualizarInstalacionSchema.validate(req.body);
  if (bodyError) {
    return res.status(400).json({ message: bodyError.details[0].message });
  }

  try {
    const resultado = await actualizarInstalacion(id, req.body);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ message: error.message || 'Error al actualizar la instalación.' });
  }
};

export const actualizarInstalacionParcialController = async (req, res) => {
  const { id } = req.params;
  const { error: idError } = idSchema.validate(id);
  if (idError) {
    return res.status(400).json({ message: idError.details[0].message });
  }

  const { error: bodyError } = actualizarInstalacionSchema.validate(req.body);
  if (bodyError) {
    return res.status(400).json({ message: bodyError.details[0].message });
  }

  try {
    console.log('Recibiendo datos en el backend:', req.body);
    const resultado = await actualizarInstalacionParcial(id, req.body);
    console.log('Datos después de la actualización:', resultado.data);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ message: error.message || 'Error al actualizar parcialmente la instalación.' });
  }
};

// Controlador para eliminar una instalación
export const eliminarInstalacionController = async (req, res) => {
  const { id } = req.params;
  const { error } = idSchema.validate(id);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const resultado = await eliminarInstalacion(id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ message: error.message || 'Error al eliminar la instalación.' });
  }
};

// Controlador para obtener una instalación por nombre
export const obtenerInstalacionPorNombreController = async (req, res) => {
  try {
    const { nombre } = req.params;
    const resultado = await obtenerInstalacionPorNombre(nombre);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(`Error al obtener instalación con nombre ${req.params.nombre}:`, error);
    res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};

// Controlador para obtener el historial de modificaciones de una instalación
export const obtenerHistorialInstalacionController = async (req, res) => {
  const { id } = req.params;
  const { error } = idSchema.validate(id);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const resultado = await obtenerHistorialInstalacion(id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ message: error.message || 'Error al obtener el historial de la instalación.' });
  }
};
