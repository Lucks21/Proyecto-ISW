import { respondSuccess, respondError } from "../utils/resHandler.js";
import ReservaService from "../services/reservas.service.js";
import sendEmail from '../utils/emailService.js';

async function getAllReservasByUser(req, res) {
  const { params } = req;

  try {
    const [reservas, error] = await ReservaService.getAllReservasByUser(
      params.id,
    );

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
    const [reservas, error] = await ReservaService.getAllReservasActivos();

    if (error) return respondError(req, res, 404, error);

    reservas.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, reservas);
  } catch (error) {
    respondError(req, res, 500, "Error interno del servidor reservas");
  }
}
//CRUD

async function registrarReserva(req, res) {
  try {
    const { implementoId, fechaInicio, fechaFin, userId } = req.body;
    const resultado = await registrarReservaImplemento(
      implementoId,
      fechaInicio,
      fechaFin,
      userId,
      req.userId,
    );
    if (resultado.error) {
      return respondError(req, res, 400, resultado.error);
    }
    //Aqui falta recibir el correo del usuario
    const userEmail = '@alumnos.ubiobio.cl';
    const subject = 'Confirmación de reserva';
    const text = `Tu reserva ha sido confirmada para el implemento con ID ${implementoId}. Fecha de inicio: ${fechaInicio}, Fecha de fin: ${fechaFin}.`;

    await sendEmail(userEmail, subject, text);


    respondSuccess(req, res, 201, resultado.message);
  } catch (error) {
    respondError(req,res,500,"Error al realizar la reserva de implemento",error,
    );
  }
}

async function cancelarReserva(req, res) {
  try {
    const { reservaId } = req.body;
    const resultado = await cancelarReservaImplemento(reservaId);
    if (resultado.error) {
      return respondError(req, res, 400, resultado.error);
    }
    respondSuccess(req, res, 200, resultado.message);
  } catch (error) {
    respondError(req, res, 500, "Error al cancelar la reserva", error);
  }
}

async function extenderReserva(req, res) {
  try {
    const { reservaId, nuevaFechaFin } = req.body;
    const resultado = await extenderReservaImplemento(
      reservaId,
      nuevaFechaFin,
      req.userId,
    );
    if (resultado.error) {
      return respondError(req, res, 400, resultado.error);
    }
    respondSuccess(req, res, 200, resultado.message);
  } catch (error) {
    respondError(req, res, 500, "Error al extender la reserva", error);
  }
}

async function finalizarReserva(req, res) {
  try {
    const { reservaId } = req.body;
    const resultado = await finalizarReservaImplemento(reservaId);
    if (resultado.error) {
      return respondError(req, res, 400, resultado.error);
    }
    respondSuccess(req, res, 200, resultado.message);
  } catch (error) {
    respondError(req, res, 500, "Error al finalizar la reserva", error);
  }
}

export default {
  getAllReservasByUser,
  getAllReservasActivos,
  registrarReserva,
  cancelarReserva,
  extenderReserva,
  finalizarReserva,
};
