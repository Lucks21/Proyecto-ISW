// backend/src/services/Reserva.services.js
import Reserva from '../models/reservas.model.js';
import Configuracion from '../models/configuracion.model.js';
import { addHours, isFuture, differenceInMinutes, startOfDay, endOfDay } from 'date-fns';

const normalizarFechaHora = (fecha, hora) => {
  const [day, month, year] = fecha.split('-');
  const [hour, minute] = hora.split(':');
  return new Date(year, month - 1, day, hour, minute, 0, 0);
};

// Servicio para registrar una reserva de implemento
async function registrarReservaImplemento(implementoId, fechaInicio, fechaFin, userId) {
  try {
    const fechaInicioNormalizada = normalizarFechaHora(fechaInicio.fecha, fechaInicio.hora);
    const fechaFinNormalizada = normalizarFechaHora(fechaFin.fecha, fechaFin.hora);

    if (!isFuture(fechaInicioNormalizada)) {
      return { error: 'La fecha de inicio no puede ser en el pasado.' };
    }

    // Obtener los días deshabilitados desde la base de datos
    const configuracion = await Configuracion.findOne();
    if (configuracion && configuracion.diasDeshabilitados.some(dia => dia.getTime() === fechaInicioNormalizada.getTime())) {
      return { error: 'La fecha de inicio está deshabilitada para reservas.' };
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
async function finalizarReserva(reservaId) {
  try {
    const reserva = await Reserva.findById(reservaId);
    if (!reserva) {
      return { error: 'Reserva no encontrada.' };
    }

    reserva.fechaFin = new Date();
    await reserva.save();
    return { message: 'Reserva finalizada con éxito.' };
  } catch (error) {
    console.error("Error en finalizarReserva: ", error);
    return { error: "Error interno del servidor." };
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
  cancelarReserva,
  extenderReserva,
  finalizarReserva,
  getAllReservasActivos,
  getAllReservasByUser,
  obtenerDatosGraficos
};
