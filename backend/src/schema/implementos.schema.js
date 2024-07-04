import Joi from 'joi';
import { parse, isValid, format } from 'date-fns';

// Validación para la fecha
const fechaSchema = Joi.string().pattern(/^\d{2}-\d{2}-\d{4}$/).custom((value, helpers) => {
  console.log(`Validando fecha: ${value}`);
  
  const parsedDate = parse(value, 'dd-MM-yyyy', new Date());
  console.log(`Fecha convertida: ${format(parsedDate, 'yyyy-MM-dd')}`);

  if (!isValid(parsedDate)) {
    console.log('Fecha inválida durante la validación');
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

const actualizarImplementoSchema = Joi.object({
  nombre: Joi.string().pattern(/^[a-zA-Z0-9\s-_]+$/).messages({
    'string.pattern.base': 'El nombre solo puede contener letras, números, espacios, guiones y guiones bajos',
  }),
  descripcion: Joi.string().optional(),
  cantidad: Joi.number().min(0).messages({
    'number.base': 'La cantidad debe ser un número',
    'number.min': 'La cantidad no puede ser negativa',
  }),
  estado: Joi.string().valid('disponible', 'no disponible').messages({
    'any.only': 'El estado debe ser "disponible" o "no disponible"',
  }),
  fechaAdquisicion: Joi.date().max('now').messages({
    'date.max': 'La fecha de adquisición no puede ser una fecha futura'
  }),
  categoria: Joi.string().messages({
    'any.required': 'La categoría es obligatoria'
  }),
  horarioDisponibilidad: Joi.array().items(horarioSchema).default([]),
  historialModificaciones: Joi.array().items(historialModificacionesSchema).default([])
}).min(1); // Al menos un campo debe ser actualizado

export { implementoSchema, actualizarImplementoSchema };
