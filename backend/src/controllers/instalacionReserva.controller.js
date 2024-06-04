/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import Instalacion from "../models/Instalacion.model.js";
import Reserva from "../models/reserva.model.js";
import Notificacion from "../models/notificacion.model.js";
import User from "../models/user.model.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";


export const registrarReservaInstalacion = async (req, res) => {
  try {
    const { instalacionId, fechaInicio, fechaFin, userId } = req.body;

    const instalacion = await Instalacion.findById(instalacionId);
    if (!instalacion || instalacion.estado !== "disponible") {
        const notificacion = new Notificacion({
          userId: req.userId,
          recursoId: instalacion._id,
          recursoTipo: "Instalacion",
        });
        await notificacion.save();
        return respondError(req, res, 400, "La instalación no está disponible para reservar");
    }

    const reserva = new Reserva({
      userId,
      instalacionId,
      fechaInicio,
      fechaFin,
      estado: "activo",
    });

    await reserva.save();
    await Instalacion.findByIdAndUpdate(instalacionId, { estado: "no disponible" });

    respondSuccess(req, res, 201, "Reserva de instalación realizada con éxito");
  } catch (error) {
    respondError(req, res, 500, "Error al realizar la reserva de instalación", error);
  }
};

export const cancelarReservaInstalacion = async (req, res) => {
  try {
    const { reservaId } = req.body;

    const reserva = await Reserva.findById(reservaId);
    if (!reserva || reserva.estado !== "activo") {
      return respondError(req, res, 400, "La reserva no está activa o no existe");
    }

    await Reserva.findByIdAndUpdate(reservaId, { estado: "cancelado" });
    await Instalacion.findByIdAndUpdate(reserva.instalacionId, { estado: "disponible" });

    try {
      notificarDisponibilidadInstalacion(reserva.instalacionId);
    } catch (error) {
      console.error("Error al notificar la disponibilidad de la instalación:", error.message);
    }

    respondSuccess(req, res, 200, "Reserva de instalación cancelada con éxito");
  } catch (error) {
    respondError(req, res, 500, "Error al cancelar la reserva de instalación: ", error.message);
  }
};

export const extenderReservaInstalacion = async (req, res) => {
  try {
    const { reservaId, nuevaFechaFin } = req.body;

    const reserva = await Reserva.findById(reservaId);
    if (!reserva || reserva.estado !== "activo") {
      return respondError(req, res, 400, "La reserva no está activa o no existe");
    }
    
    const instalacion = await Instalacion.findById(reserva.instalacionId);
    if (!instalacion || instalacion.estado !== "disponible") {
        try {
          const notificacion = new Notificacion({ userId: req.userId, recursoId: instalacion._id, recursoTipo: "Instalacion" });
          await notificacion.save();
        } catch (error) {
          return respondError(req, res, 400, "La instalación no está disponible", error.message);
        }
    }

    instalacion.estado = "no disponible";
    await instalacion.save();

    reserva.fechaFin = nuevaFechaFin;
    await reserva.save();

    respondSuccess(req, res, 200, "Extensión de reserva de instalación realizada con éxito");
  } catch (error) {
    respondError(req, res, 500, "Error al extender la reserva de instalación", error.message);
  }
};

export const notificarDisponibilidadInstalacion = async (instalacionId) => {
  try {
    const instalacion = await Instalacion.findById(instalacionId);
    if (!instalacion) {
      console.error(`No se encontró la instalación con ID: ${instalacionId}`);
      return;
    }

    const user = await User.findById(instalacion.userId);
    if (!user) {
      console.error(`No se encontró el usuario con ID: ${instalacion.userId}`);
      return;
    }

    if (!user.email) {
      console.error(`El usuario con ID: ${instalacion.userId} no tiene un email asociado`);
      return;
    }

    for (const notificacion of notificaciones) {
      const user = await User.findById(notificacion.userId);
      const mailOptions = {
        from: "your-email@gmail.com",
        to: user.email,
        subject: "La instalación está disponible",
        text: "La instalación que solicitaste está ahora disponible.",
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

export const finalizarReservaInstalacion = async (req, res) => {
  try {
    const { reservaId } = req.body;

    const reserva = await Reserva.findById(reservaId);
    if (!reserva || reserva.estado !== "activo") {
      return respondError(res, 400, "La reserva no está activa o no existe");
    }

    reserva.estado = "finalizada";
    await reserva.save();

    const instalacion = await Instalacion.findById(reserva.instalacionId);
    instalacion.estado = "disponible";
    await instalacion.save();

    try {
      notificarDisponibilidadInstalacion(reserva.instalacionId);
    } catch (error) {
      console.error("Error al notificar la disponibilidad de la instalación:", error.message);
    }

    respondSuccess(res, 200, "Reserva finalizada con éxito");
  } catch (error) {
    respondError(res, 500, "Error al finalizar la reserva");
  }
};

export const obtenerIdsReservasInstalacion = async (req, res) => {
  try {
    const reservas = await Reserva.find({});
    const idsReservas = reservas.map(reserva => reserva._id);
    res.status(200).json(idsReservas);
  } catch (error) {
    respondError(req, res, 500, "Error al obtener los IDs de las reservas", error);
  }
};
