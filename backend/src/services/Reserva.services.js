import { subHours, endOfMinute, differenceInMinutes, startOfDay, endOfDay, startOfHour, format, isFuture  } from 'date-fns';
import Reserva from '../models/reservas.model.js';
import { obtenerDias } from './configuracion.services.js';
import Alumno from '../models/alumno.model.js';
import Implemento from '../models/implementos.model.js';
import mongoose from 'mongoose';
import Instalacion from '../models/Instalacion.model.js';

// Función para normalizar el día de la semana
const normalizarDia = (dia) => {
  const dias = {
    'lunes': 'lunes',
    'martes': 'martes',
    'miércoles': 'miercoles',
    'jueves': 'jueves',
    'viernes': 'viernes',
    'sábado': 'sabado',
    'domingo': 'domingo'
  };
  return dias[dia.toLowerCase()] || dia.toLowerCase();
};

// Función para normalizar la fecha y hora local
const normalizarFechaHoraLocal = (fecha, hora) => {
  const [day, month, year] = fecha.split('-');
  const [hour, minute] = hora.split(':');
  const localDate = new Date(year, month - 1, day, hour, minute, 0, 0);
  return localDate;
};

// Función para normalizar solo la fecha local
const normalizarFechaLocal = (fecha) => {
  const date = new Date(fecha);
  const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return localDate;
};

