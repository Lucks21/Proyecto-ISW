import Reserva from '../models/reservas.model.js';
import Configuracion from '../models/configuracion.model.js';
import Alumno from '../models/alumno.model.js';
import { parse, isValid, format, addHours, isFuture, differenceInMinutes, isSameDay } from 'date-fns';

const normalizarFechaHora = (fecha, hora) => {
  const [day, month, year] = fecha.split('-');
  const [hour, minute] = hora.split(':');
  return new Date(year, month - 1, day, hour, minute, 0, 0);
};

// Verificar si el userId pertenece a un Alumno
const verificarUsuario = async (userId) => {
  const alumno = await Alumno.findById(userId);
  return alumno;
};

// Servicio para registrar una reserva de implemento
async function registrarReservaImplemento(implementoId, fechaInicio, fechaFin, userId) {
  const usuario = await verificarUsuario(userId);
  if (!usuario) {
    return { error: 'Usuario no encontrado.' };
  }

  const { fecha, hora } = fechaInicio;
  const fechaInicioNormalizada = normalizarFechaHora(fecha, hora);

  if (!isFuture(fechaInicioNormalizada)) {
    return { error: 'La fecha de inicio no puede ser en el pasado.' };
  }

  // Obtener los días deshabilitados desde la base de datos
  const configuracion = await Configuracion.findOne();
  if (configuracion && configuracion.diasDeshabilitados.some(dia => dia.getTime() === fechaInicioNormalizada.getTime())) {
    return { error: 'La fecha de inicio está deshabilitada para reservas.' };
  }

  let fechaFinNormalizada = addHours(fechaInicioNormalizada, 1); // Duración por defecto de 1 hora
  if (fechaFin && fechaFin.fecha && fechaFin.hora) {
    fechaFinNormalizada = normalizarFechaHora(fechaFin.fecha, fechaFin.hora);
    if (differenceInMinutes(fechaFinNormalizada, fechaInicioNormalizada) < 60) {
      return { error: 'La duración mínima de la reserva es de 1 hora.' };
    }
  }

  // Verificar disponibilidad de la hora solicitada
  const reservasExistentes = await Reserva.find({
    implemento: implementoId,
    $or: [
      { fechaInicio: { $lt: fechaFinNormalizada }, fechaFin: { $gt: fechaInicioNormalizada } }
    ]
  });
  if (reservasExistentes.length > 0) {
    return { error: 'La hora solicitada ya está reservada.' };
  }

  // Verificar que el estudiante no exceda el límite de 2 horas por día
  const reservasUsuario = await Reserva.find({
    user: userId,
    $where: function() {
      return isSameDay(this.fechaInicio, fechaInicioNormalizada);
    }
  });

  const totalHorasReservadas = reservasUsuario.reduce((total, reserva) => {
    return total + differenceInMinutes(reserva.fechaFin, reserva.fechaInicio) / 60;
  }, 0);

  const horasSolicitadas = differenceInMinutes(fechaFinNormalizada, fechaInicioNormalizada) / 60;
  if (totalHorasReservadas + horasSolicitadas > 2) {
    return { error: 'No puedes reservar más de 2 horas por día.' };
  }

  const nuevaReserva = new Reserva({
    implemento: implementoId,
    fechaInicio: fechaInicioNormalizada,
    fechaFin: fechaFinNormalizada,
    user: userId,
  });

  await nuevaReserva.save();
  return { message: 'Reserva de implemento registrada con éxito.' };
}

