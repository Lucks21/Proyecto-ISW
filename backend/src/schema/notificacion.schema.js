import Joi from 'joi';

const notificacionSchema = Joi.object({
  recursoId: Joi.string().required().messages({
    'any.required': 'El campo "recursoId" es requerido',
  }),
  recursoTipo: Joi.string().valid('implemento', 'instalacion').required().messages({
    'any.required': 'El campo "recursoTipo" es requerido',
    'any.only': 'El campo "recursoTipo" debe ser "implemento" o "instalacion"'
  }),
  userId: Joi.string().required().messages({
    'any.required': 'El campo "userId" es requerido',
  })
});

export { notificacionSchema };
