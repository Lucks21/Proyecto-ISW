import Implemento from "../models/implementos.model.js";
import Instalacion from "../models/Instalacion.model.js"
import Reserva from "../models/reservas.model.js";
import Notificacion from "../models/notificacion.model.js";
import User from "../models/user.model.js";

async function getAllReservasByUser(id) { //Visualizar las reservas por IDusuario
  try {
    const reservas = await Reserva.find();

    const reservasByUserId =
      reservas.filter((reserva) => reserva.userId.toString() === id) || [];

    return [reservasByUserId, null];
  } catch (error) {
    return [null, "Error al obtener las reservas"];
  }
}

async function getAllReservasActivos() {//Visualizar las reservas activas

  try {
    const reservas = await Reserva.find();
    const reservasActivos =
      reservas.filter((reserva) => reserva.estado === "activo") || [];

    return [reservasActivos, null];
  } catch (error) {
    return [null, "Error al obtener las reservas"];
  }
}

// CRUD
async function registrarReservaImplemento(implementoId, fechaInicio, fechaFin, userId, reqUserId) {
  try {
      const implemento = await Implemento.findById(implementoId);
      if (!implemento || implemento.estado !== "disponible" || implemento.cantidad < 1) {
          const notificacion = new Notificacion({
              userId: reqUserId,
              recursoId: implemento._id,
              recursoTipo: "Implemento",
          });
          await notificacion.save();
          return { error: "El implemento no está disponible para reservar" };
      }
      const reserva = new Reservas({
          userId,
          implementoId,
          fechaInicio,
          fechaFin,
          estado: "activo",
      });
      await reserva.save();
      const nuevaCantidad = implemento.cantidad - 1;
      const nuevoEstado = nuevaCantidad === 0 ? "no disponible" : "disponible";
      await Implemento.findByIdAndUpdate(implementoId, { estado: nuevoEstado, cantidad: nuevaCantidad });
      return { message: "Reserva de implemento realizada con éxito" };
  } catch (error) {
      return { error: "Error al realizar la reserva de implemento", details: error.message };
  }
}

async function registrarReservaInstalacion(instalacionId, fechaInicio, fechaFin, userId, reqUserId) {
  try {
      const instalacion = await Instalacion.findById(instalacionId);
      if (!instalacion || instalacion.estado !== "disponible") {
          const notificacion = new Notificacion({
              userId: reqUserId,
              recursoId: instalacion._id,
              recursoTipo: "Instalacion",
          });
          await notificacion.save();
          return { error: "La instalación no está disponible para reservar" };
      }
      const reserva = new Reserva({
          userId,
          instalacionId,
          fechaInicio,
          fechaFin,
          estado: "activo",
      });
      await reserva.save();
      instalacion.estado = "no disponible";
      await instalacion.save();
      return { message: "Reserva de instalación realizada con éxito" };
  } catch (error) {
      return { error: "Error al realizar la reserva de instalación", details: error.message };
  }
}

async function cancelarReserva(reservaId) {
  try {
      const reserva = await Reserva.findById(reservaId);
      if (!reserva || reserva.estado !== "activo") {
          return { error: "La reserva no está activa o no existe" };
      }
      await Reserva.findByIdAndUpdate(reservaId, { estado: "cancelado" });
      if (reserva.implementoId) {
          const implemento = await Implemento.findById(reserva.implementoId);
          implemento.disponible = true;
          implemento.cantidad += 1;
          await implemento.save();
      } else if (reserva.instalacionId) {
          const instalacion = await Instalacion.findById(reserva.instalacionId);
          instalacion.disponible = true;
          await instalacion.save();
      }
      await notificarDisponibilidad(reserva.implementoId || reserva.instalacionId, reserva.implementoId ? "Implemento" : "Instalacion");
      return { message: "Reserva cancelada con éxito" };
  } catch (error) {
      return { error: "Error al cancelar la reserva", details: error.message };
  }
}

async function extenderReserva(reservaId, nuevaFechaFin, reqUserId) {
  try {
      const reserva = await Reserva.findById(reservaId);
      if (!reserva || reserva.estado !== "activo") {
          return { error: "La reserva no está activa o no existe" };
      }
      reserva.fechaFin = nuevaFechaFin;
      await reserva.save();
      return { message: "Extensión de reserva realizada con éxito" };
  } catch (error) {
      return { error: "Error al extender la reserva", details: error.message };
  }
}

async function finalizarReserva(reservaId) {
  try {
      const reserva = await Reserva.findById(reservaId);
      if (!reserva || reserva.estado !== "activo") {
          return { error: "La reserva no está activa o no existe" };
      }
      reserva.estado = "finalizada";
      await reserva.save();
      if (reserva.implementoId) {
          const implemento = await Implemento.findById(reserva.implementoId);
          implemento.estado = "disponible";
          implemento.cantidad += 1;
          await implemento.save();
      } else if (reserva.instalacionId) {
          const instalacion = await Instalacion.findById(reserva.instalacionId);
          instalacion.estado = "disponible";
          await instalacion.save();
      }
      await notificarDisponibilidad(reserva.implementoId || reserva.instalacionId, reserva.implementoId ? "Implemento" : "Instalacion");
      return { message: "Reserva finalizada con éxito" };
  } catch (error) {
      return { error: "Error al finalizar la reserva", details: error.message };
  }
}

async function notificarDisponibilidad(recursoId, recursoTipo) {
  try {
      const notificaciones = await Notificacion.find({ recursoId, recursoTipo });
      for (const notificacion of notificaciones) {
          const user = await User.findById(notificacion.userId);
          if (user && user.email) {
              // Enviar correo de notificación (el código del correo se debería implementar aquí)
              console.log(`Enviar correo a: ${user.email} - El ${recursoTipo.toLowerCase()} que solicitaste está ahora disponible.`);
          }
          await notificacion.remove();
      }
  } catch (error) {
      console.error("Error al notificar disponibilidad", error);
  }
}

export default {
  getAllReservasByUser,
  getAllReservasActivos,
  registrarReservaImplemento,
  registrarReservaInstalacion,
  cancelarReserva,
  extenderReserva,
  finalizarReserva,
  notificarDisponibilidad
};