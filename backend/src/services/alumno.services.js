import Alumno from '../models/alumno.model.js';
import bcrypt from 'bcryptjs';

// Función para encriptar la contraseña
const encriptarContraseña = async (contraseña) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(contraseña, salt);
};

// Servicio para crear un alumno
export const crearAlumno = async (datosAlumno) => {
  const { rut, contraseña, nombre, correoElectronico } = datosAlumno;

  // Verificar unicidad del RUT
  const rutExistente = await Alumno.findOne({ rut });
  if (rutExistente) {
    throw new Error('El RUT ya está en uso.');
  }

  // Verificar unicidad del correo electrónico
  const correoExistente = await Alumno.findOne({ correoElectronico });
  if (correoExistente) {
    throw new Error('El correo electrónico ya está en uso.');
  }

  const contraseñaEncriptada = await encriptarContraseña(contraseña);

  const nuevoAlumno = new Alumno({
    rut,
    contraseña: contraseñaEncriptada,
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
  const { correoElectronico, rut, contraseña } = datosActualizados;

  // Verificar unicidad del correo por RUT si se está actualizando
  if (correoElectronico) {
    const alumnoExistente = await Alumno.findOne({ correoElectronico });
    if (alumnoExistente && alumnoExistente._id.toString() !== id) {
      throw new Error('El correo electrónico ya está en uso con otro RUT.');
    }
  }

  if (contraseña) {
    datosActualizados.contraseña = await encriptarContraseña(contraseña);
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
