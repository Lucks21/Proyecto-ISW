import Joi from 'joi';
import { parse, isValid, format } from 'date-fns';

// Validación para la fecha
const fechaSchema = Joi.string().custom((value, helpers) => {
  let parsedDate = parse(value, 'dd-MM-yyyy', new Date());
  if (!isValid(parsedDate)) {
    parsedDate = parse(value, 'dd/MM/yyyy', new Date());
    if (!isValid(parsedDate)) {
      return helpers.error('any.invalid');
    }
  }
  if (parsedDate > new Date() || parsedDate.getFullYear() < 1947) {
    return helpers.error('any.invalid');
  }
  return format(parsedDate, 'dd-MM-yyyy');
}, 'validación de fecha').required().messages({
  'any.required': 'La fecha es obligatoria',
  'any.invalid': 'La fecha no es válida o está fuera del rango permitido (1947-presente)'
});

const crearInstalacionSchema = Joi.object({
  nombre: Joi.string().pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s_-]+$/).trim().required().messages({
    'any.required': 'El nombre es obligatorio',
    'string.pattern.base': 'El nombre solo puede contener letras, números, guiones, guiones bajos y espacios, y debe incluir letras'
  }),
  descripcion: Joi.string().trim().optional(),
  fechaAdquisicion: fechaSchema,
  capacidad: Joi.number().integer().min(1).required().messages({
    'number.base': 'La capacidad debe ser un número',
    'number.integer': 'La capacidad debe ser un número entero',
    'number.min': 'La capacidad debe ser al menos 1',
    'any.required': 'La capacidad es obligatoria'
  }),
  horarioDisponibilidad: Joi.array().items(Joi.object({
    dia: Joi.string().valid('lunes', 'martes', 'miércoles', 'miercoles', 'jueves', 'viernes').insensitive().required().messages({
      'any.required': 'El día es obligatorio',
      'any.only': 'El día debe ser uno de los siguientes: lunes, martes, miércoles, jueves, viernes'
    }),
    inicio: Joi.string().required().messages({
      'any.required': 'La hora de inicio es obligatoria'
    }),
    fin: Joi.string().required().messages({
      'any.required': 'La hora de fin es obligatoria'
    })
  })).default([]),
  estado: Joi.string().valid('disponible', 'no disponible').optional(),
  historialModificaciones: Joi.array().default([])
});

const actualizarInstalacionSchema = Joi.object({
  nombre: Joi.string().pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s_-]+$/).trim().optional().messages({
    'string.pattern.base': 'El nombre solo puede contener letras, números, guiones, guiones bajos y espacios, y debe incluir letras'
  }),
  descripcion: Joi.string().trim().optional(),
  fechaAdquisicion: fechaSchema.optional(),
  capacidad: Joi.number().integer().min(1).optional().messages({
    'number.base': 'La capacidad debe ser un número',
    'number.integer': 'La capacidad debe ser un número entero',
    'number.min': 'La capacidad debe ser al menos 1'
  }),
  horarioDisponibilidad: Joi.array().items(Joi.object({
    dia: Joi.string().valid('lunes', 'martes', 'miércoles', 'miercoles', 'jueves', 'viernes').insensitive().optional().messages({
      'any.only': 'El día debe ser uno de los siguientes: lunes, martes, miércoles, jueves, viernes'
    }),
    inicio: Joi.string().optional(),
    fin: Joi.string().optional()
  })).default([]),
  estado: Joi.string().valid('disponible', 'no disponible').optional(),
  historialModificaciones: Joi.array().default([])
}).min(1);

const idSchema = Joi.string().hex().length(24).required().messages({
  'any.required': 'El ID es obligatorio',
  'string.hex': 'El ID debe ser un hexadecimal válido',
  'string.length': 'El ID debe tener 24 caracteres'
});

export { crearInstalacionSchema, actualizarInstalacionSchema, idSchema };
