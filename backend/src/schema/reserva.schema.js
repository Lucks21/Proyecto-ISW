import Joi from 'joi';
import { parse, isValid, format, addHours } from 'date-fns';

// Validación para el formato de fecha y hora DD-MM-YYYY HH:mm
const fechaHoraSchema = Joi.string().pattern(/^\d{2}-\d{2}-\d{4}\s\d{2}:\d{2}$/).custom((value, helpers) => {
  const [fecha, hora] = value.split(' ');
  const parsedDate = parse(`${fecha} ${hora}`, 'dd-MM-yyyy HH:mm', new Date());
  if (!isValid(parsedDate)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'validación de fecha y hora').required().messages({
  'string.pattern.base': 'La fecha y hora deben estar en formato DD-MM-YYYY HH:mm',
  'any.required': 'La fecha y hora son obligatorias',
  'any.invalid': 'La fecha y hora no son válidas'
});

// Esquema de validación para la reserva de un implemento
const validarReservaImplemento = Joi.object({
  implementoId: Joi.string().required().messages({
    'any.required': 'El campo "implementoId" es requerido',
  }),
  fechaInicio: fechaHoraSchema,
  fechaFin: fechaHoraSchema.optional(),
  userId: Joi.string().required().messages({
    'any.required': 'El campo "userId" es requerido',
  })
});

// Esquema de validación para la reserva de una instalación
const validarReservaInstalacion = Joi.object({
  instalacionId: Joi.string().required().messages({
    'any.required': 'El campo "instalacionId" es requerido',
  }),
  fechaInicio: fechaHoraSchema,
  fechaFin: fechaHoraSchema.optional(),
  userId: Joi.string().required().messages({
    'any.required': 'El campo "userId" es requerido',
  })
});

// Esquema de validación para cancelar una reserva
const validarCancelarReserva = Joi.object({
  reservaId: Joi.string().required().messages({
    'any.required': 'El campo "reservaId" es requerido',
  })
});

// Esquema de validación para extender una reserva
const validarExtenderReserva = Joi.object({
  reservaId: Joi.string().required().messages({
    'any.required': 'El campo "reservaId" es requerido',
  }),
  nuevaFechaFin: fechaHoraSchema.required().messages({
    'any.required': 'El campo "nuevaFechaFin" es requerido',
  })
});

// Esquema de validación para finalizar una reserva
const validarFinalizarReserva = Joi.object({
  reservaId: Joi.string().required().messages({
    'any.required': 'El campo "reservaId" es requerido',
  })
});

export { 
  validarReservaImplemento, 
  validarReservaInstalacion, 
  validarCancelarReserva, 
  validarExtenderReserva,
  validarFinalizarReserva
};
