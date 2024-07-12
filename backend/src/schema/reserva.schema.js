import Joi from 'joi';

// Validación para el formato de fecha y hora
const fechaHoraSchema = Joi.object({
  fecha: Joi.string().pattern(/^\d{2}-\d{2}-\d{4}$/).required().messages({
    'string.pattern.base': 'La fecha debe estar en formato DD-MM-YYYY',
    'any.required': 'La fecha es obligatoria'
  }),
  hora: Joi.string().pattern(/^\d{2}:\d{2}$/).required().messages({
    'string.pattern.base': 'La hora debe estar en formato HH:MM',
    'any.required': 'La hora es obligatoria'
  })
}).required();

// Esquema de validación para la reserva de un implemento
const validarReservaImplemento = Joi.object({
  implementoId: Joi.string().required().messages({
    'any.required': 'El campo "implementoId" es requerido',
  }),
  fechaInicio: fechaHoraSchema.required().messages({
    'any.required': 'El campo "fechaInicio" es requerido',
  }),
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
  fechaInicio: fechaHoraSchema.required().messages({
    'any.required': 'El campo "fechaInicio" es requerido',
  }),
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
const validarReservasActivasPorIdSchema = Joi.object({
  recursoId: Joi.string().required().messages({
    'any.required': 'El campo "recursoId" es requerido',
  }),
  recursoTipo: Joi.string().valid('implemento', 'instalacion').required().messages({
    'any.required': 'El campo "recursoTipo" es requerido',
    'any.only': 'El campo "recursoTipo" debe ser "implemento" o "instalacion"'
  })
}).unknown(true);
export { 
  validarReservaImplemento, 
  validarReservaInstalacion, 
  validarCancelarReserva, 
  validarExtenderReserva,
  validarReservasActivasPorIdSchema,
};
