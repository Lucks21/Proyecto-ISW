import Configuracion from '../models/configuracion.model.js';
import { parse, isValid, format } from 'date-fns';

const convertirAFecha = (fechaStr) => {
  console.log(`Convirtiendo fecha: ${fechaStr}`);
  const parsedDate = parse(fechaStr, 'dd-MM-yyyy', new Date());
  console.log(`Fecha convertida: ${format(parsedDate, 'yyyy-MM-dd')}`);

  if (!isValid(parsedDate)) {
    throw new Error('Fecha inválida. Use el formato DD-MM-YYYY.');
  }
  return parsedDate;
};

export const agregarDia = async (fecha) => {
  const fechaDate = convertirAFecha(fecha);

  let configuracion = await Configuracion.findOne();
  if (!configuracion) {
    configuracion = new Configuracion();
  }

  if (configuracion.diasDeshabilitados.some(dia => dia.getTime() === fechaDate.getTime())) {
    throw new Error('La fecha ya está deshabilitada.');
  }

  configuracion.diasDeshabilitados.push(fechaDate);
  await configuracion.save();
  return { message: 'Día deshabilitado agregado.', configuracion };
};

export const eliminarDia = async (fecha) => {
  const fechaDate = convertirAFecha(fecha);

  const configuracion = await Configuracion.findOne();
  if (!configuracion) {
    throw new Error('No se encontraron  días deshabilitados.');
  }

  configuracion.diasDeshabilitados = configuracion.diasDeshabilitados.filter(dia => dia.getTime() !== fechaDate.getTime());
  await configuracion.save();
  return { message: 'Día deshabilitado eliminado.', configuracion };
};

export const obtenerDias = async () => {
  const configuracion = await Configuracion.findOne();
  if (!configuracion) {
    throw new Error('No se encontraron  días deshabilitados.');
  }
  return configuracion.diasDeshabilitados;
};
