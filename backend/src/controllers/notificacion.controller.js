import { respondError, respondSuccess } from "../utils/resHandler.js";
import NotificacionService from '../services/notificacion.services.js';
import sendEmail from '../services/email.services.js';
import Alumno from '../models/alumno.model.js';
import { notificacionSchema } from '../schema/notificacion.schema.js';

async function solicitarNotificacion(req, res) {
  try {
    const { error } = notificacionSchema.validate(req.body);
    if (error) {
      return respondError(req, res, 400, error.details[0].message);
    }

    const { recursoId, recursoTipo, userId } = req.body;

    const alumno = await Alumno.findById(userId);
    if (!alumno) {
      return respondError(req, res, 404, 'Alumno no encontrado.');
    }

    const result = await NotificacionService.solicitarNotificacion(recursoId, recursoTipo, userId);
    if (result.error) {
      return respondError(req, res, 400, result.error);
    }

    const subject = 'Confirmación de solicitud de notificación';
    const text = `Has solicitado una notificación para el recurso ${recursoTipo} con ID ${recursoId}.`;

    await sendEmail(alumno.email, subject, text);

    respondSuccess(req, res, 201, result.message);
  } catch (error) {
    respondError(req, res, 500, "Error al solicitar notificación", error);
  }
}

async function notificarDisponibilidadImplemento(req, res) {
  try {
    const { implementoId } = req.body;
    const result = await NotificacionService.notificarDisponibilidadImplemento(implementoId);
    if (result.error) {
      return respondError(req, res, 400, result.error);
    }
    respondSuccess(req, res, 200, result.message);
  } catch (error) {
    respondError(req, res, 500, "Error al notificar disponibilidad de implemento", error);
  }
}

async function notificarDisponibilidadInstalacion(req, res) {
  try {
    const { instalacionId } = req.body;
    const result = await NotificacionService.notificarDisponibilidadInstalacion(instalacionId);
    if (result.error) {
      return respondError(req, res, 400, result.error);
    }
    respondSuccess(req, res, 200, result.message);
  } catch (error) {
    respondError(req, res, 500, "Error al notificar disponibilidad de instalación", error);
  }
}

export default {
  solicitarNotificacion,
  notificarDisponibilidadImplemento,
  notificarDisponibilidadInstalacion
};
