import Reserva from '../models/reservas.model.js';
import { obtenerDias } from './configuracion.services.js';
import Alumno from '../models/alumno.model.js';
import Implemento from '../models/implementos.model.js';
import mongoose from 'mongoose';
import { endOfMinute, addHours, isPast, isFuture, differenceInMinutes, startOfDay, endOfDay } from 'date-fns';
import Instalacion from '../models/Instalacion.model.js';

const normalizarFechaHora = (fecha, hora) => {
  const [day, month, year] = fecha.split('-');
  const [hour, minute] = hora.split(':');
  return new Date(year, month - 1, day, hour, minute, 0, 0);
};

const normalizarFecha = (fecha) => {
  const date = new Date(fecha);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

// Servicio para registrar una reserva de implemento
async function registrarReservaImplemento(implementoId, fechaInicio, fechaFin, userId) {
  try {
    // Verificar si el userId es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return { error: 'ID de alumno no es un ObjectId válido.' };
    }

    // Validar si el ID del alumno es válido
    console.log(`Buscando alumno con ID: ${userId}`);
    const alumno = await Alumno.findById(userId);
    console.log(`Resultado de la búsqueda de alumno: ${alumno}`);
    if (!alumno) {
      return { error: 'ID de alumno no válido o no encontrado.' };
    }

    // Verificar si el implementoId es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(implementoId)) {
      return { error: 'ID de implemento no es válido.' };
    }


    const fechaInicioNormalizada = normalizarFechaHora(fechaInicio.fecha, fechaInicio.hora);
    const fechaFinNormalizada = normalizarFechaHora(fechaFin.fecha, fechaFin.hora);

    if (!isFuture(fechaInicioNormalizada)) {
      return { error: 'La fecha de inicio no puede ser en el pasado.' };
    }

    // Obtener los días deshabilitados desde la base de datos
    const diasDeshabilitados = await obtenerDias();
    const fechaReservaNormalizada = normalizarFecha(fechaInicioNormalizada);
    if (diasDeshabilitados.some(dia => normalizarFecha(dia).getTime() === fechaReservaNormalizada.getTime())) {
      return { error: `La fecha ${fechaInicio.fecha} está deshabilitada para reservas.` };
    }

    if (differenceInMinutes(fechaFinNormalizada, fechaInicioNormalizada) < 60) {
      return { error: 'La duración mínima de la reserva es de 1 hora.' };
    }

    // Verificar disponibilidad de la hora solicitada
    const reservasExistentes = await Reserva.find({
      implementoId,
      $or: [
        { fechaInicio: { $lt: fechaFinNormalizada }, fechaFin: { $gt: fechaInicioNormalizada } }
      ]
    });
    if (reservasExistentes.length > 0) {
      return { error: 'La hora solicitada ya está reservada.' };
    }

    // Verificar que el estudiante no exceda el límite de 2 horas por día
    const reservasUsuario = await Reserva.find({
      userId,
      fechaInicio: {
        $gte: startOfDay(fechaInicioNormalizada),
        $lte: endOfDay(fechaInicioNormalizada)
      }
    });

    const totalHorasReservadas = reservasUsuario.reduce((total, reserva) => {
      return total + differenceInMinutes(reserva.fechaFin, reserva.fechaInicio) / 60;
    }, 0);

    if (totalHorasReservadas >= 2) {
      return { error: 'No puede reservar más de 2 horas en un solo día.' };
    }

    const nuevaReserva = new Reserva({
      userId,
      implementoId,
      fechaInicio: fechaInicioNormalizada,
      fechaFin: fechaFinNormalizada,
      estado: 'activo'
    });

    await nuevaReserva.save();
    return { message: 'Reserva creada con éxito.', data: nuevaReserva };
  } catch (error) {
    console.error("Error en registrarReservaImplemento: ", error);
    return { error: "Error interno del servidor." };
  }
}

// Servicio para reservar instalacion

async function registrarReservaInstalacion(instalacionId, fechaInicio, fechaFin, userId) {
  try {
    // Verificar si el userId es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return { error: 'ID de alumno no es un ObjectId válido.' };
    }

    // Validar si el ID del alumno es válido
    console.log(`Buscando alumno con ID: ${userId}`);
    const alumno = await Alumno.findById(userId);
    if (!alumno) {
      return { error: 'ID de alumno no válido o no encontrado.' };
    }

    // Verificar si el instalacionId es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(instalacionId)) {
      return { error: 'ID de instalación no es válido.' };
    }

    const instalacion = await Instalacion.findById(instalacionId);
    if (!instalacion) {
      return { error: 'Instalación no encontrada.' };
    }

    const fechaInicioNormalizada = normalizarFechaHora(fechaInicio.fecha, fechaInicio.hora);
    const fechaFinNormalizada = normalizarFechaHora(fechaFin.fecha, fechaFin.hora);

    if (!isFuture(fechaInicioNormalizada)) {
      return { error: 'La fecha de inicio no puede ser en el pasado.' };
    }

    // Obtener los días deshabilitados desde la base de datos
    const diasDeshabilitados = await obtenerDias();
    const fechaReservaNormalizada = normalizarFecha(fechaInicioNormalizada);
    if (diasDeshabilitados.some(dia => normalizarFecha(dia).getTime() === fechaReservaNormalizada.getTime())) {
      return { error: `La fecha ${fechaInicio.fecha} está deshabilitada para reservas.` };
    }

    if (differenceInMinutes(fechaFinNormalizada, fechaInicioNormalizada) < 60) {
      return { error: 'La duración mínima de la reserva es de 1 hora.' };
    }

    // Verificar disponibilidad de la hora solicitada
    const reservasExistentes = await Reserva.find({
      instalacionId,
      $or: [
        { fechaInicio: { $lt: fechaFinNormalizada }, fechaFin: { $gt: fechaInicioNormalizada } }
      ]
    });
    if (reservasExistentes.length > 0) {
      return { error: 'La hora solicitada ya está reservada.' };
    }

    // Verificar que el estudiante no exceda el límite de 2 horas por día
    const reservasUsuario = await Reserva.find({
      userId,
      fechaInicio: {
        $gte: startOfDay(fechaInicioNormalizada),
        $lte: endOfDay(fechaInicioNormalizada)
      }
    });

    const totalHorasReservadas = reservasUsuario.reduce((total, reserva) => {
      return total + differenceInMinutes(reserva.fechaFin, reserva.fechaInicio) / 60;
    }, 0);

    if (totalHorasReservadas >= 2) {
      return { error: 'No puede reservar más de 2 horas en un solo día.' };
    }

    const nuevaReserva = new Reserva({
      userId,
      instalacionId,
      fechaInicio: fechaInicioNormalizada,
      fechaFin: fechaFinNormalizada,
      estado: 'activo'
    });

    await nuevaReserva.save();
    return { message: 'Reserva creada con éxito.', data: nuevaReserva };
  } catch (error) {
    console.error("Error en registrarReservaInstalacion: ", error);
    return { error: "Error interno del servidor." };
  }
}
// Servicio para cancelar una reserva
async function cancelarReserva(reservaId) {
  try {
    const reserva = await Reserva.findById(reservaId);
    if (!reserva) {
      return { error: 'Reserva no encontrada.' };
    }

    reserva.estado = 'no activo';
    await reserva.save();
    return { message: 'Reserva cancelada con éxito.' };
  } catch (error) {
    console.error("Error en cancelarReserva: ", error);
    return { error: "Error interno del servidor." };
  }
}

