import { respondError, respondSuccess } from "../utils/resHandler.js";
import NotificacionServices from '../services/notificaciones.services.js';

const solicitarNotificacion = async (req, res) => {
  const { recursoId, recursoTipo, userId } = req.body;
  try {
    const result = await NotificacionServices.solicitarNotificacion(recursoId, recursoTipo, userId);
    if (result.error) {
      return respondError(req, res, 400, result.error);
    }
    return respondSuccess(req, res, 201, result.message);
  } catch (error) {
    return respondError(req, res, 500, error.message);
  }
};

const verSolicitudesNotificacion = async (req, res) => {
  try {
    const [solicitudes, error] = await NotificacionServices.verSolicitudesNotificacion();
    if (error) {
      return respondError(req, res, 500, error);
    }
    return respondSuccess(req, res, 200, solicitudes);
  } catch (error) {
    return respondError(req, res, 500, error.message);
  }
};

const notificarDisponibilidadImplemento = async (req, res) => {
  const { implementoId } = req.body;
  try {
    const result = await NotificacionServices.notificarDisponibilidadImplemento(implementoId);
    if (result.error) {
      return respondError(req, res, 400, result.error);
    }
    return respondSuccess(req, res, 200, result.message);
  } catch (error) {
    return respondError(req, res, 500, error.message);
  }
};

const notificarDisponibilidadInstalacion = async (req, res) => {
  const { instalacionId } = req.body;
  try {
    const result = await NotificacionServices.notificarDisponibilidadInstalacion(instalacionId);
    if (result.error) {
      return respondError(req, res, 400, result.error);
    }
    return respondSuccess(req, res, 200, result.message);
  } catch (error) {
    return respondError(req, res, 500, error.message);
  }
};

export default {
  solicitarNotificacion,
  notificarDisponibilidadImplemento,
  notificarDisponibilidadInstalacion,
  verSolicitudesNotificacion,
};
