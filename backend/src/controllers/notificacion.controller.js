import Notificacion from "../models/notificacion.model.js";
import Implemento from "../models/implementos.model.js";
import Instalacion from "../models/Instalacion.model.js";
import { respondError, respondSuccess } from "../utils/resHandler.js";

export const solicitarNotificacion = async (req, res) => {
  try {
    let { recursoId, recursoTipo, userId } = req.body;
    recursoTipo = recursoTipo.charAt(0).toUpperCase() + recursoTipo.slice(1);

    let recurso;
    if (recursoTipo === "Implemento") {
      recurso = await Implemento.findById(recursoId);
    } else if (recursoTipo === "Instalacion") {
      recurso = await Instalacion.findById(recursoId);
    } else {
      return respondError(req, res, 400, "Tipo de recurso no válido");
    }

    if (!recurso || recurso.estado === "disponible") {
      return respondError(req, res, 400, "El recurso ya está disponible");
    }

    const notificacion = new Notificacion({ userId, recursoId, recursoTipo });
    await notificacion.save();

    respondSuccess(req, res, 201, "Solicitud de notificación realizada con éxito");
  } catch (error) {
    respondError(req, res, 500, "Error al solicitar notificación", error);
  }
};
