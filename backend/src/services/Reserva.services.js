import Reserva from '../models/reservas.model.js';
import { obtenerDias } from './configuracion.services.js';
import Alumno from '../models/alumno.model.js';
import Implemento from '../models/implementos.model.js';
import mongoose from 'mongoose';
import { endOfMinute, isFuture, differenceInMinutes, startOfDay, endOfDay, startOfHour, addMinutes, parseISO, format } from 'date-fns';
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
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return { error: 'ID de alumno no es un ObjectId válido.' };
    }

    const alumno = await Alumno.findById(userId);
    if (!alumno) {
      return { error: 'ID de alumno no válido o no encontrado.' };
    }

    if (!mongoose.Types.ObjectId.isValid(implementoId)) {
      return { error: 'ID de implemento no es válido.' };
    }

    const implemento = await Implemento.findById(implementoId);
    if (!implemento) {
      return { error: 'Implemento no encontrado.' };
    }

    // Verificar el estado del implemento
    if (implemento.estado === 'no disponible') {
      return { error: 'El implemento no está disponible para reservas.' };
    }

    const fechaInicioNormalizada = normalizarFechaHora(fechaInicio.fecha, fechaInicio.hora);
    const fechaFinNormalizada = normalizarFechaHora(fechaFin.fecha, fechaFin.hora);

    if (!isFuture(fechaInicioNormalizada)) {
      return { error: 'La fecha de inicio no puede ser en el pasado.' };
    }

    const diasDeshabilitados = await obtenerDias();
    const fechaReservaNormalizada = normalizarFecha(fechaInicioNormalizada);
    if (diasDeshabilitados.some(dia => normalizarFecha(dia).getTime() === fechaReservaNormalizada.getTime())) {
      return { error: `La fecha ${fechaInicio.fecha} está deshabilitada para reservas.` };
    }

    const duracionReserva = differenceInMinutes(fechaFinNormalizada, fechaInicioNormalizada);
    if (duracionReserva <= 0 || duracionReserva > 60) {
      return { error: 'La duración de la reserva debe ser de hasta 1 hora.' };
    }

    const reservasExistentes = await Reserva.find({
      implementoId,
      $or: [
        { fechaInicio: { $lt: fechaFinNormalizada }, fechaFin: { $gt: fechaInicioNormalizada } }
      ]
    });
    if (reservasExistentes.length > 0) {
      return { error: 'La hora solicitada ya está reservada.' };
    }

    const reservasUsuario = await Reserva.find({
      userId,
      implementoId,
      fechaInicio: {
        $gte: startOfDay(fechaInicioNormalizada),
        $lte: endOfDay(fechaInicioNormalizada)
      }
    });

    const totalHorasReservadas = reservasUsuario.reduce((total, reserva) => {
      return total + differenceInMinutes(reserva.fechaFin, reserva.fechaInicio) / 60;
    }, 0);

    if (totalHorasReservadas >= 2) {
      return { error: 'No puede reservar más de 2 horas por este implemento en un solo día.' };
    }

    // Validar y permitir reservas en horas fraccionadas
    const horaActual = new Date();
    const minutosRestantes = differenceInMinutes(startOfHour(addMinutes(horaActual, 60)), horaActual);

    const inicioHoraCompleta = startOfHour(fechaInicioNormalizada);
    const finHoraCompleta = addMinutes(inicioHoraCompleta, 60);

    if (fechaInicioNormalizada.getMinutes() !== 0 && fechaInicioNormalizada.getTime() >= horaActual.getTime() && fechaFinNormalizada.getTime() <= finHoraCompleta.getTime()) {
      const nuevaReserva = new Reserva({
        userId,
        implementoId,
        fechaInicio: fechaInicioNormalizada,
        fechaFin: fechaFinNormalizada,
        estado: 'activo'
      });

      await nuevaReserva.save();
      return { message: 'Reserva creada con éxito.', data: nuevaReserva };
    }

    // Permitir reservas que comiencen en horas completas
    if (fechaInicioNormalizada.getMinutes() === 0) {
      const nuevaReserva = new Reserva({
        userId,
        implementoId,
        fechaInicio: fechaInicioNormalizada,
        fechaFin: fechaFinNormalizada,
        estado: 'activo'
      });

      await nuevaReserva.save();
      return { message: 'Reserva creada con éxito.', data: nuevaReserva };
    }

    return { error: 'No se pueden realizar reservas en horas fraccionadas. La siguiente reserva debe comenzar en la siguiente hora completa.' };
  } catch (error) {
    console.error("Error en registrarReservaImplemento: ", error);
    return { error: "Error interno del servidor." };
  }
}

