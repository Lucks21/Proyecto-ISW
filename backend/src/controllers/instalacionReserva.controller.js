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
    respondError(req, res, 500, "Error al realizar la reserva de instalación");
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

    notificarDisponibilidadInstalacion(instalacion._id);

    respondSuccess(req, res, 200, "Reserva de instalación cancelada con éxito");
  } catch (error) {
    respondError(req, res, 500, "Error al cancelar la reserva de instalación");
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
        const notificacion = new Notificacion({ userId: req.userId, recursoId: instalacion._id, recursoTipo: "Instalacion" });
        await notificacion.save();
        return respondError(req, res, 400, "La instalación no está disponible");
    }

    instalacion.estado = "no disponible";
    await instalacion.save();

    reserva.fechaFin = nuevaFechaFin;
    await reserva.save();

    respondSuccess(req, res, 200, "Extensión de reserva de instalación realizada con éxito");
  } catch (error) {
    respondError(req, res, 500, "Error al extender la reserva de instalación");
  }
};

export const notificarDisponibilidadInstalacion = async (instalacionId) => {
  try {
    const notificaciones = await Notificacion.find({ recursoId: instalacionId, recursoTipo: "Instalacion" });
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

    notificarDisponibilidadInstalacion(instalacion._id);

    respondSuccess(res, 200, "Reserva finalizada con éxito");
  } catch (error) {
    respondError(res, 500, "Error al finalizar la reserva");
  }
};
