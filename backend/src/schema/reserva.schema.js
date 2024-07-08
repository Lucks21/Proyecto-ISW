import Joi from 'joi';
import { parse, isValid, format } from 'date-fns';

// Validación para el formato de fecha DD-MM-YYYY
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

// Esquema de validación para la reserva de un implemento
const reservaImplementoSchema = Joi.object({
  implementoId: Joi.string().required().messages({
    'any.required': 'El campo "implementoId" es requerido',
  }),
  fechaInicio: fechaSchema,
  fechaFin: fechaSchema.optional(),
  userId: Joi.string().required().messages({
    'any.required': 'El campo "userId" es requerido',
  })
});

// Esquema de validación para la reserva de una instalación
const reservaInstalacionSchema = Joi.object({
  instalacionId: Joi.string().required().messages({
    'any.required': 'El campo "instalacionId" es requerido',
  }),
  fechaInicio: fechaSchema,
  fechaFin: fechaSchema.optional(),
  userId: Joi.string().required().messages({
    'any.required': 'El campo "userId" es requerido',
  })
});

// Esquema de validación para cancelar una reserva
const cancelarReservaSchema = Joi.object({
  reservaId: Joi.string().required().messages({
    'any.required': 'El campo "reservaId" es requerido',
  })
});

// Esquema de validación para extender una reserva
const extenderReservaSchema = Joi.object({
  reservaId: Joi.string().required().messages({
    'any.required': 'El campo "reservaId" es requerido',
  }),
  nuevaFechaFin: fechaSchema.required().messages({
    'any.required': 'El campo "nuevaFechaFin" es requerido',
  })
});

export { 
  reservaImplementoSchema as validarReservaImplemento, 
  reservaInstalacionSchema as validarReservaInstalacion, 
  cancelarReservaSchema as validarCancelarReserva, 
  extenderReservaSchema as validarExtenderReserva 
};