// Función para verificar si la reserva está dentro del horario de disponibilidad
const verificarDisponibilidadHorario = (disponibilidad, fechaInicio, fechaFin) => {
  const diaSemana = normalizarDia(fechaInicio.toLocaleString('es-ES', { weekday: 'long' }));
  const horario = disponibilidad.find(h => normalizarDia(h.dia) === diaSemana);

  if (!horario) {
    return false;
  }

  const inicioDisponibilidad = normalizarFechaHoraLocal(format(fechaInicio, 'dd-MM-yyyy'), horario.inicio);
  const finDisponibilidad = normalizarFechaHoraLocal(format(fechaInicio, 'dd-MM-yyyy'), horario.fin);

  return fechaInicio >= inicioDisponibilidad && fechaFin <= finDisponibilidad;
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
    if (implemento.estado === 'no disponible' || implemento.cantidad <= 0) {
      return { error: 'El implemento no está disponible para reservas.' };
    }

    let fechaInicioNormalizada = normalizarFechaHoraLocal(fechaInicio.fecha, fechaInicio.hora);
    let fechaFinNormalizada = normalizarFechaHoraLocal(fechaFin.fecha, fechaFin.hora);

    if (!isFuture(fechaInicioNormalizada) && startOfDay(fechaInicioNormalizada) > startOfDay(new Date())) {
      return { error: 'La fecha de inicio no puede ser en el pasado.' };
    }

    const diasDeshabilitados = await obtenerDias();
    const fechaReservaNormalizada = normalizarFechaLocal(fechaInicioNormalizada);
    if (diasDeshabilitados.some(dia => normalizarFechaLocal(dia).getTime() === fechaReservaNormalizada.getTime())) {
      return { error: `La fecha ${fechaInicio.fecha} está deshabilitada para reservas.` };
    }

    // Verificar si la reserva está dentro del horario de disponibilidad
    if (!verificarDisponibilidadHorario(implemento.horarioDisponibilidad, fechaInicioNormalizada, fechaFinNormalizada)) {
      return { error: 'La reserva está fuera del horario de disponibilidad del implemento.' };
    }

    // Ajustar la hora de inicio a la hora completa más cercana
    fechaInicioNormalizada = startOfHour(fechaInicioNormalizada);

    // Ajustar la hora de fin a la hora completa
    fechaFinNormalizada.setMinutes(0);

    const duracionReserva = differenceInMinutes(fechaFinNormalizada, fechaInicioNormalizada);
    if (duracionReserva <= 0 || duracionReserva > 60) {
      return { error: 'La duración de la reserva debe ser de hasta 1 hora.' };
    }

    const reservasExistentes = await Reserva.find({
      implementoId,
      estado: 'activo',
      $or: [
        { fechaInicio: { $lt: fechaFinNormalizada }, fechaFin: { $gt: fechaInicioNormalizada } }
      ]
    });

    // Contar cuántos implementos ya están reservados en el intervalo de tiempo solicitado
    const cantidadReservada = reservasExistentes.length;
    if (cantidadReservada >= implemento.cantidad) {
      return { error: 'No hay suficientes implementos disponibles para la hora solicitada.' };
    }

    const reservasUsuario = await Reserva.find({
      userId,
      implementoId,
      estado: 'activo',
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

    // Ajustar las fechas restando las horas necesarias para coincidir con la hora local de Chile (UTC-4)
    fechaInicioNormalizada = subHours(fechaInicioNormalizada, 4);
    fechaFinNormalizada = subHours(fechaFinNormalizada, 4);

    const nuevaReserva = new Reserva({
      userId,
      implementoId,
      fechaInicio: fechaInicioNormalizada,
      fechaFin: fechaFinNormalizada,
      estado: 'activo'
    });

    await nuevaReserva.save();
    return {
      message: `Reserva creada con éxito.`, data: nuevaReserva
    };
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

    let fechaInicioNormalizada = normalizarFechaHoraLocal(fechaInicio.fecha, fechaInicio.hora);
    let fechaFinNormalizada = normalizarFechaHoraLocal(fechaFin.fecha, fechaFin.hora);

    if (!isFuture(fechaInicioNormalizada) && startOfDay(fechaInicioNormalizada) > startOfDay(new Date())) {
      return { error: 'La fecha de inicio no puede ser en el pasado.' };
    }

    const diasDeshabilitados = await obtenerDias();
    const fechaReservaNormalizada = normalizarFechaLocal(fechaInicioNormalizada);
    if (diasDeshabilitados.some(dia => normalizarFechaLocal(dia).getTime() === fechaReservaNormalizada.getTime())) {
      return { error: `La fecha ${fechaInicio.fecha} está deshabilitada para reservas.` };
    }

    // Verificar si la reserva está dentro del horario de disponibilidad
    if (!verificarDisponibilidadHorario(instalacion.horarioDisponibilidad, fechaInicioNormalizada, fechaFinNormalizada)) {
      return { error: 'La reserva está fuera del horario de disponibilidad de la instalación.' };
    }

    // Ajustar la hora de inicio a la hora completa más cercana
    fechaInicioNormalizada = startOfHour(fechaInicioNormalizada);

    // Ajustar la hora de fin a la hora completa
    fechaFinNormalizada.setMinutes(0);

    const duracionReserva = differenceInMinutes(fechaFinNormalizada, fechaInicioNormalizada);
    if (duracionReserva <= 0 || duracionReserva > 60) {
      return { error: 'La duración de la reserva debe ser de hasta 1 hora.' };
    }

    const reservasExistentes = await Reserva.find({
      instalacionId,
      estado: 'activo',
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
      estado: 'activo',
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

    // Ajustar las fechas restando las horas necesarias para coincidir con la hora local de Chile (UTC-4)
    fechaInicioNormalizada = subHours(fechaInicioNormalizada, 4);
    fechaFinNormalizada = subHours(fechaFinNormalizada, 4);

    const nuevaReserva = new Reserva({
      userId,
      instalacionId,
      fechaInicio: fechaInicioNormalizada,
      fechaFin: fechaFinNormalizada,
      estado: 'activo'
    });

    await nuevaReserva.save();
    return {
      message: `Reserva creada con éxito.`, data: nuevaReserva
    };
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

    let ahora = new Date();
    ahora = subHours(ahora, 4); // Ajustar la hora actual restando 4 horas para coincidir con la hora local de Chile (UTC-4)
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

    let ahora = new Date();
    ahora = subHours(ahora, 4); // Ajustar la hora actual restando 4 horas para coincidir con la hora local de Chile (UTC-4)

    const fechaFinNormalizada = normalizarFechaHoraLocal(nuevaFechaFin.fecha, nuevaFechaFin.hora);
    const diferenciaMinutos = differenceInMinutes(fechaFinNormalizada, reserva.fechaFin);

    if (diferenciaMinutos < 60) {
      return { error: 'La extensión mínima de la reserva es de 1 hora.' };
    }

    // Verificar disponibilidad de la nueva hora solicitada
    const reservasExistentes = await Reserva.find({
      implementoId: reserva.implementoId,
      estado: 'activo',
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
    let now = new Date();
    now = subHours(now, 4); // Ajustar la hora actual restando 4 horas para coincidir con la hora local de Chile (UTC-4)

    console.log('Current Date and Time (adjusted to UTC-4):', now);

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
    const reservas = await Reserva.find({ fechaFin: { $gt: new Date() }, estado: 'activo' });
    return [reservas, null];
  } catch (error) {
    console.error("Error en getAllReservasActivos: ", error);
    return [null, "Error interno del servidor."];
  }
}

// Servicio para obtener todas las reservas de un usuario
async function getAllReservasByUser(userId) {
  try {
    const reservas = await Reserva.find({ userId, estado: 'activo' });
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

    const implementoIds = reservas
      .filter(reserva => reserva.implementoId)
      .map(reserva => reserva.implementoId);

    const instalacionIds = reservas
      .filter(reserva => reserva.instalacionId)
      .map(reserva => reserva.instalacionId);

    const implementos = await Implemento.find({ _id: { $in: implementoIds } });
    const instalaciones = await Instalacion.find({ _id: { $in: instalacionIds } });

    const implementoMap = implementos.reduce((map, implemento) => {
      map[implemento._id] = implemento.nombre;
      return map;
    }, {});

    const instalacionMap = instalaciones.reduce((map, instalacion) => {
      map[instalacion._id] = instalacion.nombre;
      return map;
    }, {});

    reservas.forEach((reserva) => {
      if (reserva.implementoId) {
        const nombre = implementoMap[reserva.implementoId];
        if (nombre) {
          data.reservasPorImplemento[nombre] = (data.reservasPorImplemento[nombre] || 0) + 1;
        }
      }
      if (reserva.instalacionId) {
        const nombre = instalacionMap[reserva.instalacionId];
        if (nombre) {
          data.reservasPorInstalacion[nombre] = (data.reservasPorInstalacion[nombre] || 0) + 1;
        }
      }
    });

    return [data, null];
  } catch (error) {
    console.error("Error en obtenerDatosGraficos: ", error);
    return [null, "Error interno del servidor."];
  }
}

async function getHistorialReservasActivas() {
  try {
    const reservas = await Reserva.find({ estado: "activo" })
      .populate('userId')
      .populate('implementoId')
      .populate('instalacionId');
    return reservas;
  } catch (error) {
    throw new Error('Error al obtener el historial de reservas activas: ' + error.message);
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

// implemento reservado por usuario
async function getImplementosReservadosByUser(userId) {
  try {
    const reservas = await Reserva.find({ userId, implementoId: { $exists: true }, estado: 'activo' });
    const implementosIds = reservas.map(reserva => reserva.implementoId);
    const implementosReservados = await Implemento.find({ _id: { $in: implementosIds } });
    return implementosReservados;
  } catch (error) {
    throw new Error('Error al obtener implementos reservados por usuario: ' + error.message);
  }
}

// obtener una instalación reservada por usuario
async function getInstalacionesReservadasByUser(userId) {
  try {
    const reservas = await Reserva.find({ userId, instalacionId: { $exists: true }, estado: 'activo' });
    const instalacionesIds = reservas.map(reserva => reserva.instalacionId);
    const instalacionesReservadas = await Instalacion.find({ _id: { $in: instalacionesIds } });
    return instalacionesReservadas;
  } catch (error) {
    throw new Error('Error al obtener instalaciones reservadas por usuario: ' + error.message);
  }
}

async function getHistorialReservas() {
  try {
    const reservas = await Reserva.find().populate('userId').populate('implementoId').populate('instalacionId');
    return reservas;
  } catch (error) {
    throw new Error('Error al obtener el historial de reservas: ' + error.message);
  }
}

async function getHistorialReservasNoActivas() {
  try {
    const reservas = await Reserva.find({ estado: "no activo" })
      .populate('userId')
      .populate('implementoId')
      .populate('instalacionId');
    return reservas;
  } catch (error) {
    throw new Error('Error al obtener el historial de reservas no activas: ' + error.message);
  }
}

async function obtenerDatosGraficosAlumno(userId) {
  try {
    const reservas = await Reserva.find({ userId });
    const data = {
      totalReservas: reservas.length,
      reservasPorImplemento: {},
      reservasPorInstalacion: {},
    };

    const implementoIds = reservas
      .filter(reserva => reserva.implementoId)
      .map(reserva => reserva.implementoId);

    const instalacionIds = reservas
      .filter(reserva => reserva.instalacionId)
      .map(reserva => reserva.instalacionId);

    const implementos = await Implemento.find({ _id: { $in: implementoIds } });
    const instalaciones = await Instalacion.find({ _id: { $in: instalacionIds } });

    const implementoMap = implementos.reduce((map, implemento) => {
      map[implemento._id] = implemento.nombre;
      return map;
    }, {});

    const instalacionMap = instalaciones.reduce((map, instalacion) => {
      map[instalacion._id] = instalacion.nombre;
      return map;
    }, {});

    reservas.forEach((reserva) => {
      if (reserva.implementoId) {
        const nombre = implementoMap[reserva.implementoId];
        if (nombre) {
          data.reservasPorImplemento[nombre] = (data.reservasPorImplemento[nombre] || 0) + 1;
        }
      }
      if (reserva.instalacionId) {
        const nombre = instalacionMap[reserva.instalacionId];
        if (nombre) {
          data.reservasPorInstalacion[nombre] = (data.reservasPorInstalacion[nombre] || 0) + 1;
        }
      }
    });

    return [data, null];
  } catch (error) {
    console.error("Error en obtenerDatosGraficosAlumno: ", error);
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
  obtenerDatosGraficos,
  getHistorialReservasActivas,
  getImplementosReservados,
  getInstalacionesReservadas,
  getImplementosReservadosByUser,
  getInstalacionesReservadasByUser,
  getHistorialReservas,
  getHistorialReservasNoActivas,
  obtenerDatosGraficosAlumno
};
