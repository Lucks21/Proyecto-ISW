import mongoose from 'mongoose';
import Joi from 'joi';

const implementoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del implemento es requerido'],
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción del implemento es requerida'],
  },
  cantidad: {
    type: Number,
    required: [true, 'La cantidad del implemento es requerida'],
  },
  disponible: {
    type: Boolean,
    default: true,
  },
});

const Implemento = mongoose.model('Implemento', implementoSchema);

function validateImplemento(implemento) {
  const schema = Joi.object({
    nombre: Joi.string().required().messages({
      'string.empty': 'El nombre del implemento no puede estar vacío',
      'any.required': 'El nombre del implemento es requerido',
    }),
    descripcion: Joi.string().required().messages({
      'string.empty': 'La descripción del implemento no puede estar vacía',
      'any.required': 'La descripción del implemento es requerida',
    }),
    cantidad: Joi.number().required().messages({
      'number.base': 'La cantidad del implemento debe ser un número',
      'any.required': 'La cantidad del implemento es requerida',
    }),
    disponible: Joi.boolean(),
  });

  return schema.validate(implemento);
}

export { Implemento, validateImplemento };