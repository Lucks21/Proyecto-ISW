import Joi from 'joi';

const reservaImplementoSchema = Joi.object({
  implementoId: Joi.string().required().messages({
    'any.required': 'El campo "implementoId" es requerido',
  }),
  fechaInicio: Joi.date().required().messages({
    'any.required': 'El campo "fechaInicio" es requerido',
  }),
  fechaFin: Joi.date().optional(),
  userId: Joi.string().required().messages({
    'any.required': 'El campo "userId" es requerido',
  })
});

const reservaInstalacionSchema = Joi.object({
  instalacionId: Joi.string().required().messages({
    'any.required': 'El campo "instalacionId" es requerido',
  }),
  fechaInicio: Joi.date().required().messages({
    'any.required': 'El campo "fechaInicio" es requerido',
  }),
  fechaFin: Joi.date().optional(),
  userId: Joi.string().required().messages({
    'any.required': 'El campo "userId" es requerido',
  })
});

const cancelarReservaSchema = Joi.object({
  reservaId: Joi.string().required().messages({
    'any.required': 'El campo "reservaId" es requerido',
  })
});

const extenderReservaSchema = Joi.object({
  reservaId: Joi.string().required().messages({
    'any.required': 'El campo "reservaId" es requerido',
  }),
  nuevaFechaFin: Joi.date().required().messages({
    'any.required': 'El campo "nuevaFechaFin" es requerido',
  })
});

export { reservaImplementoSchema, 
        reservaInstalacionSchema, 
        cancelarReservaSchema, 
        extenderReservaSchema };