// Servicio para registrar una reserva de instalación
async function registrarReservaInstalacion(instalacionId, fechaInicio, fechaFin, userId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return { error: 'ID de alumno no es un ObjectId válido.' };
    }

    const alumno = await Alumno.findById(userId);
    if (!alumno) {
      return { error: 'ID de alumno no válido o no encontrado.' };
    }

    if (!mongoose.Types.ObjectId.isValid(instalacionId)) {
      return { error: 'ID de instalación no es válido.' };
    }

    const instalacion = await Instalacion.findById(instalacionId);
    if (!instalacion) {
      return { error: 'Instalación no encontrada.' };
    }

    // Verificar el estado de la instalación
    if (instalacion.estado === 'no disponible') {
      return { error: 'La instalación no está disponible para reservas.' };
    }

    const fechaInicioNormalizada = normalizarFechaHora(fechaInicio.fecha, fechaInicio.hora);
    const fechaFinNormalizada = normalizarFechaHora(fechaFin.fecha, fechaFin.hora);

    if (!isFuture(fechaInicioNormalizada)) {
      return { error: 'La fecha de inicio no puede ser en el pasado.' };
    }

    const diasDeshabilitados = await obtenerDias();
    const fechaReservaNormalizada = normalizarFecha(fechaInicioNormalizada);
    if (diasDeshabilitados.some(dia => normalizarFecha(dia).getTime() === fechaReservaNormalizada.getTime())) {
      return { error: `La fecha ${fechaInicio.fecha} está deshabilitada para reservas.` };
    }

    const duracionReserva = differenceInMinutes(fechaFinNormalizada, fechaInicioNormalizada);
    if (duracionReserva <= 0 || duracionReserva > 60) {
      return { error: 'La duración de la reserva debe ser de hasta 1 hora.' };
    }

    const reservasExistentes = await Reserva.find({
      instalacionId,
      $or: [
        { fechaInicio: { $lt: fechaFinNormalizada }, fechaFin: { $gt: fechaInicioNormalizada } }
      ]
    });
    if (reservasExistentes.length > 0) {
      return { error: 'La hora solicitada ya está reservada.' };
    }

    const reservasUsuario = await Reserva.find({
      userId,
      instalacionId,
      fechaInicio: {
        $gte: startOfDay(fechaInicioNormalizada),
        $lte: endOfDay(fechaInicioNormalizada)
      }
    });

    const totalHorasReservadas = reservasUsuario.reduce((total, reserva) => {
      return total + differenceInMinutes(reserva.fechaFin, reserva.fechaInicio) / 60;
    }, 0);

    if (totalHorasReservadas >= 2) {
      return { error: 'No puede reservar más de 2 horas por esta instalación en un solo día.' };
    }

    // Validar y permitir reservas en horas fraccionadas
    const horaActual = new Date();
    const minutosRestantes = differenceInMinutes(startOfHour(addMinutes(horaActual, 60)), horaActual);

    const inicioHoraCompleta = startOfHour(fechaInicioNormalizada);
    const finHoraCompleta = addMinutes(inicioHoraCompleta, 60);

    if (fechaInicioNormalizada.getMinutes() !== 0 && fechaInicioNormalizada.getTime() >= horaActual.getTime() && fechaFinNormalizada.getTime() <= finHoraCompleta.getTime()) {
      const nuevaReserva = new Reserva({
        userId,
        instalacionId,
        fechaInicio: fechaInicioNormalizada,
        fechaFin: fechaFinNormalizada,
        estado: 'activo'
      });

      await nuevaReserva.save();
      return { message: 'Reserva creada con éxito.', data: nuevaReserva };
    }

    // Permitir reservas que comiencen en horas completas
    if (fechaInicioNormalizada.getMinutes() === 0) {
      const nuevaReserva = new Reserva({
        userId,
        instalacionId,
        fechaInicio: fechaInicioNormalizada,
        fechaFin: fechaFinNormalizada,
        estado: 'activo'
      });

      await nuevaReserva.save();
      return { message: 'Reserva creada con éxito.', data: nuevaReserva };
    }

    return { error: 'No se pueden realizar reservas en horas fraccionadas. La siguiente reserva debe comenzar en la siguiente hora completa.' };
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

    const ahora = new Date();
    const minutosParaInicio = differenceInMinutes(reserva.fechaInicio, ahora);

    if (minutosParaInicio < 30) {
      return { error: 'No se puede cancelar la reserva con menos de 30 minutos de anticipación.' };
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

async function getAllReservasActivosById(recursoId, recursoTipo) {
  try {
    if (!mongoose.Types.ObjectId.isValid(recursoId)) {
      return [null, 'ID de recurso no es un ObjectId válido.'];
    }

    let query = {};
    if (recursoTipo === 'implemento') {
      query = { implementoId: recursoId, estado: 'activo' };
    } else if (recursoTipo === 'instalacion') {
      query = { instalacionId: recursoId, estado: 'activo' };
    }

    const reservas = await Reserva.find(query);
    return [reservas, null];
  } catch (error) {
    console.error("Error en getAllReservasActivosById: ", error);
    return [null, "Error interno del servidor."];
  }
}

// obtener los implementos reservados
async function getImplementosReservados() {
  try {
    const implementosReservados = await Implemento.find({ estado: 'no disponible' });
    return implementosReservados;
  } catch (error) {
    throw new Error('Error al obtener implementos reservados: ' + error.message);
  }
}
// obtener las instalaciones reservadas
async function getInstalacionesReservadas() {
  try {
    const instalacionesReservadas = await Instalacion.find({ estado: 'no disponible' });
    return instalacionesReservadas;
  } catch (error) {
    throw new Error('Error al obtener instalaciones reservadas: ' + error.message);
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
  obtenerDatosGraficos,
  getAllReservasActivosById,
  getImplementosReservados,
  getInstalacionesReservadas,
};
