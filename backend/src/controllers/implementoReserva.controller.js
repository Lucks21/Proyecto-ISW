/* eslint-disable no-console */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import Implemento from "../models/implementos.model.js";
import Reserva from "../models/reserva.model.js";
import Notificacion from "../models/notificacion.model.js";
import User from "../models/user.model.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";

export const registrarReservaImplemento = async (req, res) => {
  try {
    const { implementoId, fechaInicio, fechaFin, userId } = req.body;

    const implemento = await Implemento.findById(implementoId);
    if (!implemento || implemento.estado !== "disponible" || implemento.cantidad < 1) {
        const notificacion = new Notificacion({ userId: req.userId, recursoId: implemento._id, recursoTipo: "Implemento" });
        await notificacion.save();
        return respondError(req, res, 400, "El implemento no está disponible para reservar");
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

    await Implemento.findByIdAndUpdate(implementoId, { estado: nuevoEstado, cantidad: nuevaCantidad });

    respondSuccess(req, res, 201, "Reserva de implemento realizada con éxito");
  } catch (error) {
    respondError(req, res, 500, "Error al realizar la reserva de implemento", error);
  }
};

export const cancelarReservaImplemento = async (req, res) => {
  try {
    const { reservaId } = req.body;

    const reserva = await Reserva.findById(reservaId);
    if (!reserva || reserva.estado !== "activo") {
      return respondError(req, res, 400, "La reserva no está activa o no existe");
    }

    await Reserva.findByIdAndUpdate(reservaId, { estado: "cancelado" });
    const implemento = await Implemento.findById(reserva.implementoId);
    implemento.disponible = true;
    implemento.cantidad += 1;
    await implemento.save();

    try {
      notificarDisponibilidadImplemento(reserva.implementoId);
    } catch (error) {
      console.error("Error al notificar la disponibilidad del implemento:", error.message);
    }
    

    respondSuccess(req, res, 200, "Reserva cancelada con éxito");
  } catch (error) {
    respondError(req, res, 500, "Error al cancelar la reserva", error);
  }
};

export const extenderReservaImplemento = async (req, res) => {
  try {
    const { reservaId, nuevaFechaFin } = req.body;

    const reserva = await Reserva.findById(reservaId);
    if (!reserva || reserva.estado !== "activo") {
      return respondError(req, res, 400, "La reserva no está activa o no existe");
    }

    const implemento = await Implemento.findById(reserva.implementoId);
    if (!implemento || implemento.estado !== "disponible" || implemento.cantidad < 1) {
        try {
          const notificacion = new Notificacion({ userId: req.userId, recursoId: implemento._id, recursoTipo: "Implemento" });
          await notificacion.save();
        } catch (error) {
          return respondError(req, res, 400, "El implemento no está disponible o no hay suficientes en stock", error.message);
        }
    }

    implemento.estado = "no disponible";
    implemento.cantidad -= 1;
    await implemento.save();

    reserva.fechaFin = nuevaFechaFin;
    await reserva.save();

    respondSuccess(req, res, 200, "Extensión de reserva realizada con éxito");
  } catch (error) {
    respondError(req, res, 500, "Error al extender la reserva");
  }
};

export const notificarDisponibilidadImplemento = async (implementoId) => {
  try {
    const implemento = await Implemento.findById(implementoId);
    if (!implemento) {
      console.error(`No se encontró el implemento con ID: ${implementoId}`);
      return;
    }

    const user = await User.findById(implemento.userId);
    if (!user) {
      console.error(`No se encontró el usuario con ID: ${implemento.userId}`);
      return;
    }

    if (!user.email) {
      console.error(`El usuario con ID: ${implemento.userId} no tiene un email asociado`);
      return;
    }

    for (const notificacion of notificaciones) {
      const user = await User.findById(notificacion.userId);
      const mailOptions = {
        from: "your-email@gmail.com",
        to: user.email,
        subject: "El implemento está disponible",
        text: "El implemento que solicitaste está ahora disponible.",
      };
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      await notificacion.remove();
    }
  } catch (error) {
    console.error("Error al notificar disponibilidad", error);
  }
};

export const finalizarReservaImplemento = async (req, res) => {
  try {
    const { reservaId } = req.body;

    const reserva = await Reserva.findById(reservaId);
    if (!reserva || reserva.estado !== "activo") {
      return respondError(req, res, 400, "La reserva no está activa o no existe");
    }

    reserva.estado = "finalizada";
    await reserva.save();

    const implemento = await Implemento.findById(reserva.implementoId);
    implemento.estado = "disponible";
    implemento.cantidad += 1;
    await implemento.save();

    // Notificar a los usuarios que el implemento está disponible
    try {
      notificarDisponibilidadImplemento(reserva.implementoId);
    } catch (error) {
      console.error("Error al notificar la disponibilidad del implemento:", error.message);
    }
    respondSuccess(req, res, 200, "Reserva finalizada con éxito");
  } catch (error) {
    respondError(req, res, 500, "Error al finalizar la reserva");
  }
};
