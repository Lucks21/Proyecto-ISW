import Joi from 'joi';

const horarioSchema = Joi.object({
  dia: Joi.string().valid('lunes', 'martes', 'miércoles', 'jueves', 'viernes').required(),
  inicio: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required().messages({
    'string.pattern.base': 'La hora de inicio debe estar en formato HH:MM'
  }),
  fin: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required().messages({
    'string.pattern.base': 'La hora de fin debe estar en formato HH:MM'
  })
});

const crearInstalacionSchema = Joi.object({
  nombre: Joi.string().pattern(/^[a-zA-Z0-9-_ ]+$/).trim().required().messages({
    'any.required': 'El nombre es obligatorio',
    'string.pattern.base': 'El nombre solo puede contener letras, números, guiones, guiones bajos y espacios, y debe incluir letras'
  }),
  descripcion: Joi.string().trim().optional(),
  fechaAdquisicion: Joi.date().required().messages({
    'any.required': 'La fecha de adquisición es obligatoria',
    'date.base': 'La fecha de adquisición debe ser una fecha válida'
  }),
  horarioDisponibilidad: Joi.array().items(horarioSchema).unique((a, b) => a.dia === b.dia).optional().messages({
    'array.unique': 'No puede haber horarios superpuestos para el mismo día'
  }),
  estado: Joi.string().valid('disponible', 'no disponible').optional()
});

const actualizarInstalacionSchema = Joi.object({
  nombre: Joi.string().pattern(/^[a-zA-Z0-9-_]+$/).trim().optional().messages({
    'string.pattern.base': 'El nombre solo puede contener letras, números, guiones y guiones bajos, y debe incluir letras'
  }),
  descripcion: Joi.string().trim().optional(),
  fechaAdquisicion: Joi.date().optional().messages({
    'date.base': 'La fecha de adquisición debe ser una fecha válida'
  }),
  horarioDisponibilidad: Joi.array().items(horarioSchema).unique((a, b) => a.dia === b.dia).optional().messages({
    'array.unique': 'No puede haber horarios superpuestos para el mismo día'
  }),
  estado: Joi.string().valid('disponible', 'no disponible').optional()
});

const idSchema = Joi.string().hex().length(24).required().messages({
  'any.required': 'El ID es obligatorio',
  'string.hex': 'El ID debe ser un hexadecimal válido',
  'string.length': 'El ID debe tener 24 caracteres'
});

export { crearInstalacionSchema, actualizarInstalacionSchema, idSchema };
