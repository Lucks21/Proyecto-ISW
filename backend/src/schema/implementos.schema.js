import Joi from 'joi';
import { parse, isValid, format } from 'date-fns';

// Validación para la fecha
const fechaSchema = Joi.string().pattern(/^\d{2}-\d{2}-\d{4}$/).custom((value, helpers) => {
  const parsedDate = parse(value, 'dd-MM-yyyy', new Date());
  if (!isValid(parsedDate)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'validación de fecha').required().messages({
  'string.pattern.base': 'La fecha debe estar en formato DD-MM-YYYY',
  'any.required': 'La fecha es obligatoria',
  'any.invalid': 'La fecha no es válida'
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
  nombre: Joi.string().pattern(/^[a-zA-Z0-9\s-_]+$/).required().messages({
    'string.pattern.base': 'El nombre solo puede contener letras, números, espacios, guiones y guiones bajos',
    'any.required': 'El nombre es obligatorio'
  }),
  descripcion: Joi.string().optional(),
  cantidad: Joi.number().min(0).required().messages({
    'number.base': 'La cantidad debe ser un número',
    'number.min': 'La cantidad no puede ser negativa',
    'any.required': 'La cantidad es obligatoria'
  }),
  estado: Joi.string().valid('disponible', 'no disponible').required().messages({
    'any.only': 'El estado debe ser "disponible" o "no disponible"',
    'any.required': 'El estado es obligatorio'
  }),
  fechaAdquisicion: Joi.date().max('now').messages({
    'date.max': 'La fecha de adquisición no puede ser una fecha futura'
  }),
  categoria: Joi.string().required().messages({
    'any.required': 'La categoría es obligatoria'
  }),
  horarioDisponibilidad: Joi.array().items(horarioSchema).default([]),
  historialModificaciones: Joi.array().items(historialModificacionesSchema).default([])
});

// Validación específica para la actualización de implementos
const actualizarImplementoSchema = implementoSchema.keys({
  motivo: Joi.when('cantidad', {
    is: Joi.exist(),
    then: Joi.string().required().messages({
      'any.required': 'El motivo es necesario si actualiza el stock'
    })
  })
});

export { implementoSchema, actualizarImplementoSchema };
