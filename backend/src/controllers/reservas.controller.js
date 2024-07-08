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
//CRUD de reserva de implementos
//Implementos
async function registrarReservaImplemento(req, res) {
    try {
        const { implementoId, fechaInicio, fechaFin, userId } = req.body;
        const resultado = await ReservaService.registrarReservaImplemento(implementoId, fechaInicio, fechaFin, userId, req.userId);
        if (resultado.error) {
            return respondError(req, res, 400, resultado.error);
        }
        // Aqui falta recibir el correo del usuario
        const userEmail = 'correo_del_usuario@ejemplo.com'; // HAY QUE HACER LA LOGICA para obtener el correo del usuario
        const subject = 'Confirmación de reserva';
        const text = `Tu reserva ha sido confirmada para el implemento con ID ${implementoId}. Fecha de inicio: ${fechaInicio}, Fecha de fin: ${fechaFin}.`;

        await sendEmail(userEmail, subject, text);
        respondSuccess(req, res, 201, resultado.message);
    } catch (error) {
        respondError(req, res, 500, "Error al realizar la reserva de implemento", error);
    }
}
//Instalaciones
async function registrarReservaInstalacion(req, res) {
    try {
        const { instalacionId, fechaInicio, fechaFin, userId } = req.body;
        const resultado = await ReservaService.registrarReservaInstalacion(instalacionId, fechaInicio, fechaFin, userId, req.userId);
        if (resultado.error) {
            return respondError(req, res, 400, resultado.error);
        }
        const userEmail = 'correo_del_usuario@ejemplo.com'; // HAY QUE HACER LA LOGICA para obtener el correo del usuario
        const subject = 'Confirmación de reserva';
        const text = `Tu reserva ha sido confirmada para la instalación con ID ${instalacionId}. Fecha de inicio: ${fechaInicio}, Fecha de fin: ${fechaFin}.`;

        await sendEmail(userEmail, subject, text);
        respondSuccess(req, res, 201, resultado.message);
    } catch (error) {
        respondError(req, res, 500, "Error al realizar la reserva de instalación", error);
    }
}

async function cancelarReserva(req, res) {
    try {
        const { reservaId } = req.body;
        const resultado = await ReservaService.cancelarReserva(reservaId);
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
        const resultado = await ReservaService.extenderReserva(reservaId, nuevaFechaFin, req.userId);
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
        const resultado = await ReservaService.finalizarReserva(reservaId);
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
      const [data, error] = await ReservaService.obtenerDatosGraficos();
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
    obtenerDatosGraficos,
};
