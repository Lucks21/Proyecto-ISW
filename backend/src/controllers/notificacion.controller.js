const Notificacion = require("../models/notificacion.model");

exports.solicitarNotificacion = async (req, res) => {
  try {
    const { recursoId, recursoTipo, userId } = req.body;

    let recurso;
    if (recursoTipo === "implemento") {
      recurso = await Implemento.findById(recursoId);
    } else if (recursoTipo === "instalacion") {
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
    respondError(req, res, 500, "Error al solicitar notificación");
  }
};
