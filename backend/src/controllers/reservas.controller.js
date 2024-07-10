// backend/src/controllers/reservas.controller.js
import { respondSuccess, respondError } from "../utils/resHandler.js";
import ReservaServices from "../services/reserva.services.js";
import { validarReservaImplemento, validarCancelarReserva, validarExtenderReserva, validarFinalizarReservasExpiradas } from '../schema/reserva.schema.js';
import {CRON_SECRET} from "../config/configEnv.js"

async function registrarReservaImplemento(req, res) {
  const { error } = validarReservaImplemento.validate(req.body);
  if (error) {
    return respondError(req, res, 400, error.details[0].message);
  }

  try {
    const { implementoId, fechaInicio, fechaFin, userId } = req.body;
    console.log(`Solicitud de reserva recibida con userId: ${userId}`);
    const resultado = await ReservaServices.registrarReservaImplemento(implementoId, fechaInicio, fechaFin, userId);
    if (resultado.error) {
      return respondError(req, res, 400, resultado.error);
    }
    respondSuccess(req, res, 200, resultado.message);
  } catch (error) {
    respondError(req, res, 500, "Error al realizar la reserva de implemento", error);
  }
}

async function cancelarReserva(req, res) {
  const { error } = validarCancelarReserva.validate(req.body);
  if (error) {
    return respondError(req, res, 400, error.details[0].message);
  }

  try {
    const { reservaId } = req.body;
    const resultado = await ReservaServices.cancelarReserva(reservaId);
    if (resultado.error) {
      return respondError(req, res, 400, resultado.error);
    }
    respondSuccess(req, res, 200, resultado.message);
  } catch (error) {
    respondError(req, res, 500, "Error al cancelar la reserva", error);
  }
}

async function extenderReserva(req, res) {
  const { error } = validarExtenderReserva.validate(req.body);
  if (error) {
    return respondError(req, res, 400, error.details[0].message);
  }

  try {
    const { reservaId, nuevaFechaFin } = req.body;
    const resultado = await ReservaServices.extenderReserva(reservaId, nuevaFechaFin);
    if (resultado.error) {
      return respondError(req, res, 400, resultado.error);
    }
    respondSuccess(req, res, 200, resultado.message);
  } catch (error) {
    respondError(req, res, 500, "Error al extender la reserva", error);
  }
}
async function finalizarReservasExpiradas(req, res) {
  const cronSecret = req.headers['cron-secret'];
  if (cronSecret !== CRON_SECRET) {
    return respondError(req, res, 403, "Acceso denegado");
  }

  try {
    const resultado = await ReservaServices.finalizarReservasExpiradas();
    respondSuccess(req, res, 200, resultado.message);
  } catch (error) {
    respondError(req, res, 500, "Error al finalizar las reservas expiradas", error.message);
  }
}

async function getAllReservasByUser(req, res) {
  const { params } = req;

  try {
    const [reservas, error] = await ReservaServices.getAllReservasByUser(params.id);

    if (error) return respondError(req, res, 404, error);

    reservas.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, reservas);
  } catch (error) {
    respondError(req, res, 500, "Error interno del servidor reservas");
  }
}

async function getAllReservasActivos(req, res) {
  try {
    const [reservas, error] = await ReservaServices.getAllReservasActivos();

    if (error) return respondError(req, res, 404, error);

    reservas.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, reservas);
  } catch (error) {
    respondError(req, res, 500, "Error interno del servidor reservas");
  }
}

async function obtenerDatosGraficos(req, res) {
  try {
    const [data, error] = await ReservaServices.obtenerDatosGraficos();
    if (error) {
      return respondError(req, res, 500, "Error al obtener datos para gráficos");
    }
    respondSuccess(req, res, 200, data);
  } catch (error) {
    respondError(req, res, 500, "Error al obtener datos para gráficos", error);
  }
}

export {
  getAllReservasByUser,
  getAllReservasActivos,
  registrarReservaImplemento,
  cancelarReserva,
  extenderReserva,
  finalizarReservasExpiradas,
  obtenerDatosGraficos
};
