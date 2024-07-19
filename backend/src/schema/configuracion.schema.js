import Joi from 'joi';

// Validación para la fecha
const fechaSchema = Joi.string().pattern(/^\d{2}-\d{2}-\d{4}$/).required().messages({
  'string.pattern.base': 'La fecha debe estar en formato DD-MM-YYYY',
  'any.required': 'La fecha es obligatoria'
});

// Validación para agregar un día deshabilitado
const agregarDiaDeshabilitadoSchema = Joi.object({
  fecha: fechaSchema
});

// Validación para eliminar un día deshabilitado
const eliminarDiaDeshabilitadoSchema = Joi.object({
  fecha: fechaSchema
});

export { agregarDiaDeshabilitadoSchema, eliminarDiaDeshabilitadoSchema };
