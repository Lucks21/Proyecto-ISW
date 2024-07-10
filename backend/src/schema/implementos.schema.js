import Joi from 'joi';
import { parse, isValid, format } from 'date-fns';

// Validación para la fecha
const fechaSchema = Joi.string().pattern(/^\d{2}-\d{2}-\d{4}$/).custom((value, helpers) => {
  const parsedDate = parse(value, 'dd-MM-yyyy', new Date());
  if (!isValid(parsedDate)) {
    return helpers.error('any.invalid');
  }
  if (parsedDate > new Date() || parsedDate.getFullYear() < 1947) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'validación de fecha').required().messages({
  'string.pattern.base': 'La fecha debe estar en formato DD-MM-YYYY',
  'any.required': 'La fecha es obligatoria',
  'any.invalid': 'La fecha no es válida o está fuera del rango permitido (1947-presente)'
});

// Validación para el horario de disponibilidad
const horarioSchema = Joi.object({
  dia: Joi.string().valid('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes').required(),
  inicio: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required().messages({
    'string.pattern.base': 'La hora de inicio debe estar en formato HH:MM'
  }),
  fin: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required().messages({
    'string.pattern.base': 'La hora de fin debe estar en formato HH:MM'
  })
});

// Validación para el historial de modificaciones
const historialModificacionesSchema = Joi.object({
  fecha: fechaSchema,
  usuario: Joi.string().required().messages({
    'any.required': 'El usuario es obligatorio'
  }),
  cantidadModificada: Joi.number().required().messages({
    'number.base': 'La cantidad modificada debe ser un número',
    'any.required': 'La cantidad modificada es obligatoria'
  }),
  nuevoStock: Joi.number().required().messages({
    'number.base': 'El nuevo stock debe ser un número',
    'any.required': 'El nuevo stock es obligatorio'
  }),
  motivo: Joi.string().required().messages({
    'any.required': 'El motivo es obligatorio'
  })
});

// Validación para el implemento
const implementoSchema = Joi.object({
  nombre: Joi.string().pattern(/^[a-zA-Z0-9]+(?:[_-][a-zA-Z0-9]+)*$/).required().messages({
    'string.pattern.base': 'El nombre solo puede contener letras, números, guiones y guiones bajos, y debe incluir letras',
    'any.required': 'El nombre es obligatorio'
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
  estado: Joi.string().valid('disponible', 'no disponible').required().messages({
    'any.only': 'El estado debe ser "disponible" o "no disponible"',
    'any.required': 'El estado es obligatorio'
  }),
  fechaAdquisicion: fechaSchema,
  categoria: Joi.string().max(25).pattern(/^[a-zA-Z0-9\s-]+$/).required().messages({
    'string.pattern.base': 'La categoría solo puede contener letras, números, y guiones, sin caracteres especiales',
    'string.max': 'La categoría no puede exceder las 25 caracteres',
    'any.required': 'La categoría es obligatoria'
  }),
  horarioDisponibilidad: Joi.array().items(horarioSchema).default([]),
  historialModificaciones: Joi.array().items(historialModificacionesSchema).default([])
});

const actualizarImplementoSchema = Joi.object({
  nombre: Joi.string().pattern(/^[a-zA-Z0-9]+(?:[_-][a-zA-Z0-9]+)*$/).messages({
    'string.pattern.base': 'El nombre solo puede contener letras, números, guiones y guiones bajos, y debe incluir letras',
  }),
  descripcion: Joi.string().max(100).pattern(/^[a-zA-Z0-9\s]+$/).optional().messages({
    'string.max': 'Has excedido el máximo de 100 caracteres',
    'string.pattern.base': 'La descripción solo puede contener letras y números, sin caracteres especiales'
  }),
  cantidad: Joi.number().integer().min(1).max(50).messages({
    'number.base': 'La cantidad debe ser un número',
    'number.integer': 'La cantidad debe ser un número entero',
    'number.min': 'La cantidad no puede ser menor que 1',
    'number.max': 'La cantidad no puede ser mayor que 50'
  }),
  estado: Joi.string().valid('disponible', 'no disponible').messages({
    'any.only': 'El estado debe ser "disponible" o "no disponible"',
  }),
  fechaAdquisicion: fechaSchema,
  categoria: Joi.string().max(25).pattern(/^[a-zA-Z0-9\s-]+$/).messages({
    'string.pattern.base': 'La categoría solo puede contener letras, números, y guiones, sin caracteres especiales',
    'string.max': 'La categoría no puede exceder las 25 caracteres'
  }),
  horarioDisponibilidad: Joi.array().items(horarioSchema).default([]),
  historialModificaciones: Joi.array().items(historialModificacionesSchema).default([])
}).min(1); // Al menos un campo debe ser actualizado

export { implementoSchema, actualizarImplementoSchema };
