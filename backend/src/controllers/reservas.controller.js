import { respondSuccess, respondError } from "../utils/resHandler.js";
import ReservaServices from "../services/Reserva.services.js";
import sendEmail from '../services/email.services.js';
import { validarReservaImplemento, validarReservaInstalacion, validarCancelarReserva, validarExtenderReserva, validarFinalizarReserva } from '../schema/reserva.schema.js';

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

// CRUD de reserva de implementos
// Implementos
async function registrarReservaImplemento(req, res) {
  const { error } = validarReservaImplemento.validate(req.body);
  if (error) {
    return respondError(req, res, 400, error.details[0].message);
  }

  try {
    const { implementoId, fechaInicio, fechaFin, userId } = req.body;
    const resultado = await ReservaServices.registrarReservaImplemento(implementoId, fechaInicio, fechaFin, userId, req.userId);
    if (resultado.error) {
      return respondError(req, res, 400, resultado.error);
    }
    // Aquí falta recibir el correo del usuario
    const userEmail = 'correo_del_usuario@ejemplo.com'; // HAY QUE HACER LA LÓGICA para obtener el correo del usuario
    const subject = 'Confirmación de reserva';
    const text = `Tu reserva ha sido confirmada para el implemento con ID ${implementoId}. Fecha de inicio: ${fechaInicio}, Fecha de fin: ${fechaFin}.`;

    await sendEmail(userEmail, subject, text);
    respondSuccess(req, res, 201, resultado.message);
  } catch (error) {
    respondError(req, res, 500, "Error al realizar la reserva de implemento", error);
  }
}

// Instalaciones
async function registrarReservaInstalacion(req, res) {
  const { error } = validarReservaInstalacion.validate(req.body);
  if (error) {
    return respondError(req, res, 400, error.details[0].message);
  }

  try {
    const { instalacionId, fechaInicio, fechaFin, userId } = req.body;
    const resultado = await ReservaServices.registrarReservaInstalacion(instalacionId, fechaInicio, fechaFin, userId, req.userId);
    if (resultado.error) {
      return respondError(req, res, 400, resultado.error);
    }
    const userEmail = 'correo_del_usuario@ejemplo.com'; // HAY QUE HACER LA LÓGICA para obtener el correo del usuario
    const subject = 'Confirmación de reserva';
    const text = `Tu reserva ha sido confirmada para la instalación con ID ${instalacionId}. Fecha de inicio: ${fechaInicio}, Fecha de fin: ${fechaFin}.`;

    await sendEmail(userEmail, subject, text);
    respondSuccess(req, res, 201, resultado.message);
  } catch (error) {
    respondError(req, res, 500, "Error al realizar la reserva de instalación", error);
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
    const resultado = await ReservaServices.extenderReserva(reservaId, nuevaFechaFin, req.userId);
    if (resultado.error) {
      return respondError(req, res, 400, resultado.error);
    }
    respondSuccess(req, res, 200, resultado.message);
  } catch (error) {
    respondError(req, res, 500, "Error al extender la reserva", error);
  }
}

async function finalizarReserva(req, res) {
  const { error } = validarFinalizarReserva.validate(req.body);
  if (error) {
    return respondError(req, res, 400, error.details[0].message);
  }

  try {
    const { reservaId } = req.body;
    const resultado = await ReservaServices.finalizarReserva(reservaId);
    if (resultado.error) {
      return respondError(req, res, 400, resultado.error);
    }
    respondSuccess(req, res, 200, resultado.message);
  } catch (error) {
    respondError(req, res, 500, "Error al finalizar la reserva", error);
  }
}

async function obtenerDatosGraficos(req, res) {
  try {
    const [data, error] = await ReservaServices.obtenerDatosGraficos();
    if (error) return respondError(req, res, 400, error);
    return respondSuccess(req, res, 200, data);
  } catch (error) {
    return respondError(req, res, 500, "Error al obtener datos para gráficos", error);
  }
}

export default {
  getAllReservasByUser,
  getAllReservasActivos,
  registrarReservaImplemento,
  registrarReservaInstalacion,
  cancelarReserva,
  extenderReserva,
  finalizarReserva,
  obtenerDatosGraficos
};
