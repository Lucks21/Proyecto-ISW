import Joi from 'joi';

// Función para validar el RUT chileno
const validarRut = (rut, helpers) => {
  const rutRegex = /^[0-9]+-[0-9Kk]$/;
  if (!rutRegex.test(rut)) {
    return helpers.error('any.invalid', { message: 'El RUT no es válido' });
  }
  // Aquí puedes añadir lógica adicional para validar el dígito verificador si es necesario
  return true;
};

// Validación para el formato del correo electrónico
const correoElectronicoSchema = Joi.string().email({ tlds: { allow: ['edu', 'cl'] } }).pattern(/@alumnos\.ubiobio\.cl$/).required().messages({
  'string.email': 'El correo electrónico debe ser válido y debe pertenecer a la universidad (dominio @alumnos.ubiobio.cl).',
  'any.required': 'El correo electrónico es obligatorio.'
});

// Validación para el RUT
const rutSchema = Joi.string().custom(validarRut, 'Validación de RUT').required().messages({
  'any.required': 'El RUT es obligatorio',
  'any.invalid': 'El RUT no es válido'
});

// Validación para la contraseña
const contraseñaSchema = Joi.string().min(6).required().messages({
  'string.min': 'La contraseña debe tener al menos 6 caracteres.',
  'any.required': 'La contraseña es obligatoria.'
});

// Validación para el nombre
const nombreSchema = Joi.string().required().messages({
  'any.required': 'El nombre es obligatorio.'
});

// Validación para crear un alumno
const crearAlumnoSchema = Joi.object({
  rut: rutSchema,
  contraseña: contraseñaSchema,
  nombre: nombreSchema,
  correoElectronico: correoElectronicoSchema,
  reservasActivas: Joi.array().items(Joi.string().hex().length(24)),
  historialReservas: Joi.array().items(Joi.string().hex().length(24))
});

// Validación para actualizar un alumno (permitimos campos opcionales para actualizaciones parciales)
const actualizarAlumnoSchema = Joi.object({
  rut: rutSchema.optional(),
  contraseña: contraseñaSchema.optional(),
  nombre: nombreSchema.optional(),
  correoElectronico: correoElectronicoSchema.optional(),
  reservasActivas: Joi.array().items(Joi.string().hex().length(24)).optional(),
  historialReservas: Joi.array().items(Joi.string().hex().length(24)).optional()
}).min(1).messages({
  'object.min': 'Al menos un campo debe ser actualizado.'
});

export { crearAlumnoSchema, actualizarAlumnoSchema };
