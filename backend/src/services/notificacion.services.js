import Notificacion from "../models/notificacion.model.js";
import Implemento from "../models/implementos.model.js";
import Instalacion from "../models/Instalacion.model.js";
import sendEmail from '../services/email.services.js';
import User from "../models/alumno.model.js";

async function solicitarNotificacion(recursoId, recursoTipo, userId) {
  try {
    recursoTipo = recursoTipo.charAt(0).toUpperCase() + recursoTipo.slice(1);

    let recurso;
    if (recursoTipo === "Implemento") {
      recurso = await Implemento.findById(recursoId);
    } else if (recursoTipo === "Instalacion") {
      recurso = await Instalacion.findById(recursoId);
    } else {
      return { error: "Tipo de recurso no válido" };
    }

    if (!recurso || recurso.estado === "disponible") {
      return { error: "El recurso ya está disponible" };
    }

    const notificacion = new Notificacion({ userId, recursoId, recursoTipo });
    await notificacion.save();

    return { message: "Solicitud de notificación realizada con éxito" };
  } catch (error) {
    return { error: "Error al solicitar notificación", details: error.message };
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
        const subject = "El implemento está disponible";
        const text = "El implemento que solicitaste está ahora disponible.";
        await sendEmail(user.email, subject, text);
      }
      await notificacion.remove();
    }
  } catch (error) {
    console.error("Error al notificar disponibilidad", error);
  }
}

export default {
  solicitarNotificacion,
  notificarDisponibilidadImplemento,
};
