"use strict";
import Joi from 'joi';

// Definir el esquema para la validación de la configuración de días deshabilitados
const fechaSchema = Joi.string().pattern(/^\d{2}-\d{2}-\d{4}$/).custom((value, helpers) => {
  const [dia, mes, anio] = value.split('-');
  const date = new Date(`${anio}-${mes}-${dia}`);
  const now = new Date();

  // Verificar si la fecha es válida
  if (date.getFullYear() !== parseInt(anio) || date.getMonth() + 1 !== parseInt(mes) || date.getDate() !== parseInt(dia)) {
    return helpers.error('any.invalid');
  }

  // Verificar si la fecha no es en el pasado
  if (date < now) {
    return helpers.error('any.past');
  }

  return value;
}, 'validación de fecha').required().messages({
  'string.pattern.base': 'La fecha debe estar en formato DD-MM-YYYY',
  'any.required': 'La fecha es obligatoria',
  'any.invalid': 'La fecha no es válida',
  'any.past': 'La fecha no puede ser en el pasado'
});

const agregarDiaDeshabilitadoSchema = Joi.object({
  fecha: fechaSchema
});

export { agregarDiaDeshabilitadoSchema };
