import mongoose from 'mongoose';
import Joi from 'joi';

const instalacionSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la instalación es requerido'],
  },
  ubicacion: {
    type: String,
    required: [true, 'La ubicación de la instalación es requerida'],
  },
  capacidad: {
    type: Number,
    required: [true, 'La capacidad de la instalación es requerida'],
  },
});

const Instalacion = mongoose.model('Instalacion', instalacionSchema);

function validateInstalacion(instalacion) {
  const schema = Joi.object({
    nombre: Joi.string().required().messages({
      'string.empty': 'El nombre de la instalación no puede estar vacío',
      'any.required': 'El nombre de la instalación es requerido',
    }),
    ubicacion: Joi.string().required().messages({
      'string.empty': 'La ubicación de la instalación no puede estar vacía',
      'any.required': 'La ubicación de la instalación es requerida',
    }),
    capacidad: Joi.number().required().messages({
      'number.base': 'La capacidad de la instalación debe ser un número',
      'any.required': 'La capacidad de la instalación es requerida',
    }),
  });

  return schema.validate(instalacion);
}

export { Instalacion, validateInstalacion };