// Servicio para registrar una reserva de instalación
async function registrarReservaInstalacion(instalacionId, fechaInicio, fechaFin, userId) {
  const usuario = await verificarUsuario(userId);
  if (!usuario) {
    return { error: 'Usuario no encontrado.' };
  }

  const { fecha, hora } = fechaInicio;
  const fechaInicioNormalizada = normalizarFechaHora(fecha, hora);

  if (!isFuture(fechaInicioNormalizada)) {
    return { error: 'La fecha de inicio no puede ser en el pasado.' };
  }

  // Obtener los días deshabilitados desde la base de datos
  const configuracion = await Configuracion.findOne();
  if (configuracion && configuracion.diasDeshabilitados.some(dia => dia.getTime() === fechaInicioNormalizada.getTime())) {
    return { error: 'La fecha de inicio está deshabilitada para reservas.' };
  }

  let fechaFinNormalizada = addHours(fechaInicioNormalizada, 1); // Duración por defecto de 1 hora
  if (fechaFin && fechaFin.fecha && fechaFin.hora) {
    fechaFinNormalizada = normalizarFechaHora(fechaFin.fecha, fechaFin.hora);
    if (differenceInMinutes(fechaFinNormalizada, fechaInicioNormalizada) < 60) {
      return { error: 'La duración mínima de la reserva es de 1 hora.' };
    }
  }

  // Verificar disponibilidad de la hora solicitada
  const reservasExistentes = await Reserva.find({
    instalacion: instalacionId,
    $or: [
      { fechaInicio: { $lt: fechaFinNormalizada }, fechaFin: { $gt: fechaInicioNormalizada } }
    ]
  });
  if (reservasExistentes.length > 0) {
    return { error: 'La hora solicitada ya está reservada.' };
  }

  // Verificar que el estudiante no exceda el límite de 2 horas por día
  const reservasUsuario = await Reserva.find({
    user: userId,
    $where: function() {
      return isSameDay(this.fechaInicio, fechaInicioNormalizada);
    }
  });

  const totalHorasReservadas = reservasUsuario.reduce((total, reserva) => {
    return total + differenceInMinutes(reserva.fechaFin, reserva.fechaInicio) / 60;
  }, 0);

  const horasSolicitadas = differenceInMinutes(fechaFinNormalizada, fechaInicioNormalizada) / 60;
  if (totalHorasReservadas + horasSolicitadas > 2) {
    return { error: 'No puedes reservar más de 2 horas por día.' };
  }

  const nuevaReserva = new Reserva({
    instalacion: instalacionId,
    fechaInicio: fechaInicioNormalizada,
    fechaFin: fechaFinNormalizada,
    user: userId,
  });

  await nuevaReserva.save();
  return { message: 'Reserva de instalación registrada con éxito.' };
}

// Servicio para cancelar una reserva
async function cancelarReserva(reservaId) {
  const reserva = await Reserva.findById(reservaId);
  if (!reserva) {
    return { error: 'Reserva no encontrada.' };
  }

  await reserva.remove();
  return { message: 'Reserva cancelada con éxito.' };
}

// Servicio para extender una reserva
async function extenderReserva(reservaId, nuevaFechaFin) {
  const reserva = await Reserva.findById(reservaId);
  if (!reserva) {
    return { error: 'Reserva no encontrada.' };
  }

  const fechaFinNormalizada = normalizarFechaHora(nuevaFechaFin.fecha, nuevaFechaFin.hora);
  if (differenceInMinutes(fechaFinNormalizada, reserva.fechaInicio) < 60) {
    return { error: 'La duración mínima de la reserva es de 1 hora.' };
  }

  // Verificar disponibilidad de la siguiente hora
  const reservasExistentes = await Reserva.find({
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
}

// Servicio para finalizar una reserva
async function finalizarReserva(reservaId) {
  const reserva = await Reserva.findById(reservaId);
  if (!reserva) {
    return { error: 'Reserva no encontrada.' };
  }

  reserva.fechaFin = new Date();
  await reserva.save();
  return { message: 'Reserva finalizada con éxito.' };
}

// Servicio para obtener todas las reservas activas
async function getAllReservasActivos() {
  const reservas = await Reserva.find({ fechaFin: { $gt: new Date() } });
  return [reservas, null];
}

// Servicio para obtener todas las reservas de un usuario
async function getAllReservasByUser(userId) {
  const reservas = await Reserva.find({ user: userId });
  return [reservas, null];
}

// Servicio para obtener datos para gráficos
async function obtenerDatosGraficos() {
  const reservas = await Reserva.find();
  const data = {
    totalReservas: reservas.length,
    reservasPorImplemento: {},
    reservasPorInstalacion: {},
  };

  reservas.forEach((reserva) => {
    if (reserva.implemento) {
      data.reservasPorImplemento[reserva.implemento] = (data.reservasPorImplemento[reserva.implemento] || 0) + 1;
    }
    if (reserva.instalacion) {
      data.reservasPorInstalacion[reserva.instalacion] = (data.reservasPorInstalacion[reserva.instalacion] || 0) + 1;
    }
  });

  return [data, null];
}

// Servicio para finalizar reservas expiradas
async function finalizarReservasExpiradas() {
  try {
    const ahora = new Date();
    const reservasExpiradas = await Reserva.find({ fechaFin: { $lt: ahora }, estado: 'activo' });

    for (const reserva of reservasExpiradas) {
      await finalizarReserva(reserva._id);
    }

    console.log(`Se finalizaron ${reservasExpiradas.length} reservas expiradas.`);
  } catch (error) {
    console.error('Error al finalizar reservas expiradas:', error);
  }
}

export default {
  registrarReservaImplemento,
  registrarReservaInstalacion,
  cancelarReserva,
  extenderReserva,
  finalizarReserva,
  getAllReservasActivos,
  getAllReservasByUser,
  obtenerDatosGraficos,
  finalizarReservasExpiradas
};
