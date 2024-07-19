import Configuracion from '../models/configuracion.model.js';
import Reserva from '../models/reservas.model.js';
import Alumno from '../models/alumno.model.js';  // Importar el modelo Alumno
import { parse, isValid, format, startOfDay, endOfDay } from 'date-fns';
import { enviarCorreoCancelacion } from './email.services.js';  // Importar la función de envío de correos

// Función para convertir la fecha en formato DD-MM-YYYY a objeto Date
const convertirAFecha = (fechaStr) => {
  if (!fechaStr) {
    throw new Error('Fecha no proporcionada');
  }
  const parsedDate = parse(fechaStr, 'dd-MM-yyyy', new Date());
  if (!isValid(parsedDate)) {
    throw new Error(`Fecha inválida: ${fechaStr}. Use el formato DD-MM-YYYY.`);
  }
  return parsedDate;
};

// Función para cancelar reservas por fecha y enviar correos de notificación
const cancelarReservasPorFecha = async (fecha) => {
  const inicioDia = startOfDay(fecha);
  const finDia = endOfDay(fecha);

  const reservas = await Reserva.find({
    fechaInicio: { $gte: inicioDia, $lte: finDia },
    estado: 'activo'
  }).populate('userId'); 

  for (const reserva of reservas) {
    reserva.estado = 'no activo';
    await reserva.save();

    // Obtener el correo del alumno y enviar la notificación
    const alumno = reserva.userId;
    if (alumno && alumno.email) {
      await enviarCorreoCancelacion(alumno.email, reserva.implementoId || reserva.instalacionId, format(fecha, 'dd-MM-yyyy'));
    } else {
      console.error(`No se pudo enviar correo a ${alumno ? alumno.nombre : 'desconocido'} porque no tiene un email definido.`);
    }
  }

  return reservas.length;  // Retornar la cantidad de reservas canceladas
};

// Servicio para agregar un día deshabilitado
export const agregarDia = async (fecha) => {
  try {
    const fechaDate = convertirAFecha(fecha);
    let configuracion = await Configuracion.findOne();
    if (!configuracion) {
      configuracion = new Configuracion();
    }
    if (configuracion.diasDeshabilitados.some(dia => dia.getTime() === fechaDate.getTime())) {
      throw new Error(`La fecha ${fecha} ya está deshabilitada.`);
    }

    configuracion.diasDeshabilitados.push(fechaDate);
    await configuracion.save();

    // Cancelar reservas futuras en la fecha deshabilitada y obtener el número de reservas canceladas
    const reservasCanceladas = await cancelarReservasPorFecha(fechaDate);

    return { message: `Día deshabilitado agregado. Se han cancelado ${reservasCanceladas} reservas.`, configuracion };
  } catch (error) {
    throw new Error(`Error al agregar el día deshabilitado: ${error.message}`);
  }
};

// Servicio para eliminar un día deshabilitado
export const eliminarDia = async (fecha) => {
  try {
    const fechaDate = convertirAFecha(fecha);
    const configuracion = await Configuracion.findOne();
    if (!configuracion) {
      throw new Error('No se encontraron días deshabilitados.');
    }
    const diaEncontrado = configuracion.diasDeshabilitados.find(dia => dia.getTime() === fechaDate.getTime());
    if (!diaEncontrado) {
      throw new Error(`El día ${fecha} no se encuentra en los días deshabilitados.`);
    }
    configuracion.diasDeshabilitados = configuracion.diasDeshabilitados.filter(dia => dia.getTime() !== fechaDate.getTime());
    await configuracion.save();
    return { message: 'Día deshabilitado eliminado.', configuracion };
  } catch (error) {
    throw new Error(`Error al eliminar el día deshabilitado: ${error.message}`);
  }
};

// Servicio para obtener los días deshabilitados
export const obtenerDias = async () => {
  try {
    const configuracion = await Configuracion.findOne();
    if (!configuracion) {
      throw new Error('No se encontraron días deshabilitados.');
    }
    return configuracion.diasDeshabilitados;
  } catch (error) {
    throw new Error(`Error al obtener los días deshabilitados: ${error.message}`);
  }
};

export default {
  agregarDia,
  eliminarDia,
  obtenerDias,
};
