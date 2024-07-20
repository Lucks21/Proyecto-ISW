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

// Validación para el implemento
const implementoSchema = Joi.object({
  nombre: Joi.string().pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s_-]+$/).required().messages({
    'string.pattern.base': 'El nombre solo puede contener letras, números, guiones, guiones bajos y espacios, y debe incluir letras',
    'any.required': 'El nombre es obligatorio',
    'any.invalid': 'El nombre no es válido'
  }),
  descripcion: Joi.string().max(100).pattern(/^[a-zA-Z0-9\s]+$/).optional().messages({
    'string.max': 'Has excedido el máximo de 100 caracteres',
    'string.pattern.base': 'La descripción solo puede contener letras y números, sin caracteres especiales'
  }),
  cantidad: Joi.number().integer().min(1).max(50).required().messages({
    'number.base': 'La cantidad debe ser un número',
    'number.integer': 'La cantidad debe ser un número entero',
    'number.min': 'La cantidad no puede ser menor que 1',
    'number.max': 'La cantidad no puede ser mayor que 50',
    'any.required': 'La cantidad es obligatoria'
  }),
  fechaAdquisicion: fechaSchema,
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

const actualizarImplementoSchema = Joi.object({
  nombre: Joi.string().pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s_-]+$/).optional().messages({
    'string.pattern.base': 'El nombre solo puede contener letras, números, guiones, guiones bajos y espacios, y debe incluir letras',
  }),
  descripcion: Joi.string().max(100).pattern(/^[a-zA-Z0-9\s]+$/).optional().messages({
    'string.max': 'Has excedido el máximo de 100 caracteres',
    'string.pattern.base': 'La descripción solo puede contener letras y números, sin caracteres especiales'
  }),
  cantidad: Joi.number().integer().min(1).max(50).optional().messages({
    'number.base': 'La cantidad debe ser un número',
    'number.integer': 'La cantidad debe ser un número entero',
    'number.min': 'La cantidad no puede ser menor que 1',
    'number.max': 'La cantidad no puede ser mayor que 50'
  }),
  fechaAdquisicion: fechaSchema.optional(),
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

export { implementoSchema, actualizarImplementoSchema };