// Servicio para extender una reserva
async function extenderReserva(reservaId, nuevaFechaFin) {
  try {
    const reserva = await Reserva.findById(reservaId);
    if (!reserva) {
      return { error: 'Reserva no encontrada.' };
    }

    const fechaFinNormalizada = normalizarFechaHora(nuevaFechaFin.fecha, nuevaFechaFin.hora);
    if (differenceInMinutes(fechaFinNormalizada, reserva.fechaFin) < 60) {
      return { error: 'La extensión mínima de la reserva es de 1 hora.' };
    }

    // Verificar disponibilidad de la nueva hora solicitada
    const reservasExistentes = await Reserva.find({
      implementoId: reserva.implementoId,
      $or: [
        { fechaInicio: { $lt: fechaFinNormalizada }, fechaFin: { $gt: reserva.fechaFin } }
      ]
    });
    if (reservasExistentes.length > 0) {
      return { error: 'La hora solicitada ya está reservada.' };
    }

    reserva.fechaFin = fechaFinNormalizada;
    await reserva.save();
    return { message: 'Reserva extendida con éxito.' };
  } catch (error) {
    console.error("Error en extenderReserva: ", error);
    return { error: "Error interno del servidor." };
  }
}

// Servicio para finalizar una reserva
async function finalizarReservasExpiradas() {
  try {
    console.log("Buscando reservas expiradas...");
    const now = new Date();
    const reservasExpiradas = await Reserva.find({ fechaFin: { $lte: endOfMinute(now) }, estado: 'activo' });

    if (reservasExpiradas.length === 0) {
      console.log('No hay reservas expiradas para finalizar.');
      return { message: 'No hay reservas expiradas para finalizar.' };
    }

    for (const reserva of reservasExpiradas) {
      console.log(`Finalizando reserva con ID: ${reserva._id}`);
      reserva.estado = 'no activo';
      await reserva.save();
    }

    console.log(`Finalizadas ${reservasExpiradas.length} reservas expiradas.`);
    return { message: `Finalizadas ${reservasExpiradas.length} reservas expiradas.` };
  } catch (error) {
    console.error("Error en finalizarReservasExpiradas:", error);
    throw new Error("Error en finalizarReservasExpiradas");
  }
}

// Servicio para obtener todas las reservas activas
async function getAllReservasActivos() {
  try {
    const reservas = await Reserva.find({ fechaFin: { $gt: new Date() } });
    return [reservas, null];
  } catch (error) {
    console.error("Error en getAllReservasActivos: ", error);
    return [null, "Error interno del servidor."];
  }
}

// Servicio para obtener todas las reservas de un usuario
async function getAllReservasByUser(userId) {
  try {
    const reservas = await Reserva.find({ userId });
    return [reservas, null];
  } catch (error) {
    console.error("Error en getAllReservasByUser: ", error);
    return [null, "Error interno del servidor."];
  }
}

// Servicio para obtener datos para gráficos
async function obtenerDatosGraficos() {
  try {
    const reservas = await Reserva.find();
    const data = {
      totalReservas: reservas.length,
      reservasPorImplemento: {},
      reservasPorInstalacion: {},
    };

    reservas.forEach((reserva) => {
      if (reserva.implementoId) {
        data.reservasPorImplemento[reserva.implementoId] = (data.reservasPorImplemento[reserva.implementoId] || 0) + 1;
      }
      if (reserva.instalacionId) {
        data.reservasPorInstalacion[reserva.instalacionId] = (data.reservasPorInstalacion[reserva.instalacionId] || 0) + 1;
      }
    });

    return [data, null];
  } catch (error) {
    console.error("Error en obtenerDatosGraficos: ", error);
    return [null, "Error interno del servidor."];
  }
}

export default {
  registrarReservaImplemento,
  registrarReservaInstalacion,
  cancelarReserva,
  extenderReserva,
  finalizarReservasExpiradas,
  getAllReservasActivos,
  getAllReservasByUser,
  obtenerDatosGraficos
};
