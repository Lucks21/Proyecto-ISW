import Configuracion from '../models/configuracion.model.js';
import { parse, isValid, format } from 'date-fns';

// Función para convertir la fecha en formato DD-MM-YYYY a objeto Date
const convertirAFecha = (fechaStr) => {
  console.log(`Convirtiendo fecha: ${fechaStr}`);
  const parsedDate = parse(fechaStr, 'dd-MM-yyyy', new Date());
  console.log(`Fecha convertida: ${format(parsedDate, 'yyyy-MM-dd')}`);

  if (!isValid(parsedDate)) {
    throw new Error('Fecha inválida. Use el formato DD-MM-YYYY.');
  }
  return parsedDate;
};

// Servicio para agregar un día deshabilitado
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

// Servicio para eliminar un día deshabilitado
export const eliminarDia = async (fecha) => {
  const fechaDate = convertirAFecha(fecha);

  const configuracion = await Configuracion.findOne();
  if (!configuracion) {
    throw new Error('No se encontraron días deshabilitados.');
  }

  configuracion.diasDeshabilitados = configuracion.diasDeshabilitados.filter(dia => dia.getTime() !== fechaDate.getTime());
  await configuracion.save();
  return { message: 'Día deshabilitado eliminado.', configuracion };
};

// Servicio para obtener los días deshabilitados
export const obtenerDias = async () => {
  const configuracion = await Configuracion.findOne();
  if (!configuracion) {
    throw new Error('No se encontraron días deshabilitados.');
  }
  return configuracion.diasDeshabilitados;
};

// Controlador para obtener los días deshabilitados
export const obtenerDiasDeshabilitados = async (req, res) => {
  try {
    const resultado = await obtenerDias();
    const diasFormateados = resultado.map(dia => format(dia, 'yyyy-MM-dd'));
    res.status(200).json({ message: 'Días deshabilitados obtenidos con éxito.', data: diasFormateados });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los días deshabilitados.', error });
  }
};
