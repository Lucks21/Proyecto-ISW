import Joi from "joi";

const prestamoSchema = Joi.object({
  usuarioId: Joi.string().required().messages({
    "string.empty": "El ID del usuario no puede estar vacío.",
    "any.required": "El ID del usuario es obligatorio."
  }),
  implementoId: Joi.string().optional(),
  instalacionId: Joi.string().optional(),
  fechaInicio: Joi.date().required().messages({
    "date.base": "La fecha de inicio debe ser una fecha válida.",
    "any.required": "La fecha de inicio es obligatoria."
  }),
  fechaFin: Joi.date().optional(),
  estado: Joi.string().valid('disponible', 'no disponible').required().messages({
    "string.empty": "El estado no puede estar vacío.",
    "any.required": "El estado es obligatorio.",
    "any.only": "El estado debe ser 'disponible' o 'no disponible'."
  })
});

export { prestamoSchema };