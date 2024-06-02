import Joi from "joi";

const dañoSchema = Joi.object({
  implementoId: Joi.string().required().messages({
    "string.empty": "El ID del implemento no puede estar vacío.",
    "any.required": "El ID del implemento es obligatorio."
  }),
  instalacionId: Joi.string().optional(),
  descripcion: Joi.string().required().messages({
    "string.empty": "La descripción no puede estar vacía.",
    "any.required": "La descripción es obligatoria."
  }),
  responsable: Joi.string().required().messages({
    "string.empty": "El responsable no puede estar vacío.",
    "any.required": "El responsable es obligatorio."
  }),
  costoReparacion: Joi.number().required().messages({
    "number.base": "El costo de reparación debe ser un número.",
    "any.required": "El costo de reparación es obligatorio."
  })
});

export { dañoSchema };