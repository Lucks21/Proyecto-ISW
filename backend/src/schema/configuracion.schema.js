import Joi from 'joi';
import { parse, isValid, format } from 'date-fns';

const fechaSchema = Joi.string().pattern(/^\d{2}-\d{2}-\d{4}$/).custom((value, helpers) => {
  console.log(`Validando fecha: ${value}`);
  
  const parsedDate = parse(value, 'dd-MM-yyyy', new Date());
  console.log(`Fecha convertida: ${format(parsedDate, 'yyyy-MM-dd')}`);

  if (!isValid(parsedDate)) {
    console.log('Fecha inválida durante la validación');
    return helpers.error('any.invalid');
  }

  const now = new Date();
  if (parsedDate < now) {
    console.log('Fecha en el pasado durante la validación');
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