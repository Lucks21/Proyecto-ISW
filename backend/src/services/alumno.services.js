// backend/src/services/alumno.services.js
import Alumno from '../models/alumno.model.js';
import Role from '../models/role.model.js';
import bcrypt from 'bcryptjs';

// Función para encriptar la password
const encriptarPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Servicio para crear un alumno
const crearAlumno = async (datosAlumno) => {
  const { rut, password, nombre, email } = datosAlumno;

  // Verificar unicidad del RUT
  const rutExistente = await Alumno.findOne({ rut });
  if (rutExistente) {
    throw new Error('El RUT ya está en uso.');
  }

  // Verificar unicidad del correo electrónico
  const correoExistente = await Alumno.findOne({ email });
  if (correoExistente) {
    throw new Error('El correo electrónico ya está en uso.');
  }

  const passwordEncriptada = await encriptarPassword(password);

  // Buscar el rol de alumno
  const rolAlumno = await Role.findOne({ name: "alumno" });
  if (!rolAlumno) {
    throw new Error('Rol de alumno no encontrado.');
  }

  const nuevoAlumno = new Alumno({
    rut,
    password: passwordEncriptada,
    nombre,
    email,
    roles: [rolAlumno._id], // Asignar el rol de "alumno" por defecto
  });

  await nuevoAlumno.save();
  return { message: 'Alumno creado con éxito.', data: nuevoAlumno };
};

// Servicio para obtener todos los alumnos
const obtenerAlumnos = async () => {
  const alumnos = await Alumno.find().populate('roles');
  return { message: 'Alumnos obtenidos con éxito.', data: alumnos };
};

// Servicio para obtener un alumno por ID
const obtenerAlumnoPorId = async (id) => {
  const alumno = await Alumno.findById(id).populate('roles');
  if (!alumno) {
    throw new Error('Alumno no encontrado.');
  }
  return { message: 'Alumno obtenido con éxito.', data: alumno };
};

// Servicio para actualizar un alumno
const actualizarAlumno = async (id, datosActualizados) => {
  const { email, rut, password } = datosActualizados;

  // Verificar unicidad del correo por RUT si se está actualizando
  if (email) {
    const alumnoExistente = await Alumno.findOne({ email });
    if (alumnoExistente && alumnoExistente._id.toString() !== id) {
      throw new Error('El correo electrónico ya está en uso con otro RUT.');
    }
  }

  if (password) {
    datosActualizados.password = await encriptarPassword(password);
  } else {
    delete datosActualizados.password;
  }

  const alumnoActualizado = await Alumno.findByIdAndUpdate(id, datosActualizados, { new: true }).populate('roles');
  if (!alumnoActualizado) {
    throw new Error('Alumno no encontrado.');
  }
  return { message: 'Alumno actualizado con éxito.', data: alumnoActualizado };
};

// Servicio para eliminar un alumno
const eliminarAlumno = async (id) => {
  const alumnoEliminado = await Alumno.findByIdAndDelete(id);
  if (!alumnoEliminado) {
    throw new Error('Alumno no encontrado.');
  }
  return { message: 'Alumno eliminado con éxito.' };
};

// Servicio para obtener un alumno por email
const obtenerAlumnoPorEmail = async (email) => {
  const alumno = await Alumno.findOne({ email }).populate('roles');
  if (!alumno) {
    throw new Error('Alumno no encontrado.');
  }
  return { message: 'Alumno obtenido con éxito.', data: alumno };
};
  
export default {
  crearAlumno,
  obtenerAlumnos,
  obtenerAlumnoPorId,
  actualizarAlumno,
  eliminarAlumno,
  obtenerAlumnoPorEmail
};
