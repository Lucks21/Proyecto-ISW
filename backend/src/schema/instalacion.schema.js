import Joi from 'joi';

const horarioSchema = Joi.object({
  dia: Joi.string().valid('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes').required(),
  inicio: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required().messages({
    'string.pattern.base': 'La hora de inicio debe estar en formato HH:MM'
  }),
  fin: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required().messages({
    'string.pattern.base': 'La hora de fin debe estar en formato HH:MM'
  })
});

const crearInstalacionSchema = Joi.object({
  nombre: Joi.string().trim().required().messages({
    'any.required': 'El nombre es obligatorio'
  }),
  descripcion: Joi.string().trim().optional(),
  capacidad: Joi.number().integer().min(1).required().messages({
    'any.required': 'La capacidad es obligatoria',
    'number.min': 'La capacidad debe ser al menos 1'
  }),
  fechaAdquisicion: Joi.date().max('now').optional().messages({
    'date.max': 'La fecha de adquisición no puede ser una fecha futura'
  }),
  ubicacion: Joi.string().trim().optional(),
  horarioDisponibilidad: Joi.array().items(horarioSchema).unique((a, b) => a.dia === b.dia).optional().messages({
    'array.unique': 'No puede haber horarios superpuestos para el mismo día'
  })
});

const actualizarInstalacionSchema = Joi.object({
  nombre: Joi.string().trim().optional(),
  descripcion: Joi.string().trim().optional(),
  capacidad: Joi.number().integer().min(1).optional().messages({
    'number.min': 'La capacidad debe ser al menos 1'
  }),
  fechaAdquisicion: Joi.date().max('now').optional().messages({
    'date.max': 'La fecha de adquisición no puede ser una fecha futura'
  }),
  ubicacion: Joi.string().trim().optional(),
  horarioDisponibilidad: Joi.array().items(horarioSchema).unique((a, b) => a.dia === b.dia).optional().messages({
    'array.unique': 'No puede haber horarios superpuestos para el mismo día'
  })
});

const idSchema = Joi.string().hex().length(24).required().messages({
  'any.required': 'El ID es obligatorio',
  'string.hex': 'El ID debe ser un hexadecimal válido',
  'string.length': 'El ID debe tener 24 caracteres'
});

export { crearInstalacionSchema, actualizarInstalacionSchema, idSchema };
