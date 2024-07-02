import Implemento from "../models/implementos.model.js";
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
async function registrarReservaImplemento(
  implementoId,
  fechaInicio,
  fechaFin,
  userId,
  reqUserId,
) {
  try {
    const implemento = await Implemento.findById(implementoId);
    if (
      !implemento ||
      implemento.estado !== "disponible" ||
      implemento.cantidad < 1
    ) {
      const notificacion = new Notificacion({
        userId: reqUserId,
        recursoId: implemento._id,
        recursoTipo: "Implemento",
      });
      await notificacion.save();
      return { error: "El implemento no está disponible para reservar" };
    }

    const reserva = new Reserva({
      userId,
      implementoId,
      fechaInicio,
      fechaFin,
      estado: "activo",
    });

    await reserva.save();

    const nuevaCantidad = implemento.cantidad - 1;
    const nuevoEstado = nuevaCantidad === 0 ? "no disponible" : "disponible";

    await Implemento.findByIdAndUpdate(implementoId, {
      estado: nuevoEstado,
      cantidad: nuevaCantidad,
    });

    return { message: "Reserva de implemento realizada con éxito" };
  } catch (error) {
    return {
      error: "Error al realizar la reserva de implemento",
      details: error.message,
    };
  }
}

async function cancelarReservaImplemento(reservaId) {
  try {
    const reserva = await Reserva.findById(reservaId);
    if (!reserva || reserva.estado !== "activo") {
      return { error: "La reserva no está activa o no existe" };
    }

    await Reserva.findByIdAndUpdate(reservaId, { estado: "cancelado" });
    const implemento = await Implemento.findById(reserva.implementoId);
    implemento.disponible = true;
    implemento.cantidad += 1;
    await implemento.save();

    await notificarDisponibilidadImplemento(reserva.implementoId);

    return { message: "Reserva cancelada con éxito" };
  } catch (error) {
    return { error: "Error al cancelar la reserva", details: error.message };
  }
}

async function extenderReservaImplemento(reservaId, nuevaFechaFin, reqUserId) {
  try {
    const reserva = await Reserva.findById(reservaId);
    if (!reserva || reserva.estado !== "activo") {
      return { error: "La reserva no está activa o no existe" };
    }

    const implemento = await Implemento.findById(reserva.implementoId);
    if (
      !implemento ||
      implemento.estado !== "disponible" ||
      implemento.cantidad < 1
    ) {
      const notificacion = new Notificacion({
        userId: reqUserId,
        recursoId: implemento._id,
        recursoTipo: "Implemento",
      });
      await notificacion.save();
      return {
        error: "El implemento no está disponible o no hay suficientes en stock",
      };
    }

    implemento.estado = "no disponible";
    implemento.cantidad -= 1;
    await implemento.save();

    reserva.fechaFin = nuevaFechaFin;
    await reserva.save();

    return { message: "Extensión de reserva realizada con éxito" };
  } catch (error) {
    return { error: "Error al extender la reserva", details: error.message };
  }
}

async function notificarDisponibilidadImplemento(implementoId) {
  try {
    const implemento = await Implemento.findById(implementoId);
    if (!implemento) {
      console.error(`No se encontró el implemento con ID: ${implementoId}`);
      return;
    }

    const notificaciones = await Notificacion.find({
      recursoId: implementoId,
      recursoTipo: "Implemento",
    });
    for (const notificacion of notificaciones) {
      const user = await User.findById(notificacion.userId);
      if (user && user.email) {
        console.log(
          `Enviar correo a: ${user.email} - El implemento que solicitaste está ahora disponible.`,
        );
      }
      await notificacion.remove();
    }
  } catch (error) {
    console.error("Error al notificar disponibilidad", error);
  }
}

async function finalizarReservaImplemento(reservaId) {
  try {
    const reserva = await Reserva.findById(reservaId);
    if (!reserva || reserva.estado !== "activo") {
      return { error: "La reserva no está activa o no existe" };
    }

    reserva.estado = "finalizada";
    await reserva.save();

    const implemento = await Implemento.findById(reserva.implementoId);
    implemento.estado = "disponible";
    implemento.cantidad += 1;
    await implemento.save();

    await notificarDisponibilidadImplemento(reserva.implementoId);

    return { message: "Reserva finalizada con éxito" };
  } catch (error) {
    return { error: "Error al finalizar la reserva", details: error.message };
  }
}

export default {
  getAllReservasByUser,
  getAllReservasActivos,
  registrarReservaImplemento,
  cancelarReservaImplemento,
  extenderReservaImplemento,
  finalizarReservaImplemento,
};
