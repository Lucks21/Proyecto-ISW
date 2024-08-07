// backend/src/schema/alumno.schema.js
import Joi from 'joi';

// Función para validar el RUT chileno
const validarRut = (rut, helpers) => {
  const rutRegex = /^[0-9]+-[0-9Kk]$/;
  if (!rutRegex.test(rut)) {
    return helpers.error('any.invalid', { message: 'El RUT no es válido' });
  }

  const [numero, digitoVerificador] = rut.split('-');
  let cuerpo = numero;
  const dv = digitoVerificador.toUpperCase();

  let suma = 0;
  let multiplo = 2;

  // Recorrer el RUT de derecha a izquierda
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += multiplo * parseInt(cuerpo.charAt(i));
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvFinal = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  if (dvFinal !== dv) {
    return helpers.error('any.invalid', { message: 'El RUT no es válido' });
  }

  return true;
};

// Validación para el formato del correo electrónico
const emailSchema = Joi.string().email({ tlds: { allow: ['edu', 'cl'] } }).pattern(/@alumnos\.ubiobio\.cl$/).required().messages({
  'string.email': 'El correo electrónico debe ser válido y debe pertenecer a la universidad (dominio @alumnos.ubiobio.cl).',
  'any.required': 'El correo electrónico es obligatorio.',
  'string.pattern.base': 'El correo electrónico debe pertenecer al dominio @alumnos.ubiobio.cl'
});

// Validación para el RUT
const rutSchema = Joi.string().custom(validarRut, 'Validación de RUT').required().messages({
  'any.required': 'El RUT es obligatorio',
  'any.invalid': 'El RUT no es válido'
});

// Validación para la password
const passwordSchema = Joi.string().min(6).required().messages({
  'string.min': 'La password debe tener al menos 6 caracteres.',
  'any.required': 'La password es obligatoria.'
});

// Validación para el nombre
const nombreSchema = Joi.string().required().messages({
  'any.required': 'El nombre es obligatorio.'
});

// Validación para crear un alumno
const crearAlumnoSchema = Joi.object({
  rut: rutSchema,
  password: passwordSchema,
  nombre: nombreSchema,
  email: emailSchema,
  reservasActivas: Joi.array().items(Joi.string().hex().length(24)),
  historialReservas: Joi.array().items(Joi.string().hex().length(24))
});

// Validación para actualizar un alumno (permitimos campos opcionales para actualizaciones parciales)
const actualizarAlumnoSchema = Joi.object({
  rut: rutSchema.optional(),
  password: passwordSchema.optional(),
  nombre: nombreSchema.optional(),
  email: emailSchema.optional(),
  reservasActivas: Joi.array().items(Joi.string().hex().length(24)).optional(),
  historialReservas: Joi.array().items(Joi.string().hex().length(24)).optional()
}).min(1).messages({
  'object.min': 'Al menos un campo debe ser actualizado.'
});

export { crearAlumnoSchema, actualizarAlumnoSchema };
